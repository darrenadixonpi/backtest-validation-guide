export type Level = 'beginner' | 'professional' | 'math';

export type Term = {
  id: string;
  name: string;
  aliases?: string[];
  category: string;
  beginner: string;
  professional: string;
  math?: string;
  related: string[];
};

export type Method = {
  id: string;
  name: string;
  category: string;
  estimand: string;
  leakageControl: string;
  handlesManyParams: string;
  outputType: string;
  assumptions: string;
  pros: string[];
  cons: string[];
  whenToUse: string;
  relatedTerms: string[];
};

export const CATEGORIES = [
  'Foundations',
  'Strategy & Data',
  'Leakage & Dependence',
  'Split Methods',
  'Bootstrap & Uncertainty',
  'Multiple Testing',
  'Diagnostics',
  'Live Trading',
] as const;
