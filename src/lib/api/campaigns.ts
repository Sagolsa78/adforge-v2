import { Campaign, CampaignDetail, GenerateCampaignPayload } from './types';
import { 
  MOCK_CAMPAIGNS, 
  MOCK_CAMPAIGN_DETAIL 
} from '../constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getAuthHeaders() {
  return {
    'Authorization': `Bearer mock-token`,
    'Content-Type': 'application/json',
  };
}

async function apiRequest<T>(url: string, options: RequestInit, fallback: T): Promise<T> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}${url}`, { ...options, headers });
    if (!res.ok) return fallback;
    return await res.json();
  } catch (error) {
    console.error(`API Request error for ${url}:`, error);
    return fallback;
  }
}

export async function getCampaigns(userId: string): Promise<Campaign[]> {
  return apiRequest<Campaign[]>(`/api/campaigns?userId=${userId}`, { method: 'GET' }, MOCK_CAMPAIGNS);
}

export async function getCampaign(id: string): Promise<CampaignDetail> {
  return apiRequest<CampaignDetail>(`/api/campaigns/${id}`, { method: 'GET' }, MOCK_CAMPAIGN_DETAIL);
}

export async function generateCampaign(payload: GenerateCampaignPayload): Promise<{ campaignId: string }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/campaigns/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
        // Simulated lag for AI generation feel
        await new Promise(resolve => setTimeout(resolve, 3000));
        return { campaignId: '1' };
    }
    return await res.json();
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return { campaignId: '1' };
  }
}
