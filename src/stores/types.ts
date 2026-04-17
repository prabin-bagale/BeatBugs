// Core domain types shared across the application

export type ViewType = 'home' | 'browse' | 'beat-detail' | 'producer' | 'auth' | 'producer-dashboard' | 'buyer-dashboard' | 'checkout';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'producer' | 'buyer';
  avatar?: string;
  bio?: string;
  verified?: boolean;
}

export interface Beat {
  id: string;
  title: string;
  description?: string;
  genre: string;
  subGenre?: string;
  bpm: number;
  key: string;
  mood?: string;
  tags: string;
  coverUrl: string;
  audioPreviewUrl: string;
  audioFileUrl?: string;
  plays: number;
  sales: number;
  status: string;
  exclusiveSold: boolean;
  basicPrice: number;
  premiumPrice: number;
  exclusivePrice: number;
  producerId: string;
  producer?: {
    id: string;
    name: string;
    avatar?: string;
    verified?: boolean;
    beats?: Beat[];
  };
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  beatId: string;
  licenseType: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  buyer?: Pick<User, 'id' | 'name' | 'avatar'>;
  beat?: {
    id: string;
    title: string;
    coverUrl: string;
    genre: string;
    basicPrice: number;
    premiumPrice: number;
    exclusivePrice: number;
    producer?: Pick<User, 'id' | 'name' | 'avatar'>;
  };
}