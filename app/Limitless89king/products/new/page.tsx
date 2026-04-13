'use client'

import { useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { uploadToCloudinary, generateSlug } from '@/lib/cloudinary'

const CATEGORIES = ['Lawn', 'Chiffon', 'Cotton', 'Silk', 'Winter'] as const
const PIECES = [2, 3] as const
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
type StitchedType = 'stitched' | 'unstitched'

export default function NewProductPage() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Lawn' as const,
    fabric: '',
    collection: '',
    pieces: 2 as const,
    price: '',
    original_price: '',
    cost_price: '',
    packaging_cost: '0',
    ad_cost: '0',
    delivery_cost: '0',
    sale_tag_enabled: false,
    sale_label: 'SALE',
    colors: [] as string[],
    sizes: [] as string[],
    images: [] as string[],
    is_featured: false,
    is_new: true,
    in_stock: true,
    whatsapp_order_enabled: true,
    stitched_type: 'unstitched' as StitchedType,
  })

  const [colorInput, setColorInput] = useState('')
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
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

  const handleSizeToggle = (size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size] as ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[]
    }))
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    try {
      for (const file of files) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setImagePreviews(prev => [...prev, event.target?.result as string])
        }
        reader.readAsDataURL(file)

        const url = await uploadToCloudinary(file)
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, url]
        }))
      }
      setToast({ message: 'Images uploaded successfully', type: 'success' })
    } catch (error) {
      console.error('Image upload failed:', error)
      setToast({ message: 'Failed to upload images', type: 'error' })
    } finally {
      setUploading(false)
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
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setToast({ message: 'Product name is required', type: 'error' })
      return
    }
    if (formData.colors.length === 0) {
      setToast({ message: 'At least one color is required', type: 'error' })
      return
    }
    if (isStitched && formData.sizes.length === 0) {
      setToast({ message: 'At least one size is required', type: 'error' })
      return
    }
    if (formData.images.length === 0) {
      setToast({ message: 'At least one image is required', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const { error } = await (supabase as any)
        .from('products')
        .insert([
          {
            slug,
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            category: formData.category,
            fabric: formData.fabric.trim(),
            collection: formData.collection.trim(),
            pieces: parseInt(String(formData.pieces), 10),
            price: parseFloat(formData.price),
            original_price: formData.original_price ? parseFloat(formData.original_price) : null,
            cost_price: parseFloat(formData.cost_price),
            packaging_cost: parseFloat(formData.packaging_cost),
            ad_cost: parseFloat(formData.ad_cost),
            delivery_cost: parseFloat(formData.delivery_cost),
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
        ])

      if (error) throw error

      setToast({ message: 'Product created successfully!', type: 'success' })
      setTimeout(() => {
        router.push('/Limitless89king/products')
      }, 1000)
    } catch (error) {
      console.error('Submit error:', error)
      setToast({
        message: error instanceof Error ? error.message : 'Failed to create product',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-600 mb-2">Add New Product</h1>
          <p className="text-zinc-400">Create a new product for Elesh Clothing</p>
        </div>

        {toast && (
          <div className={`mb-6 p-4 rounded-lg ${toast.type === 'success' ? 'bg-emerald-900 text-emerald-100' : 'bg-red-900 text-red-100'}`}>
            {toast.message}
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
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug (Auto-generated)</label>
                <input
                  type="text"
                  value={slug}
                  disabled
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-500"
                />
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
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                >
                  {PIECES.map(p => (
                    <option key={p} value={p}>{p} Pieces</option>
                  ))}
                </select>
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
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
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

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Colors *</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddColor()
                    }
                  }}
                  placeholder="Type a color and press Enter"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
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
            </div>

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
            </div>
          </div>

          {/* Section 5: Images */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-600 mb-4">Images</h2>

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
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-zinc-700 rounded px-4 py-6 text-center hover:border-yellow-600 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Click to select images or drag and drop'}
            </button>

            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img src={preview} alt={`Preview ${index}`} className="w-full h-48 object-cover rounded" />
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

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-yellow-600 text-black py-3 rounded font-semibold hover:bg-yellow-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border border-zinc-700 text-white py-3 rounded font-semibold hover:border-yellow-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
