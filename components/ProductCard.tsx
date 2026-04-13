import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  index?: number;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80";

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const imageSrc = product.images?.[0] || FALLBACK_IMAGE;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border-gold bg-white transition duration-200 hover:border-gold hover:shadow-gold"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-lg font-medium text-charcoal">{product.name}</h3>
          <p className="text-sm text-gold">PKR {formatPrice(product.price)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold">
          <span className="rounded-full border border-gold px-2 py-1">
            {product.category}
          </span>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          {(product.colors || []).slice(0, 4).map((color) => (
            <span
              key={`${product.slug}-${color}`}
              className={cn(
                "h-2.5 w-2.5 rounded-full border border-gold/40",
                color === "white" && "bg-[#F5F5F0]",
                color === "ivory" && "bg-[#FFFFF0]",
                color === "red" && "bg-[#C0392B]",
                color === "navy" && "bg-[#1A2D5A]",
                color === "green" && "bg-[#2D6A4F]",
                color === "pink" && "bg-[#E8A0BF]",
                color === "black" && "bg-[#1A1A1A]",
                color === "multi" &&
                  "bg-[conic-gradient(from_90deg,#C0392B,#1A2D5A,#2D6A4F,#C0392B)]"
              )}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
