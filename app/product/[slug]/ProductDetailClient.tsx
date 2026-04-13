'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import { cn, formatPrice } from '@/lib/utils';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80';

const COLOR_MAP: Record<string, string> = {
  white: '#F5F5F0',
  ivory: '#FFFFF0',
  red: '#C0392B',
  navy: '#1A2D5A',
  green: '#2D6A4F',
  pink: '#E8A0BF',
  black: '#1A1A1A',
  multi: 'conic-gradient(from_90deg,#C0392B,#1A2D5A,#2D6A4F,#C0392B)',
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const supabase = createSupabaseBrowserClient();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch product by slug
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (productError || !productData) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setProduct(productData);

        // Fetch related products from same category (excluding current product)
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('category', (productData as Product).category)
          .neq('id', (productData as Product).id)
          .limit(4);

        setRelatedProducts(related || []);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, supabase]);

  const handleOrderNow = () => {
    if (!product) return;

    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const productLink = typeof window !== 'undefined' ? window.location.href : '';
    const text = encodeURIComponent(
      `Hi! I'd like to order:\n\n*${product.name}*\nPrice: PKR ${formatPrice(product.price)}\n\nProduct link: ${productLink}`
    );

    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image skeleton */}
          <div className="aspect-[3/4] animate-pulse rounded-lg bg-white/50" />
          {/* Info skeleton */}
          <div className="space-y-6">
            <div className="h-4 w-40 animate-pulse bg-white/50" />
            <div className="h-12 w-full animate-pulse bg-white/50" />
            <div className="h-8 w-32 animate-pulse bg-white/50" />
            <div className="h-20 animate-pulse bg-white/50" />
            <div className="h-12 animate-pulse bg-white/50" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-8">
        <h1 className="mb-4 font-heading text-4xl text-charcoal">Product Not Found</h1>
        <p className="mb-8 text-charcoal/60">
          The product you&apos;re looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/catalogue"
          className="inline-block rounded-lg bg-gold px-6 py-3 font-medium text-charcoal transition-all duration-200 hover:bg-gold-dark hover:shadow-gold"
        >
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const images = product.images || [FALLBACK_IMAGE];
  const mainImage = images[selectedImageIndex] || FALLBACK_IMAGE;

  return (
    <>
      {/* Product detail section */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      'relative aspect-[2/3] w-20 overflow-hidden rounded-lg border-2 transition-all duration-200',
                      selectedImageIndex === idx
                        ? 'border-gold'
                        : 'border-border-gold hover:border-gold'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex gap-2 text-xs uppercase tracking-wider text-gold">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <span>/</span>
              <Link href="/catalogue" className="hover:underline">
                Catalogue
              </Link>
              <span>/</span>
              <span className="text-charcoal">{product.category}</span>
            </nav>

            {/* Product name */}
            <div>
              <h1 className="font-heading text-4xl leading-tight text-charcoal lg:text-5xl">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="text-2xl font-medium text-gold">
              PKR {formatPrice(product.price)}
            </div>

            {/* Available Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-charcoal">
                  Available Colors
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className="flex items-center gap-2"
                      title={color}
                    >
                      <div
                        className="h-5 w-5 rounded-full border border-gold/40"
                        style={
                          color === 'multi'
                            ? { backgroundImage: COLOR_MAP[color] }
                            : { backgroundColor: COLOR_MAP[color] || '#ccc' }
                        }
                      />
                      <span className="text-xs capitalize text-charcoal">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="leading-relaxed text-charcoal/80">
                {product.description}
              </p>
            )}

            {/* Divider */}
            <div
              className="my-6 h-px"
              style={{ backgroundColor: 'rgba(212,175,55,0.3)' }}
            />

            {/* Order button */}
            <button
              onClick={handleOrderNow}
              className="w-full bg-charcoal px-6 py-4 font-medium uppercase tracking-wider text-ivory transition-all duration-200 hover:bg-black hover:shadow-lg"
            >
              Order via WhatsApp
            </button>

            {/* Question text with icon */}
            <div className="flex items-center gap-2 text-sm text-charcoal">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gold"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16.6915026,12.4744748 C16.6915026,13.2599618 16.0972973,13.8620356 15.3272181,13.8620356 L13.904225,13.8620356 L13.904225,15.2974707 C13.904225,16.0829577 13.3100197,16.6850315 12.5399405,16.6850315 C11.7698612,16.6850315 11.1756559,16.0829577 11.1756559,15.2974707 L11.1756559,13.8620356 L9.75266272,13.8620356 C8.98258348,13.8620356 8.38837822,13.2599618 8.38837822,12.4744748 C8.38837822,11.6889879 8.98258348,11.086914 9.75266272,11.086914 L11.1756559,11.086914 L11.1756559,9.65139776 C11.1756559,8.86591078 11.7698612,8.26383693 12.5399405,8.26383693 C13.3100197,8.26383693 13.904225,8.86591078 13.904225,9.65139776 L13.904225,11.086914 L15.3272181,11.086914 C16.0972973,11.086914 16.6915026,11.6889879 16.6915026,12.4744748 Z" />
              </svg>
              Questions? We reply within hours.
            </div>
          </div>
        </div>
      </div>

      {/* Related products section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border-gold bg-white/30 px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-12 text-center font-heading text-3xl text-charcoal">
              You Might Also Like
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relProduct, idx) => (
                <ProductCard key={relProduct.id} product={relProduct} index={idx} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}