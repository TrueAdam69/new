'use client';

import { useEffect, useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Lawn', 'Cotton'];
const COLOR_OPTIONS = [
  { name: 'white', hex: '#F5F5F0' },
  { name: 'ivory', hex: '#FFFFF0' },
  { name: 'red', hex: '#C0392B' },
  { name: 'navy', hex: '#1A2D5A' },
  { name: 'green', hex: '#2D6A4F' },
  { name: 'pink', hex: '#E8A0BF' },
  { name: 'black', hex: '#1A1A1A' },
  { name: 'multi', hex: 'conic-gradient(from_90deg,#C0392B,#1A2D5A,#2D6A4F,#C0392B)' },
];

const MAX_PRICE = 25000;
const MIN_PRICE = 0;

type FilterState = {
  category: string;
  colors: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: 'none' | 'price-low-to-high' | 'price-high-to-low';
};

export default function CataloguePage() {
  const supabase = createSupabaseBrowserClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    colors: [],
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    sortBy: 'none',
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supabase]);

  // Client-side filtering with AND logic
  const filteredProducts = useMemo(() => {
    let results = products.filter((product) => {
      // Category filter
      if (filters.category !== 'All' && product.category !== filters.category) {
        return false;
      }

      // Color filter (AND logic - product must have ALL selected colors)
      if (filters.colors.length > 0) {
        const hasAllColors = filters.colors.every((selectedColor) =>
          product.colors?.includes(selectedColor)
        );
        if (!hasAllColors) return false;
      }

      // Price filter
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      return true;
    });

    // Apply sorting
    if (filters.sortBy === 'price-low-to-high') {
      results = [...results].sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high-to-low') {
      results = [...results].sort((a, b) => b.price - a.price);
    }

    return results;
  }, [products, filters]);

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handleColorToggle = (color: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: 'All',
      colors: [],
      minPrice: MIN_PRICE,
      maxPrice: MAX_PRICE,
      sortBy: 'none',
    });
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.colors.length > 0 ||
    filters.minPrice !== MIN_PRICE ||
    filters.maxPrice !== MAX_PRICE ||
    filters.sortBy !== 'none';

  return (
    <main className="min-h-screen bg-ivory">
      <div className="flex gap-6 px-4 py-8 lg:px-8">
        {/* Sidebar - Hidden on mobile, visible with drawer on tablet/mobile */}
        <div
          className={cn(
            'fixed inset-0 top-16 z-40 w-64 overflow-y-auto border-r border-border-gold bg-ivory transition-all duration-300 lg:relative lg:top-0 lg:z-auto lg:block',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <div className="space-y-8 p-6">
            {/* Category Filter */}
            <div>
              <h3 className="mb-4 font-heading text-sm font-medium uppercase tracking-wider text-charcoal">
                Categories
              </h3>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={cn(
                      'block w-full rounded-full px-4 py-2 text-sm font-medium uppercase tracking-wider transition-all duration-200',
                      filters.category === category
                        ? 'bg-gold text-charcoal'
                        : 'border border-gold text-gold hover:bg-gold-hover'
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="mb-4 font-heading text-sm font-medium uppercase tracking-wider text-charcoal">
                Color
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorToggle(color.name)}
                    className={cn(
                      'h-10 w-10 rounded-full border-2 transition-all duration-200',
                      filters.colors.includes(color.name)
                        ? 'border-gold ring-2 ring-gold ring-offset-1'
                        : 'border-gold/30 hover:border-gold'
                    )}
                    style={
                      color.name === 'multi'
                        ? { backgroundImage: color.hex }
                        : { backgroundColor: color.hex }
                    }
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="mb-4 font-heading text-sm font-medium uppercase tracking-wider text-charcoal">
                Price (PKR)
              </h3>
              <div className="space-y-4">
                <PriceRangeSlider
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  minBound={MIN_PRICE}
                  maxBound={MAX_PRICE}
                  onChange={handlePriceChange}
                />
                <div className="text-sm text-charcoal">
                  PKR {filters.minPrice.toLocaleString('en-PK')} – PKR{' '}
                  {filters.maxPrice.toLocaleString('en-PK')}
                </div>
              </div>
            </div>

            {/* Clear All Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="w-full border border-gold px-4 py-3 font-medium uppercase tracking-wider text-gold transition-all duration-200 hover:bg-gold-hover"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Toggle */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg border border-gold px-4 py-2 font-medium uppercase tracking-wider text-gold transition-all duration-200 hover:bg-gold-hover"
            >
              {mobileMenuOpen ? '✕ Close' : 'Filter'}
            </button>
            <span className="text-sm text-charcoal">
              Showing {filteredProducts.length} products
            </span>
          </div>

          {/* Product Count and Sort (Desktop) */}
          <div className="mb-6 flex items-center justify-between lg:flex">
            <div className="text-sm text-charcoal">
              Showing {filteredProducts.length} products
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-charcoal">Sort by:</label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as FilterState['sortBy'],
                  }))
                }
                className="rounded border border-gold bg-ivory px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="none">Default</option>
                <option value="price-low-to-high">Price: Low to High</option>
                <option value="price-high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-lg bg-white/50 pb-4"
                >
                  <div className="mb-3 aspect-[4/5] bg-border-gold" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 bg-border-gold" />
                    <div className="h-3 w-20 bg-border-gold" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={idx}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border-gold bg-white/30 py-16 text-center">
              <p className="mb-4 text-lg text-charcoal">
                No products found
              </p>
              <p className="mb-6 text-sm text-charcoal/60">
                Try adjusting your filters to find what you&apos;re looking for.
              </p>
              <button
                onClick={clearAllFilters}
                className="rounded-lg bg-gold px-6 py-2 font-medium text-charcoal transition-all duration-200 hover:bg-gold-dark hover:shadow-gold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-30 bg-black/20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </main>
  );
}

// Dual-range price slider component
function PriceRangeSlider({
  minPrice,
  maxPrice,
  minBound,
  maxBound,
  onChange,
}: {
  minPrice: number;
  maxPrice: number;
  minBound: number;
  maxBound: number;
  onChange: (min: number, max: number) => void;
}) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(parseInt(e.target.value), maxPrice - 1);
    onChange(newMin, maxPrice);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(parseInt(e.target.value), minPrice + 1);
    onChange(minPrice, newMax);
  };

  const minPercent = ((minPrice - minBound) / (maxBound - minBound)) * 100;
  const maxPercent = ((maxPrice - minBound) / (maxBound - minBound)) * 100;

  return (
    <div className="space-y-4">
      <style jsx>{`
        .price-slider-container {
          position: relative;
          height: 32px;
        }
        .price-slider-track {
          position: absolute;
          top: 14px;
          left: 0;
          right: 0;
          height: 4px;
          border-radius: 2px;
          background: rgba(212, 175, 55, 0.3);
          pointer-events: none;
        }
        .price-slider-range {
          position: absolute;
          top: 14px;
          height: 4px;
          background: #d4af37;
          border-radius: 2px;
          pointer-events: none;
        }
        .price-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
          background: transparent;
          border: none;
          -webkit-appearance: none;
          appearance: none;
          cursor: pointer;
          pointer-events: auto;
        }
        .price-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #d4af37;
          border: 2px solid #f9f8f3;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .price-input::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #d4af37;
          border: 2px solid #f9f8f3;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .price-input-min {
          z-index: ${minPrice > maxBound - 100 ? 5 : 3};
        }
        .price-input-max {
          z-index: ${maxPrice < minBound + 100 ? 3 : 5};
        }
      `}</style>
      <div className="price-slider-container">
        <div className="price-slider-track" />
        <div
          className="price-slider-range"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
        <input
          type="range"
          min={minBound}
          max={maxBound}
          value={minPrice}
          onChange={handleMinChange}
          className="price-input price-input-min"
        />
        <input
          type="range"
          min={minBound}
          max={maxBound}
          value={maxPrice}
          onChange={handleMaxChange}
          className="price-input price-input-max"
        />
      </div>
    </div>
  );
}
