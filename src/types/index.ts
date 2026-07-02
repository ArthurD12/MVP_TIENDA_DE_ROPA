export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'damas' | 'caballeros' | 'accesorios' | 'conjuntos';
  badge?: 'nuevo' | 'tendencia' | 'oferta';
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
}

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  catalogCategory: 'calzado' | 'pantalon' | 'blusa' | 'falda';
  badge?: 'nuevo' | 'tendencia' | 'oferta';
  rating: number;
  reviews: number;
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL')[];
  colors: string[];
}

export interface AccessoryProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  accessoryCategory: 'bolso' | 'cinturon' | 'gafas' | 'joyeria';
  badge?: 'nuevo' | 'tendencia' | 'oferta';
  rating: number;
  reviews: number;
}

export interface Outfit {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  items: Product[];
  style: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pendiente' | 'en_proceso' | 'enviado' | 'entregado';
  total: number;
  items: CartItem[];
}

export interface Location {
  id: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface BodyMeasurements {
  chest: number | null;
  waist: number | null;
  hips: number | null;
}

export type FitType = 'Ajustado (Slim)' | 'Regular' | 'Holgado (Relaxed)' | 'Oversize';

export interface SavedOutfit {
  outfit: Outfit;
  savedAt: string;
}

export type ViewType =
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'home'
  | 'products'
  | 'accesorios'
  | 'outfits'
  | 'promotions'
  | 'shipping'
  | 'about'
  | 'profile'
  | 'ai-assistant';

export type ProfileTabType = 'data' | 'orders' | 'fit' | 'wardrobe';

export type DropdownType = 'ropa' | null;

export type CatalogCategoryFilter = 'calzado' | 'pantalon' | 'blusa' | 'falda';
export type CatalogSizeFilter = 'XS' | 'S' | 'M' | 'L' | 'XL';
