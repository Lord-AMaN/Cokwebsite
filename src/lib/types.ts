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

export type Page = "home" | "packages" | "skins" | "consultation" | "admin";
