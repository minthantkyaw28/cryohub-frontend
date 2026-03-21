import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Line, Text, MapControls } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../store';
import { Paper, Category } from '../types';

const CATEGORY_COLORS: Record<Category, string> = {
  'Cryoprotectants': '#a855f7', // purple-500
  'Vitrification': '#06b6d4', // cyan-500
  'Organ Preservation': '#3b82f6', // blue-500
  'Neural Preservation': '#10b981', // emerald-500
  'Cardiac Preservation': '#f43f5e', // rose-500
  'Ice Physics & Thermodynamics': '#f59e0b', // amber-500
  'Rewarming Techniques': '#f97316', // orange-500
  'Toxicity & Biocompatibility': '#ef4444', // red-500
  'Nanotechnology Methods': '#6366f1', // indigo-500
  'Clinical Applications': '#14b8a6' // teal-500
};

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
      
      let size = 0.45;
      if (isSelected) size = 0.85;
      else if (isHighlighted) size = 0.7;
      else if (isHovered) size = 0.6;
      else if (hasHighlights) size = 0.25;

      tempObject.position.set(...paper.position);
      tempObject.scale.setScalar(size);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);

      const baseColor = CATEGORY_COLORS[paper.category as Category];
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
      
      let size = 0.45;
      if (isSelected) size = 0.85 + Math.sin(state.clock.elapsedTime * 6) * 0.15;
      else if (isHighlighted) size = 0.7 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      else if (isHovered) size = 0.6;
      else if (hasHighlights) size = 0.25;

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
      onNodeHover(papers[e.instanceId]);
    }
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
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
            <p className="text-[11px] text-slate-400 mt-1 font-medium">{hoveredPaper.year} • {hoveredPaper.category}</p>
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
      p1.citations.forEach(citId => {
        const p2 = papers.find(p => p.id === citId);
        if (p2) {
          points.push(p1.position[0], p1.position[1], 0);
          points.push(p2.position[0], p2.position[1], 0);

          colorObj1.set(CATEGORY_COLORS[p1.category as Category]).multiplyScalar(1.5);
          colorObj2.set(CATEGORY_COLORS[p2.category as Category]).multiplyScalar(1.5);

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

const HighlightedEdges = ({ papers, highlightedNodes }: { papers: Paper[], highlightedNodes: string[] }) => {
  const lines = useMemo(() => {
    const result: any[] = [];
    if (highlightedNodes.length === 0) return result;
    
    papers.forEach(p1 => {
      if (!highlightedNodes.includes(p1.id)) return;
      p1.citations.forEach(citId => {
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

const CameraController = ({ controlsRef, userInteracting }: { controlsRef: React.RefObject<any>, userInteracting: React.MutableRefObject<boolean> }) => {
  const { selectedPaper, highlightedNodes, papers, filters } = useAppStore();
  const { camera } = useThree();

  useFrame(() => {
    if (controlsRef.current && !userInteracting.current) {
      if (selectedPaper) {
        const targetPos = new THREE.Vector3(selectedPaper.position[0], selectedPaper.position[1], 0);

        const cameraTargetPos = targetPos.clone().add(new THREE.Vector3(0, 0, 15));
        
        camera.position.lerp(cameraTargetPos, 0.05);
        controlsRef.current.target.lerp(targetPos, 0.05);
        controlsRef.current.update();
      } else if (highlightedNodes.length > 0) {
        const box = new THREE.Box3();
        highlightedNodes.forEach(id => {
          const p = papers.find(p => p.id === id);
          if (p) {
            const pos = new THREE.Vector3(p.position[0], p.position[1], 0);
            box.expandByPoint(pos);
          }
        });
        
        if (!box.isEmpty()) {
          const center = new THREE.Vector3();
          box.getCenter(center);
          
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          
          const cameraTargetPos = center.clone().add(new THREE.Vector3(0, 0, Math.max(30, maxDim * 1.5)));
          
          camera.position.lerp(cameraTargetPos, 0.03);
          controlsRef.current.target.lerp(center, 0.03);
          controlsRef.current.update();
        }
      } else if (filters.length > 0) {
        const box = new THREE.Box3();
        papers.forEach(p => {
          if (filters.includes(p.category)) {
            const pos = new THREE.Vector3(p.position[0], p.position[1], 0);
            box.expandByPoint(pos);
          }
        });
        
        if (!box.isEmpty()) {
          const center = new THREE.Vector3();
          box.getCenter(center);
          
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          
          const cameraTargetPos = center.clone().add(new THREE.Vector3(0, 0, Math.max(30, maxDim * 1.5)));
          
          camera.position.lerp(cameraTargetPos, 0.03);
          controlsRef.current.target.lerp(center, 0.03);
          controlsRef.current.update();
        }
      }
    }
  });
  return null;
};

export const GraphView: React.FC = () => {
  const { 
    papers, 
    searchQuery, 
    filters, 
    organFilters,
    techniqueFilters,
    publicationFilters,
    selectedPaper, 
    setSelectedPaper,
    hoveredPaper,
    setHoveredPaper,
    highlightedNodes
  } = useAppStore();

  const controlsRef = useRef<any>(null);
  const userInteracting = useRef(false);

  const filteredPapers = useMemo(() => {
    return papers.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filters.length === 0 || filters.includes(p.category);
      const matchesOrgan = organFilters.length === 0 || organFilters.includes(p.organType);
      const matchesTechnique = techniqueFilters.length === 0 || techniqueFilters.includes(p.techniqueType);
      const matchesPublication = publicationFilters.length === 0 || publicationFilters.includes(p.publicationType);
      return matchesSearch && matchesCategory && matchesOrgan && matchesTechnique && matchesPublication;
    });
  }, [papers, searchQuery, filters, organFilters, techniqueFilters, publicationFilters]);

  const hasHighlights = highlightedNodes.length > 0;

  const topNodes = useMemo(() => {
    return [...filteredPapers].sort((a, b) => b.citations.length - a.citations.length).slice(0, 25);
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
            const label = p.title.split(' ')[0].toLowerCase();
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
              >
                {label}
              </Text>
            );
          })}
        </group>
        
        <CameraController controlsRef={controlsRef} userInteracting={userInteracting} />
        <MapControls 
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
          onStart={() => { userInteracting.current = true; }}
          onEnd={() => { 
            setTimeout(() => { userInteracting.current = false; }, 3000);
          }}
        />
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <h2 className="text-slate-200 font-display font-bold text-xl tracking-tight">Knowledge Graph</h2>
      </div>
    </div>
  );
};
