export type ProductCondition = "new" | "used" | "refurbished";
export type ProductStatus = "active" | "inactive";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  wholesale_price?: number;
  sku?: string;
  stock: number;
  low_stock_alert: number;
  category_id?: string;
  category?: Category;
  is_active: boolean;
  is_featured: boolean;
  is_wholesale: boolean;
  condition: ProductCondition;
  images: string[];
  main_image?: string;
  created_at: string;
  updated_at: string;
}

export interface StockHistory {
  id: string;
  product_id: string;
  product?: Product;
  prev_stock: number;
  new_stock: number;
  changed_by?: string;
  reason?: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DashboardStats {
  total: number;
  active: number;
  out_of_stock: number;
  featured: number;
  low_stock: number;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_purchase?: number;
  max_uses?: number;
  used_count: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}
