import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line, Text, MapControls } from '@react-three/drei';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore, paperFilterSnapshot } from '../store';
import type { Paper } from '../types';
import { LEAF_HEX_COLORS, LEAF_HEX_FALLBACK } from '../data/searchSchema';
import { hasActiveFilters, paperMatchesFilters } from '../utils/paperFilters';

function nodeColor(paper: Paper): string {
  const modelLeaf = paper.model_type && paper.model_type.length > 0 ? paper.model_type[0] : '';
  return LEAF_HEX_COLORS[modelLeaf] ?? LEAF_HEX_FALLBACK;
}

const Nodes = ({ papers, highlightedNodes, selectedPaper, hoveredPaper, onNodeClick, onNodeHover }: any) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const colorArray = useMemo(() => new Float32Array(papers.length * 3), [papers]);
  const tempObject = new THREE.Object3D();
  const tempColor = new THREE.Color();

  const hasHighlights = highlightedNodes.length > 0;

  useEffect(() => {
    if (!meshRef.current) return;
    
    papers.forEach((paper: Paper, i: number) => {
      const isSelected = selectedPaper?.id === paper.id;
      const isHighlighted = highlightedNodes.includes(paper.id);
      const isHovered = hoveredPaper?.id === paper.id;
      
      let size = 1.2;
      if (isSelected) size = 2.0;
      else if (isHighlighted) size = 1.6;
      else if (isHovered) size = 1.5;
      else if (hasHighlights) size = 0.6;

      tempObject.position.set(...paper.position);
      tempObject.scale.setScalar(size);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);

      const baseColor = nodeColor(paper);
      tempColor.set(baseColor);
      
      // We can adjust color brightness or just rely on material properties
      // For InstancedMesh, emissive is global, so we can't easily have per-instance emissive.
      // Instead, we can brighten the color itself for highlighted nodes.
      if (isSelected || isHighlighted || isHovered) {
        tempColor.multiplyScalar(2.0); // Brighten more
      } else if (hasHighlights) {
        tempColor.multiplyScalar(0.4); // Dim less
      } else {
        tempColor.multiplyScalar(1.3); // Make default bolder
      }

      tempColor.toArray(colorArray, i * 3);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [papers, highlightedNodes, selectedPaper, hoveredPaper, hasHighlights]);

  useFrame((state) => {
    if (!meshRef.current) return;
    papers.forEach((paper: Paper, i: number) => {
      const isSelected = selectedPaper?.id === paper.id;
      const isHighlighted = highlightedNodes.includes(paper.id);
      const isHovered = hoveredPaper?.id === paper.id;
      
      let size = 1.2;
      if (isSelected) size = 2.0 + Math.sin(state.clock.elapsedTime * 6) * 0.3;
      else if (isHighlighted) size = 1.6 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      else if (isHovered) size = 1.5;
      else if (hasHighlights) size = 0.6;

      tempObject.position.set(
        paper.position[0],
        paper.position[1],
        paper.position[2]
      );
      tempObject.scale.setScalar(size);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (e.instanceId !== undefined) {
      document.body.style.cursor = 'pointer';
      onNodeHover(papers[e.instanceId]);
    }
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    onNodeHover(null);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (e.instanceId !== undefined) {
      onNodeClick(papers[e.instanceId]);
    }
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, papers.length]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <circleGeometry args={[1, 32]}>
        <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </circleGeometry>
      <meshBasicMaterial vertexColors toneMapped={false} transparent opacity={1.0} />
      
      {hoveredPaper && (
        <Html position={hoveredPaper.position} distanceFactor={10} zIndexRange={[100, 0]}>
          <div className="bg-[#1a1a1e]/95 backdrop-blur-md border border-slate-700 text-slate-200 p-2.5 rounded-xl shadow-lg w-56 pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-12px]">
            <p className="text-sm font-bold truncate">{hoveredPaper.title}</p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">{hoveredPaper.publication_year} • {hoveredPaper.model_type?.[0] || 'Unknown'} · {hoveredPaper.research_type?.[0] || 'Unknown'}</p>
          </div>
        </Html>
      )}
    </instancedMesh>
  );
};

const StaticEdges = ({ papers, hasHighlights }: { papers: Paper[], hasHighlights: boolean }) => {
  const lineGeometry = useMemo(() => {
    const points: number[] = [];
    const colors: number[] = [];
    const colorObj1 = new THREE.Color();
    const colorObj2 = new THREE.Color();

    papers.forEach(p1 => {
      p1.internal_citations.forEach(citId => {
        const p2 = papers.find(p => p.id === citId);
        if (p2) {
          points.push(p1.position[0], p1.position[1], 0);
          points.push(p2.position[0], p2.position[1], 0);

          colorObj1.set(nodeColor(p1)).multiplyScalar(1.5);
          colorObj2.set(nodeColor(p2)).multiplyScalar(1.5);

          colors.push(colorObj1.r, colorObj1.g, colorObj1.b);
          colors.push(colorObj2.r, colorObj2.g, colorObj2.b);
        }
      });
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [papers]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial vertexColors transparent opacity={hasHighlights ? 0.1 : 0.4} />
    </lineSegments>
  );
};

const AnimatedLine = ({ start, end, color, opacity, lineWidth, isHighlighted }: any) => {
  const lineRef = useRef<any>(null);
  
  useFrame((state) => {
    if (lineRef.current && lineRef.current.material && isHighlighted) {
      lineRef.current.material.dashOffset -= 0.05;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={[start, end]}
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={opacity}
      dashed={isHighlighted}
      dashScale={2}
      dashSize={0.5}
      dashOffset={0}
      gapSize={0.5}
    />
  );
};

const HighlightedEdges = ({ papers, highlightedNodes }: { papers: Paper[], highlightedNodes: number[] }) => {
  const lines = useMemo(() => {
    const result: any[] = [];
    if (highlightedNodes.length === 0) return result;
    
    papers.forEach(p1 => {
      if (!highlightedNodes.includes(p1.id)) return;
      p1.internal_citations.forEach(citId => {
        if (!highlightedNodes.includes(citId)) return;
        const p2 = papers.find(p => p.id === citId);
        if (p2) {
          result.push({
            start: [p1.position[0], p1.position[1], 0],
            end: [p2.position[0], p2.position[1], 0],
            color: '#ffffff', // bright white
            opacity: 1.0,
            lineWidth: 3,
            isHighlighted: true
          });
        }
      });
    });
    return result;
  }, [papers, highlightedNodes]);

  return (
    <>
      {lines.map((line, i) => (
        <AnimatedLine
          key={i}
          start={line.start}
          end={line.end}
          color={line.color}
          lineWidth={line.lineWidth}
          opacity={line.opacity}
          isHighlighted={line.isHighlighted}
        />
      ))}
    </>
  );
};

const CameraController = ({
  controlsRef,
  userInteracting,
  filteredPapers,
}: {
  controlsRef: React.RefObject<any>;
  userInteracting: React.MutableRefObject<boolean>;
  filteredPapers: Paper[];
}) => {
  const { camera } = useThree();
  const selectedPaper = useAppStore((s) => s.selectedPaper);
  const highlightedNodes = useAppStore((s) => s.highlightedNodes);

  useFrame(() => {
    if (!controlsRef.current || userInteracting.current) return;

    if (selectedPaper) {
      const targetPos = new THREE.Vector3(selectedPaper.position[0], selectedPaper.position[1], 0);
      const cameraTargetPos = targetPos.clone().add(new THREE.Vector3(0, 0, 15));
      camera.position.lerp(cameraTargetPos, 0.05);
      controlsRef.current.target.lerp(targetPos, 0.05);
      controlsRef.current.update();
    } else if (highlightedNodes.length > 0) {
      const box = new THREE.Box3();
      const paperById = useAppStore.getState().papers;
      highlightedNodes.forEach((id) => {
        const p = paperById.find((p) => p.id === id);
        if (p) box.expandByPoint(new THREE.Vector3(p.position[0], p.position[1], 0));
      });
      if (!box.isEmpty()) {
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.lerp(center.clone().add(new THREE.Vector3(0, 0, Math.max(30, maxDim * 1.5))), 0.03);
        controlsRef.current.target.lerp(center, 0.03);
        controlsRef.current.update();
      }
    } else if (filteredPapers.length > 0 && filteredPapers.length < useAppStore.getState().papers.length) {
      const box = new THREE.Box3();
      filteredPapers.forEach((p) => box.expandByPoint(new THREE.Vector3(p.position[0], p.position[1], 0)));
      if (!box.isEmpty()) {
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.lerp(center.clone().add(new THREE.Vector3(0, 0, Math.max(30, maxDim * 1.5))), 0.03);
        controlsRef.current.target.lerp(center, 0.03);
        controlsRef.current.update();
      }
    }
  });
  return null;
};

export const GraphView: React.FC = () => {
  // Shallow-compare the filter snapshot so filteredPapers only recomputes when
  // an actual filter value changes, not on every hover/selection update.
  const filterState = useAppStore(useShallow(paperFilterSnapshot));
  const papers = useAppStore((s) => s.papers);
  const selectedPaper = useAppStore((s) => s.selectedPaper);
  const setSelectedPaper = useAppStore((s) => s.setSelectedPaper);
  const hoveredPaper = useAppStore((s) => s.hoveredPaper);
  const setHoveredPaper = useAppStore((s) => s.setHoveredPaper);
  const highlightedNodes = useAppStore((s) => s.highlightedNodes);

  const filteredPapers = useMemo(
    () => papers.filter((p) => paperMatchesFilters(p, filterState)),
    [papers, filterState]
  );

  const controlsRef = useRef<any>(null);
  const userInteracting = useRef(false);

  const hasHighlights = highlightedNodes.length > 0;

  const topNodes = useMemo(() => {
    return [...filteredPapers].sort((a, b) => (b.citations || 0) - (a.citations || 0)).slice(0, 25);
  }, [filteredPapers]);

  return (
    <div className="w-full h-full bg-transparent relative">
      <Canvas 
        camera={{ position: [0, 0, 80], fov: 60 }}
        onPointerMissed={() => setSelectedPaper(null)}
      >
        <ambientLight intensity={1} />
        
        <group position={[0, 0, 0]}>
          <Nodes 
            papers={filteredPapers} 
            highlightedNodes={highlightedNodes}
            selectedPaper={selectedPaper}
            hoveredPaper={hoveredPaper}
            onNodeClick={setSelectedPaper}
            onNodeHover={setHoveredPaper}
          />
          <StaticEdges papers={filteredPapers} hasHighlights={hasHighlights} />
          <HighlightedEdges papers={filteredPapers} highlightedNodes={highlightedNodes} />
          
          {topNodes.map(p => {
            let authorStr = 'Unknown';
            if (p.authors && p.authors.length > 0) {
              const firstAuthor = p.authors[0].trim();
              if (firstAuthor.includes(',')) {
                authorStr = firstAuthor.split(',')[0].trim();
              } else {
                const parts = firstAuthor.split(' ');
                authorStr = parts[parts.length - 1].trim();
              }
            }
            const label = `${authorStr} et al., ${p.publication_year || 'YYYY'}`;
            return (
              <Text
                key={`label-${p.id}`}
                position={[p.position[0], p.position[1] - 1.5, 0]}
                fontSize={1.2}
                color="#e2e8f0"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.1}
                outlineColor="#000000"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPaper(p);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                  setHoveredPaper(p);
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'auto';
                  setHoveredPaper(null);
                }}
              >
                {label}
              </Text>
            );
          })}
        </group>
        
        <CameraController controlsRef={controlsRef} userInteracting={userInteracting} filteredPapers={filteredPapers} />
        <MapControls 
          ref={controlsRef}
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={false}
          enableDamping={true}
          dampingFactor={0.08}
          zoomSpeed={0.6}
          panSpeed={0.8}
          minDistance={15}
          maxDistance={150}
          onStart={() => { userInteracting.current = true; }}
          onEnd={() => { 
            setTimeout(() => { userInteracting.current = false; }, 3000);
          }}
        />
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <h2 className="text-slate-500 font-medium text-xs tracking-widest uppercase">Knowledge Graph</h2>
      </div>
    </div>
  );
};
