
export enum AnalysisType {
  YOUTUBE = 'youtube',
  COMPETITIVE_AUDIT = 'competitive_audit',
  CHANNEL_DEEP_DIVE = 'channel_deep_dive',
  TREND_STRATEGY = 'trend_strategy',
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

export interface AnalysisVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  publishedAt: string;
  duration: string;
}

export interface AnalysisResult {
  summary: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  generatedImageUrl?: string;
  thumbnailReview?: string;
  tags?: string[];
  sources?: { title: string; uri: string }[];
  scores: {
    clarity: number;
    engagement: number;
    originality?: number;
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
    strategy?: string;
  };
  stats?: {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
  }[];
  chartData?: {
    name: string;
    value: number;
    secondaryValue?: number;
  }[];
  channelVideos?: AnalysisVideo[];
  channelMetadata?: {
    bannerUrl?: string;
    avatarUrl?: string;
    subscriberCount?: string;
    videoCount?: string;
    handle?: string;
    description?: string;
  };
}

export interface User {
  username: string;
  isLoggedIn: boolean;
  avatar?: string;
}
