"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const fallbackProducts: Product[] = [];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  const clientReady = useMemo(() => {
    return Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        if (!clientReady) {
          setLoading(false);
          return;
        }

        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(8);

        if (active && data && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load featured products", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, [clientReady]);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {(loading ? fallbackProducts : products).map((product, index) => (
        <div key={product.slug} className="page-fade">
          <ProductCard product={product} index={index} />
        </div>
      ))}
    </div>
  );
}
