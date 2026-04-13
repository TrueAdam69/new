'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import type { Product } from '@/lib/types'

const ITEMS_PER_PAGE = 20

export default function AdminProductsPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await (supabase as any)
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setToast({ message: 'Failed to fetch products', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      const { error } = await (supabase as any)
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProducts(products.filter((p) => p.id !== id))
      setDeleteConfirm(null)
      setToast({ message: 'Product deleted successfully', type: 'success' })
    } catch (error) {
      console.error('Failed to delete product:', error)
      setToast({ message: 'Failed to delete product', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  // Pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const endIdx = startIdx + ITEMS_PER_PAGE
  const paginatedProducts = products.slice(startIdx, endIdx)

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gold mb-2">Products</h1>
            <p className="text-gray-400">Manage your product inventory</p>
          </div>
          <Link
            href="/Limitless89king/products/new"
            className="px-6 py-3 bg-gold text-black rounded font-semibold hover:bg-yellow-400"
          >
            + Add New Product
          </Link>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`mb-6 p-4 rounded-lg ${toast.type === 'success' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
            {toast.message}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Total Products</p>
            <p className="text-3xl font-bold text-gold">{products.length}</p>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Categories</p>
            <p className="text-3xl font-bold text-gold">{new Set(products.map((p) => p.category)).size}</p>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Featured</p>
            <p className="text-3xl font-bold text-gold">{products.filter((p) => p.is_featured).length}</p>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">In Stock</p>
            <p className="text-3xl font-bold text-gold">{products.filter((p) => p.in_stock).length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <p className="text-gray-400">Loading products...</p>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <p className="text-gray-400 mb-4">No products yet</p>
              <Link
                href="/Limitless89king/products/new"
                className="text-gold hover:text-yellow-400"
              >
                Create your first product →
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Stock</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Featured</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Created</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {paginatedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-900/50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.slug}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gold font-semibold">PKR {product.price.toLocaleString()}</p>
                          {product.original_price && (
                            <p className="text-xs text-gray-500 line-through">PKR {product.original_price.toLocaleString()}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            product.in_stock
                              ? 'bg-green-900 text-green-100'
                              : 'bg-red-900 text-red-100'
                          }`}>
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {product.is_featured ? (
                            <span className="text-gold">⭐</span>
                          ) : (
                            <span className="text-gray-600">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {product.created_at ? new Date(product.created_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/Limitless89king/products/${product.id}/edit`}
                              className="px-3 py-1 bg-gold text-black rounded text-sm font-medium hover:bg-yellow-400"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="px-3 py-1 bg-red-900 text-red-100 rounded text-sm font-medium hover:bg-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-800 px-6 py-4">
                  <p className="text-sm text-gray-400">
                    Showing {startIdx + 1} to {Math.min(endIdx, products.length)} of {products.length} products
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-800 rounded hover:border-gold disabled:opacity-50"
                    >
                      ←
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage - 2 + i
                      return page > 0 && page <= totalPages ? page : null
                    })
                      .filter((p): p is number => p !== null)
                      .map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded ${
                            currentPage === page
                              ? 'bg-gold text-black font-semibold'
                              : 'border border-gray-800 hover:border-gold'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-800 rounded hover:border-gold disabled:opacity-50"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold text-white mb-2">Delete Product?</h2>
            <p className="text-gray-400 mb-6">This action cannot be undone. The product will be permanently deleted.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-800 rounded hover:border-gold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gold color utility */}
      <style>{`
        .text-gold { color: #d4af37; }
        .bg-gold { background-color: #d4af37; }
        .border-gold { border-color: #d4af37; }
        .hover\\:border-gold:hover { border-color: #d4af37; }
        .hover\\:bg-yellow-400:hover { background-color: #facc15; }
      `}</style>
    </div>
  )
}
