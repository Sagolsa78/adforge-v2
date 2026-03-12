// NEXT_PUBLIC_API_URL=http://localhost:8000
// NEXTAUTH_SECRET=
// NEXTAUTH_URL=http://localhost:3000

import { ActivityItem, BrandDNA, Campaign, DashboardStats } from './types';
import { getServerSession } from 'next-auth';
// Assuming you have an auth options file, otherwise we can assume next-auth will figure it out
// import { authOptions } from '../auth'; // Optional

import { 
  MOCK_STATS, 
  MOCK_CAMPAIGNS, 
  MOCK_BRAND_DNA, 
  MOCK_ACTIVITY 
} from '../constants';

async function getAuthHeaders() {
  return {
    'Authorization': `Bearer mock-token`,
    'Content-Type': 'application/json',
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchWithAuth<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      console.warn(`API ${endpoint} failed (${response.status}), providing fallback`);
      return fallback;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    return fallback;
  }
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  return fetchWithAuth<DashboardStats>(`/api/dashboard/stats?userId=${userId}`, MOCK_STATS);
}

export async function getCampaigns(userId: string): Promise<Campaign[]> {
  return fetchWithAuth<Campaign[]>(`/api/campaigns?userId=${userId}`, MOCK_CAMPAIGNS);
}

export async function getBrandDNA(userId: string): Promise<BrandDNA> {
  return fetchWithAuth<BrandDNA>(`/api/brand-dna?userId=${userId}`, MOCK_BRAND_DNA);
}

export async function getRecentActivity(userId: string): Promise<ActivityItem[]> {
  return fetchWithAuth<ActivityItem[]>(`/api/activity?userId=${userId}&limit=5`, MOCK_ACTIVITY);
}
