export type Category = 
  | 'Cryoprotectants' 
  | 'Vitrification' 
  | 'Organ Preservation' 
  | 'Neural Preservation' 
  | 'Cardiac Preservation' 
  | 'Ice Physics & Thermodynamics' 
  | 'Rewarming Techniques' 
  | 'Toxicity & Biocompatibility' 
  | 'Nanotechnology Methods' 
  | 'Clinical Applications';

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  category: Category;
  organType: string;
  techniqueType: string;
  publicationType: string;
  year: number;
  abstract: string;
  keyFindings: string[];
  citations: string[]; // array of paper ids
  position: [number, number, number]; // x, y, z
}

export interface QueryResult {
  answer: string;
  insights: {
    agreements: string[];
    contradictions: string[];
    trends: string[];
  };
  sources: string[]; // array of paper ids
  confidence: 'High' | 'Medium' | 'Low';
}
