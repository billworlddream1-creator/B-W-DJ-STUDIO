
export interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  genre: string;
  duration: number;
  url: string;
  cover: string;
}

export interface AISuggestion {
  transitionMethod: string;
  description: string;
  timingHint: string;
}

export enum Side {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export enum AppView {
  STUDIO = 'STUDIO',
  ADMIN = 'ADMIN',
  PRICING = 'PRICING'
}

export enum BottomSection {
  LIBRARY = 'LIBRARY',
  INSTRUMENTS = 'INSTRUMENTS',
  COMPOSE = 'COMPOSE',
  SFX = 'SFX'
}

export interface UserProfile {
  id: string;
  username: string;
  tier: 'FREE' | 'PRO';
  referralCode: string;
  referralCount: number;
  joinedAt: string;
  themeColor: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  lastActive: string;
}

export interface AdminMessage {
  id: string;
  targetUserId: string | 'ALL';
  content: string;
  timestamp: string;
  sender: string;
}

export interface AIComposition {
  drums: string[];
  melody: number[];
  vocalScript: string;
  lyrics?: string;
}
