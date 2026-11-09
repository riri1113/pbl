export type SupportedLang = 'ja' | 'en' | 'zh' | 'ko';

export interface LanguageOption {
  code: SupportedLang;
  label: string;
  nativeLabel: string;
  flag: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Spot {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  description: string;
  jrTip: string;
  recommendPoint?: string;
  photoTip: string;
  hashtags: string[];
  imageUrl: string;
  accentColor: string;
  recommendedOrder: number;
  mapQuery?: string;
  stampIcon: string;
  stampName: string;
  stampShort: string;
  stampColor?: string;
  lat: number;
  lng: number;
  distanceKm?: number;
}

export interface StampRecord {
  spotId: string;
  stampedAt: string; // ISO string
  photoDataUrl?: string;
  socialNetwork?: string;
}

export interface TicketData {
  isUnlocked: boolean;
  isUsed: boolean;
  usedAt: string | null;
  ticketCode: string;
  issuedAt: string;
  rewardTitle?: string;
  amount?: number;
}

export type TabType = 'home' | 'ticket' | 'guide';
