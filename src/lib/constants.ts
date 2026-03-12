import { 
  Platform, 
  Template, 
  DashboardStats, 
  Campaign, 
  BrandDNA, 
  ActivityItem,
  ContentPiece,
  CampaignDetail
} from './api/types';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export const PLATFORMS: { id: Platform; label: string; icon: any; color: string; accent: string }[] = [
  { id: 'FB', label: 'Facebook', icon: Facebook, color: '#1877F2', accent: '#E7F3FF' },
  { id: 'IG', label: 'Instagram', icon: Instagram, color: '#E4405F', accent: '#FDF2F4' },
  { id: 'LI', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2', accent: '#E6F0F9' },
  { id: 'TW', label: 'Twitter / X', icon: Twitter, color: '#1DA1F2', accent: '#E8F5FD' }
];

export const TEMPLATES: Template[] = [
  { id: 'Sales', label: 'Flash Sale', description: 'Drive immediate purchases with urgency.' },
  { id: 'Awareness', label: 'Brand Story', description: 'Introduce your brand values and mission.' },
  { id: 'Product Launch', label: 'New Arrival', description: 'Build hype for your latest product.' },
  { id: 'Event', label: 'Webinar/Event', description: 'Invite users to join your session.' },
  { id: 'Seasonal', label: 'Holiday Special', description: 'Leverage seasonal trends.' }
];

// Fallback Mock Data for Production Safety
export const MOCK_STATS: DashboardStats = {
  brandDnaScore: 87,
  brandDnaLabel: 'Strong positioning',
  campaignsActive: 2,
  campaignsLiveCount: 1,
  scheduledPostsThisWeek: 8,
  totalReach: '24.3K',
  reachGrowthPct: '+12%',
  contentPiecesGenerated: 36,
  contentPiecesPending: 12
};

export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Q3 Product Launch', color: '#7C3AED', platforms: ['LI', 'TW'], status: 'live', postsCount: 12, reach: '45.2K' },
  { id: '2', name: 'Founder Story Series', color: '#10B981', platforms: ['IG', 'LI'], status: 'scheduled', postsCount: 4, reach: null },
  { id: '3', name: 'Holiday Promo 2026', color: '#EA580C', platforms: ['IG', 'LI', 'TW'], status: 'draft', postsCount: 8, reach: null },
  { id: '4', name: 'Weekly Roundup', color: '#3B82F6', platforms: ['TW'], status: 'live', postsCount: 2, reach: '12.1K' }
];

export const MOCK_BRAND_DNA: BrandDNA = {
  id: 'dna_123',
  score: 87,
  tone: 'Authoritative',
  audience: 'B2B Founders',
  voice: 'Direct, Data-driven',
  positioning: 'Premium Disruptor',
  lastUpdated: new Date().toISOString(),
  usps: ['Speed', 'Simplicity', 'Innovation', 'Support', 'Quality']
};

export const MOCK_CONTENT_PIECES: ContentPiece[] = [
  {
    id: 'cp1',
    platform: 'LI',
    caption: 'Big news! Our Q3 lineup is finally here. We prioritized speed and power this time. #ProductLaunch #Innovation',
    scheduledAt: '2026-03-20T10:00:00Z',
    status: 'approved',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'cp2',
    platform: 'TW',
    caption: 'Ready to level up your workflow? The Q3 update is live. Check it out at the link in bio. #SaaS #BuildInPublic',
    scheduledAt: '2026-03-21T15:30:00Z',
    status: 'pending',
    imageUrl: null
  }
];

export const MOCK_CAMPAIGN_DETAIL: CampaignDetail = {
  ...MOCK_CAMPAIGNS[0],
  contentPieces: MOCK_CONTENT_PIECES,
  brandDnaId: 'dna_123',
  uspsSelected: ['Speed', 'Innovation'],
  templatesSelected: ['Flash Sale', 'Product Launch'],
  goal: 'Boost signups by 20%',
};

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', text: 'Campaign "Summer Sale" generated', timestamp: '10 mins ago' },
  { id: '2', text: 'Brand DNA score updated', timestamp: '1 hr ago' },
  { id: '3', text: '3 posts published to LinkedIn', timestamp: '3 hrs ago' },
  { id: '4', text: 'New audience insight identified', timestamp: 'Yesterday' },
  { id: '5', text: 'Billing plan upgraded to Pro', timestamp: 'Yesterday' }
];
