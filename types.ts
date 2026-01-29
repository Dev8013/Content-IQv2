
export enum AnalysisType {
  YOUTUBE = 'youtube',
  PDF = 'pdf',
  RESUME = 'resume',
  IMAGE_GEN = 'image_gen',
  PDF_REFINE = 'pdf_refine'
}

export interface HistoryItem {
  id: string;
  type: AnalysisType;
  timestamp: number;
  title: string;
  thumbnail?: string;
  result: AnalysisResult;
}

export interface AnalysisResult {
  summary: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  generatedImageUrl?: string;
  tags?: string[];
  scores: {
    clarity: number;
    engagement: number;
    originality: number;
    structure: number;
    overall: number;
  };
  improvements: string[];
  tips: {
    thumbnails?: string;
    titles?: string;
    description?: string;
    tags?: string;
    content?: string;
    formatting?: string;
  };
}

export interface User {
  username: string;
  isLoggedIn: boolean;
  avatar?: string;
}
