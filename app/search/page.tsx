'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Product } from '@/lib/types'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(!!initialQuery)

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    }
  }, [])

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    setSearched(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (response.ok) {
        setResults(data.results || [])
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Search Header */}
      <div className="border-b border-border-gold bg-white pb-8 pt-12">
        <div className="page-shell">
          <h1 className="font-heading text-4xl text-charcoal mb-6">Search</h1>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by name, category, fabric..."
              className="flex-1 rounded-lg border border-border-gold bg-white px-4 py-3 text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-lg bg-charcoal px-6 py-3 font-medium text-ivory transition hover:bg-black"
            >
              Search
            </button>
          </form>

          {query && query.length < 2 && (
            <p className="mt-3 text-sm text-charcoal/60">
              Enter at least 2 characters to search
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="page-shell py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-charcoal/60">Searching...</p>
          </div>
        ) : searched ? (
          <>
            <h2 className="font-heading text-2xl text-charcoal mb-6">
              {results.length === 0
                ? `No results found for "${query}"`
                : `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
            </h2>

            {results.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group overflow-hidden rounded-lg border border-border-gold bg-white transition hover:shadow-lg"
                  >
                    {/* Image */}
                    {product.images && product.images.length > 0 ? (
                      <div className="relative h-64 overflow-hidden bg-charcoal/10">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                        {product.is_featured && (
                          <div className="absolute right-3 top-3 bg-gold px-2 py-1 text-xs font-medium text-charcoal">
                            Featured
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-64 bg-charcoal/10 flex items-center justify-center">
                        <span className="text-charcoal/40">No image</span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-heading text-lg text-charcoal mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs uppercase tracking-wider text-charcoal/60 mb-3">
                        {product.category}
                      </p>

                      <div className="flex items-baseline justify-between">
                        <p className="font-heading text-lg text-gold">
                          PKR {product.price.toLocaleString()}
                        </p>
                        {product.original_price && (
                          <p className="text-xs text-charcoal/60 line-through">
                            PKR {product.original_price.toLocaleString()}
                          </p>
                        )}
                      </div>

                      {product.collection && (
                        <p className="mt-2 text-xs text-charcoal/60">
                          {product.collection}
                        </p>
                      )}

                      {product.colors && product.colors.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {product.colors.slice(0, 3).map((color) => (
                            <span
                              key={color}
                              className="inline-block rounded-full bg-charcoal/10 px-2 py-1 text-xs text-charcoal"
                            >
                              {color}
                            </span>
                          ))}
                          {product.colors.length > 3 && (
                            <span className="inline-block rounded-full bg-charcoal/10 px-2 py-1 text-xs text-charcoal">
                              +{product.colors.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg
              className="mb-4 h-16 w-16 text-charcoal/20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-lg text-charcoal/60">
              Start typing to search for products
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
