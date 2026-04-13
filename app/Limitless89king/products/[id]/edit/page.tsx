'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { uploadToCloudinary, generateSlug } from '@/lib/cloudinary'
import type { Database } from '@/lib/types'

const CATEGORIES = ['Lawn', 'Chiffon', 'Cotton', 'Silk', 'Winter', 'New Arrivals'] as const
const PIECES = [2, 3] as const
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
type Size = typeof SIZES[number];
type StitchedType = 'stitched' | 'unstitched'

type ToastData = { message: string; type: 'success' | 'error' }

function formatSupabaseLikeError(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  if (!err || typeof err !== 'object') return 'Something went wrong'

  const anyErr = err as any
  const message = typeof anyErr.message === 'string' ? anyErr.message : null
  const details = typeof anyErr.details === 'string' ? anyErr.details : null
  const hint = typeof anyErr.hint === 'string' ? anyErr.hint : null
  const code = typeof anyErr.code === 'string' ? anyErr.code : null

  const parts = [message, details, hint, code ? `(${code})` : null].filter(Boolean)
  return parts.length ? parts.join(' ') : 'Something went wrong'
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = Array.isArray(params.id) ? params.id[0] : (params.id as string)
  // FIX #3: Memoize Supabase client to prevent re-creation on every render
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Lawn' as typeof CATEGORIES[number],
    fabric: '',
    collection: '',
    pieces: 2 as typeof PIECES[number],
    price: '',
    original_price: '',
    cost_price: '',
    packaging_cost: '0',
    ad_cost: '0',
    delivery_cost: '0',
    sale_tag_enabled: false,
    sale_label: 'SALE',
    colors: [] as string[],
    sizes: [] as Size[],
    images: [] as string[],
    is_featured: false,
    is_new: true,
    in_stock: true,
    whatsapp_order_enabled: true,
    stitched_type: 'unstitched' as StitchedType,
  })

  const [colorInput, setColorInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [toast, setToast] = useState<ToastData | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [replaceImageIndex, setReplaceImageIndex] = useState<number | null>(null)

  const slug = generateSlug(formData.name)
  const isStitched = formData.stitched_type === 'stitched'

  // Live calculations
  const price = parseFloat(formData.price) || 0
  const costPrice = parseFloat(formData.cost_price) || 0
  const packagingCost = parseFloat(formData.packaging_cost) || 0
  const adCost = parseFloat(formData.ad_cost) || 0
  const deliveryCost = parseFloat(formData.delivery_cost) || 0
  const totalCost = costPrice + packagingCost + adCost + deliveryCost
  const profit = price - totalCost
  const profitMargin = price > 0 ? (profit / price) * 100 : 0

  // FIX #6: Auto-dismiss toast after 4 seconds
  const showToast = useCallback((data: ToastData) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast(data)
    toastTimerRef.current = setTimeout(() => setToast(null), 4000)
  }, [])

  // Fetch product on mount — FIX #3: removed `supabase` from deps since it's now memoized
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (error) throw error

        if (data as any) {
          const typedData = data as any
          setFormData({
            name: typedData.name || '',
            description: typedData.description || '',
            category: typedData.category as typeof CATEGORIES[number],
            fabric: typedData.fabric || '',
            collection: typedData.collection || '',
            pieces: typedData.pieces as 2 | 3,
            price: typedData.price?.toString() || '',
            original_price: typedData.original_price?.toString() || '',
            cost_price: typedData.cost_price?.toString() || '',
            packaging_cost: typedData.packaging_cost?.toString() || '0',
            ad_cost: typedData.ad_cost?.toString() || '0',
            delivery_cost: typedData.delivery_cost?.toString() || '0',
            sale_tag_enabled: typedData.sale_tag_enabled ?? false,
            sale_label: typedData.sale_label || 'SALE',
            colors: typedData.colors || [],
            sizes: typedData.sizes || [],
            images: typedData.images || [],
            is_featured: typedData.is_featured ?? false,
            is_new: typedData.is_new ?? false,
            in_stock: typedData.in_stock ?? true,
            whatsapp_order_enabled: typedData.whatsapp_order_enabled ?? true,
            stitched_type:
              (typedData.stitched_type as StitchedType | null) ??
              (typedData.is_stitched ? 'stitched' : 'unstitched'),
          })
        }
      } catch (error) {
        console.error('Fetch error:', error)
        showToast({
          message: error instanceof Error ? error.message : 'Failed to load product',
          type: 'error'
        })
      } finally {
        setLoadingInitial(false)
      }
    }

    fetchProduct()
  }, [productId, supabase, showToast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    // Clear field-level error when user types
    if (errors[name] || (name === 'name' && errors.slug)) {
      setErrors(prev => {
        const next = { ...prev }
        if (next[name]) delete next[name]
        if (name === 'name' && next.slug) delete next.slug
        return next
      })
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? value : value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleAddColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()]
      }))
      setColorInput('')
    }
  }

  const handleRemoveColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }))
  }

  const handleSizeToggle = (size: Size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  // FIX #5: Use formData.images as single source of truth (no separate imagePreviews)
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    try {
      if (replaceImageIndex !== null) {
        const file = files[0]
        const url = await uploadToCloudinary(file)
        setFormData(prev => ({
          ...prev,
          images: prev.images.map((existingUrl, i) => (i === replaceImageIndex ? url : existingUrl))
        }))
        showToast({ message: 'Image replaced successfully', type: 'success' })
      } else {
        for (const file of files) {
          const url = await uploadToCloudinary(file)
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, url]
          }))
        }
        showToast({ message: 'Images uploaded successfully', type: 'success' })
      }
    } catch (error) {
      console.error('Image upload failed:', error)
      showToast({ message: formatSupabaseLikeError(error), type: 'error' })
    } finally {
      setUploading(false)
      setReplaceImageIndex(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // Validation with field-level errors
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!slug) newErrors.slug = 'Slug could not be generated from the product name'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (formData.colors.length === 0) newErrors.colors = 'At least one color is required'
    // Only require sizes for stitched products
    if (isStitched && formData.sizes.length === 0) {
      newErrors.sizes = 'At least one size is required for stitched products'
    }
    if (formData.images.length === 0) newErrors.images = 'At least one image is required'

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0]
      showToast({ message: firstError, type: 'error' })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      // Avoid confusing DB errors on unique slug constraints
      const { data: slugMatches, error: slugCheckError } = await (supabase as any)
        .from('products')
        .select('id')
        .eq('slug', slug)
        .neq('id', productId)
        .limit(1)

      if (slugCheckError) throw slugCheckError
      if (Array.isArray(slugMatches) && slugMatches.length > 0) {
        setErrors(prev => ({ ...prev, slug: 'Slug already exists. Choose a different product name.' }))
        showToast({ message: 'Slug already exists. Choose a different product name.', type: 'error' })
        return
      }

      // FIX #2: Explicit numeric parsing for pieces
      const parsedPieces = parseInt(String(formData.pieces), 10)
      if (![2, 3].includes(parsedPieces)) {
        setErrors(prev => ({ ...prev, pieces: 'Pieces must be 2 or 3' }))
        showToast({ message: 'Pieces must be 2 or 3', type: 'error' })
        return
      }

      const updatePayload = {
        slug,
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        fabric: formData.fabric.trim(),
        collection: formData.collection.trim(),
        pieces: parsedPieces as 2 | 3,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        cost_price: parseFloat(formData.cost_price) || 0,
        packaging_cost: parseFloat(formData.packaging_cost) || 0,
        ad_cost: parseFloat(formData.ad_cost) || 0,
        delivery_cost: parseFloat(formData.delivery_cost) || 0,
        colors: formData.colors,
        sizes: isStitched ? formData.sizes : [],
        images: formData.images,
        sale_tag_enabled: formData.sale_tag_enabled,
        sale_label: formData.sale_tag_enabled ? formData.sale_label : null,
        is_featured: formData.is_featured,
        is_new: formData.is_new,
        in_stock: formData.in_stock,
        whatsapp_order_enabled: formData.whatsapp_order_enabled,
        stitched_type: formData.stitched_type,
      }

      console.log('[Admin Edit] Sending update payload:', updatePayload)

      const { data, error } = await (supabase as any)
        .from('products')
        .update(updatePayload)
        .eq('id', productId)
        .select('id')
        .single()

      if (error) {
        console.error('[Admin Edit] Supabase error:', error)
        throw error
      }

      console.log('[Admin Edit] Update response:', data)

      showToast({ message: 'Product updated successfully!', type: 'success' })
      setTimeout(() => {
        router.push('/Limitless89king/products')
        router.refresh()
      }, 1000)
    } catch (error) {
      console.error('Submit error:', error)
      showToast({
        message: formatSupabaseLikeError(error),
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      showToast({ message: 'Product deleted successfully!', type: 'success' })
      setTimeout(() => {
        router.push('/Limitless89king/products')
        router.refresh()
      }, 1000)
    } catch (error) {
      console.error('Delete error:', error)
      showToast({
        message: formatSupabaseLikeError(error),
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const fieldError = (field: string) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-400">{errors[field]}</p>
    ) : null

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Loading product...</p>
          <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-600 mb-2">Edit Product</h1>
          <p className="text-zinc-400">Update product details for Elesh Clothing</p>
        </div>

        {/* Toast notification */}
        {toast && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center justify-between transition-all duration-300 ${
              toast.type === 'success' ? 'bg-emerald-900 text-emerald-100' : 'bg-red-900 text-red-100'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-4 text-sm opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-600 mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Summer Lawn Dress"
                  className={`w-full bg-zinc-800 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                    errors.name ? 'border-red-500' : 'border-zinc-700'
                  }`}
                />
                {fieldError('name')}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug (Auto-generated)</label>
                <input
                  type="text"
                  value={slug}
                  disabled
                  className={`w-full bg-zinc-800 border rounded px-3 py-2 text-zinc-500 ${
                    errors.slug ? 'border-red-500' : 'border-zinc-700'
                  }`}
                />
                {fieldError('slug')}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description..."
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full bg-zinc-800 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                    errors.category ? 'border-red-500' : 'border-zinc-700'
                  }`}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {fieldError('category')}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fabric</label>
                <input
                  type="text"
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleChange}
                  placeholder="e.g., 100% Lawn"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Collection</label>
                <input
                  type="text"
                  name="collection"
                  value={formData.collection}
                  onChange={handleChange}
                  placeholder="e.g., Summer 2026"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pieces *</label>
                <select
                  name="pieces"
                  value={formData.pieces}
                  onChange={(e) => {
                    // FIX #2: Explicitly parse to number for the pieces select
                    if (errors.pieces) {
                      setErrors(prev => {
                        const next = { ...prev }
                        delete next.pieces
                        return next
                      })
                    }
                    setFormData(prev => ({
                      ...prev,
                      pieces: parseInt(e.target.value, 10) as 2 | 3
                    }))
                  }}
                  className={`w-full bg-zinc-800 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                    errors.pieces ? 'border-red-500' : 'border-zinc-700'
                  }`}
                >
                  {PIECES.map(p => (
                    <option key={p} value={p}>{p} Pieces</option>
                  ))}
                </select>
                {fieldError('pieces')}
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Sale Tag */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-600 mb-4">Pricing & Sale Tag</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Selling Price / Now Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.01"
                  className={`w-full bg-zinc-800 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                    errors.price ? 'border-red-500' : 'border-zinc-700'
                  }`}
                />
                {fieldError('price')}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Before Price (for sale tag)</label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.01"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                name="sale_tag_enabled"
                checked={formData.sale_tag_enabled}
                onChange={handleCheckboxChange}
                className="w-4 h-4 accent-yellow-600"
              />
              <span>Enable Sale Tag</span>
            </label>

            {formData.sale_tag_enabled && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Sale Label</label>
                <input
                  type="text"
                  name="sale_label"
                  value={formData.sale_label}
                  onChange={handleChange}
                  placeholder="e.g., SALE, 50% OFF, EID SPECIAL"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>
            )}

            {/* Sale Tag Preview */}
            {formData.sale_tag_enabled && formData.original_price && formData.price && (
              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                <p className="text-xs text-zinc-400 mb-2">Sale Tag Preview:</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 line-through">Before: PKR {parseFloat(formData.original_price).toLocaleString()}</p>
                    <p className="text-lg font-bold text-yellow-600">Now: PKR {parseFloat(formData.price).toLocaleString()}</p>
                  </div>
                  <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                    {formData.sale_label}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Cost & Profit Calculator */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-600 mb-4">Cost & Profit Calculator</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Cost Price *</label>
                <input
                  type="number"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.01"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Packaging Cost</label>
                <input
                  type="number"
                  name="packaging_cost"
                  value={formData.packaging_cost}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.01"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ad Cost</label>
                <input
                  type="number"
                  name="ad_cost"
                  value={formData.ad_cost}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.01"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Cost</label>
                <input
                  type="number"
                  name="delivery_cost"
                  value={formData.delivery_cost}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.01"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>
            </div>

            {/* Profit Summary Card */}
            <div className={`rounded-lg p-4 border ${
              totalCost === 0 ? 'bg-zinc-800 border-zinc-700' : profit > 0 ? 'bg-emerald-900/30 border-emerald-700' : 'bg-red-900/30 border-red-700'
            }`}>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Total Cost</p>
                  <p className="text-lg font-bold">PKR {totalCost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Profit</p>
                  <p className={`text-lg font-bold ${profit > 0 ? 'text-emerald-400' : profit < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                    PKR {profit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Profit Margin</p>
                  <p className={`text-lg font-bold ${profit > 0 ? 'text-emerald-400' : profit < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                    {profitMargin.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Variants */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-600 mb-4">Variants</h2>

            {/* Stitched/Unstitched toggle */}
            <div className="mb-6 flex items-center gap-4">
              <label className="text-sm font-medium">Stitched / Unstitched</label>
              <button
                type="button"
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    stitched_type: prev.stitched_type === 'stitched' ? 'unstitched' : 'stitched',
                  }))
                }
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ${
                  isStitched ? 'bg-yellow-600' : 'bg-zinc-600'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    isStitched ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-zinc-300">
                {isStitched ? 'Stitched' : 'Unstitched'}
              </span>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Colors *</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddColor()
                    }
                  }}
                  placeholder="Type a color and press Enter"
                  className={`flex-1 bg-zinc-800 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                    errors.colors ? 'border-red-500' : 'border-zinc-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-4 py-2 bg-yellow-600 text-black rounded font-semibold hover:bg-yellow-500"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map(color => (
                  <div key={color} className="bg-yellow-600 text-black px-3 py-1 rounded flex items-center gap-2">
                    <span>{color}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(color)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {fieldError('colors')}
            </div>

            {/* Only show sizes section for stitched products */}
            {isStitched && (
              <div>
                <label className="block text-sm font-medium mb-2">Sizes *</label>
                <div className="grid grid-cols-3 gap-3">
                  {SIZES.map(size => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sizes.includes(size)}
                        onChange={() => handleSizeToggle(size)}
                        className="w-4 h-4 accent-yellow-600"
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
                {fieldError('sizes')}
              </div>
            )}
          </div>

          {/* Section 5: Images */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-600 mb-4">
              Images {formData.images.length > 0 && `(${formData.images.length})`}
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              disabled={uploading}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => {
                setReplaceImageIndex(null)
                fileInputRef.current?.click()
              }}
              disabled={uploading}
              className={`w-full border-2 border-dashed rounded px-4 py-6 text-center hover:border-yellow-600 disabled:opacity-50 ${
                errors.images ? 'border-red-500' : 'border-zinc-700'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                  Uploading to Cloudinary...
                </span>
              ) : (
                'Click to add images or drag and drop'
              )}
            </button>
            {fieldError('images')}

            {/* FIX #5: Use formData.images directly as the image source */}
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {formData.images.map((imageUrl, index) => (
                  <div key={`${imageUrl}-${index}`} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-48 object-cover rounded"
                    />
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-yellow-600 text-black px-2 py-0.5 rounded text-xs font-bold">
                        Main
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setReplaceImageIndex(index)
                        fileInputRef.current?.click()
                      }}
                      disabled={uploading}
                      className="absolute top-2 left-2 bg-zinc-900/80 text-white px-3 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Flags */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-600 mb-4">Flags</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 accent-yellow-600"
                />
                <span>Featured Product</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_new"
                  checked={formData.is_new}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 accent-yellow-600"
                />
                <span>New Product</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="in_stock"
                  checked={formData.in_stock}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 accent-yellow-600"
                />
                <span>In Stock</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="whatsapp_order_enabled"
                  checked={formData.whatsapp_order_enabled}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 accent-yellow-600"
                />
                <span>WhatsApp Order Enabled</span>
              </label>
            </div>
          </div>

          {/* Submit & Delete */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-yellow-600 text-black py-3 rounded font-semibold hover:bg-yellow-500 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : (
                'Update Product'
              )}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-6 bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-500 disabled:opacity-50 transition-all"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border border-zinc-700 text-white py-3 rounded font-semibold hover:border-yellow-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
