"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type CategoryData = {
  title: string;
  href: string;
  image?: string;
  overlay: string;
};

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<CategoryData[]>([
    {
      title: "Lawn",
      href: "/catalogue?category=Lawn",
      overlay: "rgba(0,0,0,0.18)"
    },
    {
      title: "Cotton",
      href: "/catalogue?category=Cotton",
      overlay: "rgba(0,0,0,0.2)"
    },
    {
      title: "New Arrivals",
      href: "/catalogue?is_new=true",
      image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80",
      overlay: "rgba(10,20,35,0.65)"
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryImages = async () => {
      try {
        const supabase = createSupabaseBrowserClient();

        // Fetch first product from each main category
        const categoryQueries = [
          supabase
            .from("products")
            .select("*")
            .eq("category", "Lawn")
            .eq("in_stock", true)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from("products")
            .select("*")
            .eq("category", "Cotton")
            .eq("in_stock", true)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from("products")
            .select("*")
            .eq("is_featured", true)
            .eq("in_stock", true)
            .limit(1)
            .single()
        ];

        const results = await Promise.allSettled(categoryQueries);

        const updatedCategories = [...categories];

        if (results[0].status === "fulfilled") {
          const data = (results[0].value as any)?.data;
          const firstImage = (data as Product)?.images?.[0];
         

        if (results[2].status === "fulfilled") {
          const data = (results[2].value as any)?.data;
          const firstImage = (data as Product)?.images?.[0];
          if (firstImage) updatedCategories[2].image = firstImage;
        } if (firstImage) updatedCategories[0].image = firstImage;
        }

        if (results[1].status === "fulfilled") {
          const data = (results[1].value as any)?.data;
          const firstImage = (data as Product)?.images?.[0];
          if (firstImage) updatedCategories[1].image = firstImage;
        }

        setCategories(updatedCategories);
      } catch (error) {
        console.error("Error loading category images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryImages();
  }, []);

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.title}
          href={category.href}
          className="group relative aspect-square overflow-hidden rounded-lg bg-ivory shadow-[0_0_0_1px_rgba(212,175,55,0.3)]"
        >
          {category.image ? (
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-charcoal/20" />
          )}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: category.overlay }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-ivory">
            <p className="text-2xl font-medium">{category.title}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gold">
              View Collection {"->"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
