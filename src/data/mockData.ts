import { Category, Paper } from '../types';

const CATEGORIES: Category[] = [
  'Cryoprotectants', 
  'Vitrification', 
  'Organ Preservation', 
  'Neural Preservation', 
  'Cardiac Preservation', 
  'Ice Physics & Thermodynamics', 
  'Rewarming Techniques', 
  'Toxicity & Biocompatibility', 
  'Nanotechnology Methods', 
  'Clinical Applications'
];

const CATEGORY_CENTERS: Record<string, [number, number, number]> = {
  'Cryoprotectants': [0, 0, 0],
  'Vitrification': [40, 25, 0],
  'Organ Preservation': [-40, 30, 0],
  'Neural Preservation': [50, -20, 0],
  'Cardiac Preservation': [-35, -40, 0],
  'Ice Physics & Thermodynamics': [0, 50, 0],
  'Rewarming Techniques': [0, -50, 0],
  'Toxicity & Biocompatibility': [60, 30, 0],
  'Nanotechnology Methods': [-60, -15, 0],
  'Clinical Applications': [30, -55, 0]
};

const generatePosition = (category: Category): [number, number, number] => {
  const randomGaussian = () => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  };

  const center = CATEGORY_CENTERS[category] || [0, 0, 0];
  // 2D spread: wider spread in X and Y, flat in Z
  return [
    center[0] + randomGaussian() * 8,
    center[1] + randomGaussian() * 8,
    0
  ];
};

const generateAuthors = () => {
  const firstNames = ['James', 'Sarah', 'Michael', 'Elena', 'David', 'Anna', 'Robert', 'Maria', 'William', 'Linda', 'Chen', 'Yuki', 'Aisha', 'Omar', 'Li', 'Wei', 'Sofia', 'Lucas'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wang', 'Tanaka', 'Patel', 'Kim', 'Silva', 'Muller', 'Ivanov', 'Ali'];
  const numAuthors = Math.floor(Math.random() * 5) + 1;
  const authors = [];
  for (let i = 0; i < numAuthors; i++) {
    authors.push(`${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`);
  }
  return authors;
};

const generatePaper = (id: number, category: Category): Paper => {
  const year = Math.floor(Math.random() * 37) + 1990; // 1990 - 2026
  
  const titles: Record<string, string[]> = {
    'Cryoprotectants': [
      'Novel Non-Toxic CPAs', 'DMSO Alternatives in Cryobiology', 'Trehalose Loading in Mammalian Cells',
      'Synthetic Polymers for Ice Inhibition', 'Osmotic Stress Reduction Strategies', 'Permeating vs Non-Permeating Agents'
    ],
    'Vitrification': [
      'Vitrification of Complex Tissues', 'Cooling Rates for Glass Transition', 'Avoiding Devitrification Post-Thaw',
      'High-Concentration CPA Cocktails', 'Vitrification in Reproductive Medicine', 'Scaling Vitrification to Large Volumes'
    ],
    'Organ Preservation': [
      'Renal Vitrification and Transplantation', 'Hepatic Cryopreservation Challenges', 'Whole Organ Supercooling',
      'Vascular Fractures during Cryopreservation', 'Pancreatic Islet Cryostorage', 'Lung Tissue Preservation at -196°C'
    ],
    'Neural Preservation': [
      'Neural Vitrification Techniques', 'Synaptic Preservation in Deep Freeze', 'Cryonic Suspension of Cortical Tissue',
      'Glial Cell Survival Rates at -196°C', 'Mapping Connectomes Post-Thaw', 'Ischemic Tolerance in Neural Networks'
    ],
    'Cardiac Preservation': [
      'Myocardial Cryopreservation Protocols', 'Cardiomyocyte Survival Post-Thaw', 'Vitrification of Whole Mammalian Hearts',
      'Preventing Ischemic Injury in Cryonic Hearts', 'Aortic Arch Preservation Techniques', 'Rewarming Protocols for Ventricular Tissue'
    ],
    'Ice Physics & Thermodynamics': [
      'Thermodynamics of Ice Nucleation', 'Fracture Mechanics in Vitrified States', 'Phase Transition Mapping at Cryogenic Temps',
      'Thermal Stress in Bulk Tissues', 'Heat Transfer Models in Cryopreservation', 'Crystallization Kinetics in Aqueous Solutions'
    ],
    'Rewarming Techniques': [
      'Acoustic Rewarming Technologies', 'Electromagnetic Thawing of Large Volumes', 'Nanowarming using Magnetic Iron Oxide',
      'Radiofrequency Excitation of Nanoparticles', 'Convective Warming vs Microwave Thawing', 'Preventing Thermal Runaway'
    ],
    'Toxicity & Biocompatibility': [
      'Toxicity Profiles of Permeating CPAs', 'Cellular Apoptosis Post-Thaw', 'Metabolic Recovery after Cryopreservation',
      'Reducing DMSO Cytotoxicity', 'Biocompatibility of Synthetic Ice Blockers', 'Oxidative Stress in Cryopreserved Cells'
    ],
    'Nanotechnology Methods': [
      'Nanoparticle Warming of Vitrified Tissues', 'Silica Nanoparticles for Ice Inhibition', 'Targeted Delivery of CPAs via Nanocarriers',
      'Magnetic Nanowarming Protocols', 'Nanoscale Thermal Sensors in Cryobiology', 'Graphene Oxide in Cryopreservation'
    ],
    'Clinical Applications': [
      'Cryobanking of Stem Cells', 'Clinical Outcomes of Vitrified Oocytes', 'Translational Cryobiology in Surgery',
      'Long-term Storage of Blood Products', 'Cryopreservation in Tissue Engineering', 'Regulatory Challenges in Organ Banking'
    ]
  };

  const titlePrefix = titles[category][Math.floor(Math.random() * titles[category].length)];
  const title = `${titlePrefix}: A ${year} Study`;

  const organTypes = ['Brain', 'Heart', 'Kidney', 'Liver', 'Whole Body', 'None'];
  const techniqueTypes = ['Vitrification', 'Slow Freezing', 'Liquid Ventilation', 'Nanowarming', 'Perfusion'];
  const publicationTypes = ['Research Paper', 'Journal', 'Preprint', 'Conference Proceeding', 'Technical Report', 'Grey Literature'];

  return {
    id: `paper-${id}`,
    title,
    authors: generateAuthors(),
    category,
    organType: organTypes[Math.floor(Math.random() * organTypes.length)],
    techniqueType: techniqueTypes[Math.floor(Math.random() * techniqueTypes.length)],
    publicationType: publicationTypes[Math.floor(Math.random() * publicationTypes.length)],
    year,
    abstract: `This study explores the challenges and recent advancements in ${category.toLowerCase()} cryopreservation. We present novel methodologies that significantly improve post-thaw viability. Our results indicate a promising direction for future clinical applications.`,
    keyFindings: [
      `Improved viability by ${Math.floor(Math.random() * 40) + 10}% compared to control.`,
      `Identified key mechanisms of chilling injury in ${category.toLowerCase()} tissues.`,
      `Optimized cooling rates for maximum cellular survival.`
    ],
    citations: [], // Will be populated later
    position: generatePosition(category)
  };
};

export const MOCK_PAPERS: Paper[] = [];

// Generate 2000 papers
for (let i = 1; i <= 2000; i++) {
  const category = CATEGORIES[i % CATEGORIES.length];
  MOCK_PAPERS.push(generatePaper(i, category));
}

// Add random citations (edges) with dense intra-cluster and some cross-cluster
MOCK_PAPERS.forEach(paper => {
  const numCitations = Math.floor(Math.random() * 6) + 3; // 3 to 8 citations
  for (let i = 0; i < numCitations; i++) {
    // 85% chance to cite within same category, 15% chance for cross-cluster
    const citeSameCategory = Math.random() < 0.85;
    let targetPool = citeSameCategory 
      ? MOCK_PAPERS.filter(p => p.category === paper.category)
      : MOCK_PAPERS.filter(p => p.category !== paper.category);
    
    if (targetPool.length === 0) targetPool = MOCK_PAPERS;

    const randomPaper = targetPool[Math.floor(Math.random() * targetPool.length)];
    if (randomPaper.id !== paper.id && !paper.citations.includes(randomPaper.id)) {
      paper.citations.push(randomPaper.id);
    }
  }
});

// Generate Impact Chains
export const IMPACT_CHAINS: string[][] = [];

const generateChain = (startCategory: Category, length: number) => {
  const chain: string[] = [];
  let currentPaper = MOCK_PAPERS.find(p => p.category === startCategory);
  if (!currentPaper) return [];
  
  chain.push(currentPaper.id);
  
  for (let i = 1; i < length; i++) {
    // Try to find a cited paper, or just pick a random paper in the same category to force a chain
    let nextPaperId = currentPaper.citations.find(id => !chain.includes(id));
    
    if (!nextPaperId) {
      const pool = MOCK_PAPERS.filter(p => p.category === currentPaper!.category && !chain.includes(p.id));
      if (pool.length > 0) {
        nextPaperId = pool[Math.floor(Math.random() * pool.length)].id;
        // Ensure they are connected
        currentPaper.citations.push(nextPaperId);
      }
    }
    
    if (nextPaperId) {
      chain.push(nextPaperId);
      currentPaper = MOCK_PAPERS.find(p => p.id === nextPaperId);
      if (!currentPaper) break;
    } else {
      break;
    }
  }
  return chain;
};

IMPACT_CHAINS.push(generateChain('Vitrification', 5));
IMPACT_CHAINS.push(generateChain('Toxicity & Biocompatibility', 6));
IMPACT_CHAINS.push(generateChain('Neural Preservation', 5));
IMPACT_CHAINS.push(generateChain('Rewarming Techniques', 4));
IMPACT_CHAINS.push(generateChain('Organ Preservation', 6));
