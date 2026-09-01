export type Package = {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  contents: string[];
  badge: string | null;
  image_url: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
};

export type Skin = {
  id: string;
  name: string;
  description: string;
  price: number;
  rarity: string;
  hero_name: string | null;
  image_url: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
};

export type Consultation = {
  id: string;
  service_name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
};

export type HallOfLoser = {
  id: string;
  ign: string;
  kingdom: string | null;
  title: string;
  crime: string;
  quote: string | null;
  photo_url: string | null;
  shame_score: number;
  sort_order: number;
  is_featured: boolean;
  evidence_photos: string | null;
  created_at: string;
  number : number;
};

export type Coupon = {
  id: string;
  code: string;
  discount_percent: number;
  applies_to_all: boolean;
  applies_to_resources: boolean;
  applies_to_skins: boolean;
  applies_to_castles: boolean;
  applies_to_bot_farms: boolean;
  is_active: boolean;
  starts_at: string;
  expires_at: string;
  max_redemptions: number | null;
  times_redeemed: number;
  created_at: string;
};

export type Page = "home" | "packages" | "skins" | "consultation" | "admin";