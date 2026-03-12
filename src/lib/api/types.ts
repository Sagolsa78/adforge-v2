export interface DashboardStats {
  brandDnaScore: number;
  brandDnaLabel: string;
  campaignsActive: number;
  campaignsLiveCount: number;
  scheduledPostsThisWeek: number;
  totalReach: string;
  reachGrowthPct: string;
  contentPiecesGenerated: number;
  contentPiecesPending: number;
}

export type Platform = 'IG' | 'LI' | 'TW' | 'FB';

export interface Campaign {
  id: string;
  name: string;
  color: string;
  platforms: Platform[];
  status: 'live' | 'scheduled' | 'draft';
  postsCount: number;
  reach: string | null;
}

export interface ContentPiece {
  id: string;
  platform: Platform;
  caption: string;
  scheduledAt: string;
  status: 'approved' | 'pending' | 'rejected';
  imageUrl: string | null;
}

export interface CampaignDetail extends Campaign {
  contentPieces: ContentPiece[];
  brandDnaId: string;
  uspsSelected: string[];
  templatesSelected: string[];
  goal: string;
}

export interface GenerateCampaignPayload {
  userId: string;
  brandDnaId: string;
  uspsSelected: string[];
  templatesSelected: string[];
  platformsSelected: Platform[];
  goal: string;
}

export interface Template {
  id: string;
  label: string;
  description: string;
}

export interface BrandDNA {
  id?: string;
  score: number;
  tone: string;
  audience: string;
  voice: string;
  positioning: string;
  lastUpdated: string;
  usps: string[];
}

export interface ActivityItem {
  id: string;
  text: string;
  timestamp: string;
}
