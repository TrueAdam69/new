export type Product = {
  id: string
  slug: string
  name: string
  description?: string | null
  price: number
  original_price?: number | null
  category: "Lawn" | "Cotton" | "Silk" | "Winter" | "New Arrivals"
  fabric: string
  collection: string
  pieces: 2 | 3
  colors: string[]
  sizes: ("XS" | "S" | "M" | "L" | "XL" | "XXL")[]
  images: string[]
  cost_price: number
  packaging_cost: number
  ad_cost: number
  delivery_cost: number
  // Generated columns (read-only, do NOT include in INSERT/UPDATE):
  // total_cost: number
  // profit: number
  // profit_margin: number
  sale_tag_enabled: boolean
  sale_label?: string | null
  is_featured: boolean
  is_new: boolean
  in_stock: boolean
  whatsapp_order_enabled: boolean
  created_at?: string | null
  updated_at?: string | null
}

export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at"> & {
  id?: string
  created_at?: string | null
  updated_at?: string | null
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: ProductInsert
        Update: Partial<ProductInsert>
      }
    }
  }
}
