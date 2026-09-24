export interface Spot {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  description: string;
  tukTukTip: string;
  photoTip: string;
  hashtags: string[];
  imageUrl: string;
  accentColor: string;
  recommendedOrder: number;
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
}

export type TabType = 'home' | 'ticket' | 'guide';
