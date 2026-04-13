'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import { slugify, cn } from '@/lib/utils';

const COLORS = ['white', 'ivory', 'red', 'navy', 'green', 'pink', 'black', 'multi'];
const DEFAULT_CATEGORIES = ['Lawn', 'Chiffon', 'New Arrivals'];

type FormData = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'> & {
  category: 'Lawn' | 'Cotton' | 'Silk' | 'Winter' | 'New Arrivals' | '';
};

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string | undefined;
  const supabase = createSupabaseBrowserClient();

  const [formData, setFormData] = useState<FormData>({
    slug: '',
    name: '',
    category: '',
    description: null,
    price: 0,
    original_price: null,
    fabric: '',
    collection: '',
    pieces: 2,
    colors: [],
    sizes: [],
    images: [],
    cost_price: 0,
    packaging_cost: 0,
    ad_cost: 0,
    delivery_cost: 0,
    sale_tag_enabled: false,
    sale_label: null,
    is_featured: false,
    is_new: false,
    in_stock: true,
    whatsapp_order_enabled: true,
  });

  const [imageInput, setImageInput] = useState('');
  const [uploadingImages, setUploadingImages] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!productId);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newColor, setNewColor] = useState('');

  useEffect(() => {
    if (productId && productId !== 'new') {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadCategories();
  }, []);

  const fetchProduct = async () => {
    if (!productId || productId === 'new') return;
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      alert('Failed to load product');
      router.push('/Limitless89king/products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('category');

      const uniqueCategories = Array.from(
        new Set([...DEFAULT_CATEGORIES, ...(data?.map((d: any) => d.category) || [])])
      );
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const generateSlug = (name: string) => slugify(name);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: name ? generateSlug(name) : '',
    }));
  };

  const handleColorAdd = (color: string) => {
    if (color && !formData.colors.includes(color)) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, color],
      }));
    }
  };

  const handleColorRemove = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files);
    setUploadingImages((prev) => ({
      ...prev,
      ...Object.fromEntries(newImages.map((f, i) => [f.name + i, 0])),
    }));

    for (const file of newImages) {
      try {
        const formDataObj = new FormData();
        formDataObj.append('file', file);

        const response = await fetch('/api/Limitless89king/upload', {
          method: 'POST',
          body: formDataObj,
        });

        if (!response.ok) throw new Error('Upload failed');

        const { url } = await response.json();
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, url],
        }));

        setUploadingImages((prev) => {
          const updated = { ...prev };
          delete updated[file.name];
          return updated;
        });
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload ${file.name}`);
        setUploadingImages((prev) => {
          const updated = { ...prev };
          delete updated[file.name];
          return updated;
        });
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.images.length === 0) newErrors.images = 'At least 1 image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    try {
      const productData = {
        ...formData,
        is_featured: formData.is_featured || false,
      };

      if (productId && productId !== 'new') {
        await (supabase.from('products') as any)
          .update(productData)
          .eq('id', productId);
      } else {
        await (supabase.from('products') as any)
          .insert([productData]);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/Limitless89king/products');
      }, 1500);
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save product');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-12">
          <p className="text-charcoal/60">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <Link href="/Limitless89king/products" className="mb-4 text-sm text-gold hover:text-gold-dark">
            ← Back to Products
          </Link>
          <h1 className="font-heading text-4xl text-charcoal">
            {productId ? 'Edit Product' : 'Create New Product'}
          </h1>
        </div>

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            ✓ Product saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Name */}
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-charcoal">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g., Zari Threaded Cream Lawn"
              className={cn(
                'w-full border bg-white px-4 py-3 text-charcoal placeholder-charcoal/40 transition-colors duration-200 focus:outline-none',
                errors.name ? 'border-red-300' : 'border-border-gold focus:border-gold'
              )}
            />
            {formData.name && (
              <p className="mt-2 text-xs text-charcoal/50">
                Slug: <code className="font-mono">{formData.slug}</code>
              </p>
            )}
            {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Category & Price */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Category */}
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-charcoal">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value as FormData['category'] }))
                }
                className={cn(
                  'w-full border bg-white px-4 py-3 text-charcoal transition-colors duration-200 focus:outline-none',
                  errors.category ? 'border-red-300' : 'border-border-gold focus:border-gold'
                )}
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-2 text-xs text-red-600">{errors.category}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-charcoal">
                Price (PKR) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: parseInt(e.target.value) || 0 }))
                }
                placeholder="0"
                className={cn(
                  'w-full border bg-white px-4 py-3 text-charcoal placeholder-charcoal/40 transition-colors duration-200 focus:outline-none',
                  errors.price ? 'border-red-300' : 'border-border-gold focus:border-gold'
                )}
              />
              {errors.price && <p className="mt-2 text-xs text-red-600">{errors.price}</p>}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-charcoal">
                Fabric
              </label>
              <input
                type="text"
                value={formData.fabric}
                onChange={(e) => setFormData((prev) => ({ ...prev, fabric: e.target.value }))}
                placeholder="e.g., Lawn"
                className="w-full border border-border-gold bg-white px-4 py-3 text-charcoal transition-colors duration-200 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-charcoal">
                Collection
              </label>
              <input
                type="text"
                value={formData.collection}
                onChange={(e) => setFormData((prev) => ({ ...prev, collection: e.target.value }))}
                placeholder="e.g., Summer 24"
                className="w-full border border-border-gold bg-white px-4 py-3 text-charcoal transition-colors duration-200 focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-charcoal">
              Pieces
            </label>
            <select
              value={formData.pieces}
              onChange={(e) => setFormData((prev) => ({ ...prev, pieces: parseInt(e.target.value) as 2 | 3 }))}
              className="w-full border border-border-gold bg-white px-4 py-3 text-charcoal transition-colors duration-200 focus:border-gold focus:outline-none"
            >
              <option value={2}>2 Piece</option>
              <option value={3}>3 Piece</option>
            </select>
          </div>

          {/* Colors */}
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-charcoal">
              Available Colors
            </label>
            <div className="mb-3 flex gap-2">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Add a color..."
                className="flex-1 border border-border-gold bg-white px-4 py-2 text-charcoal placeholder-charcoal/40 transition-colors duration-200 focus:border-gold focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  handleColorAdd(newColor);
                  setNewColor('');
                }}
                className="rounded bg-gold px-4 py-2 font-medium text-charcoal transition-colors duration-200 hover:bg-gold-dark"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-2 rounded-full border border-gold bg-gold/10 px-3 py-1 text-xs font-medium text-gold"
                  >
                    {color}
                    <button
                      type="button"
                      onClick={() => handleColorRemove(color)}
                      className="transition-opacity duration-200 hover:opacity-60"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {COLORS.filter((c) => !formData.colors.includes(c)).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorAdd(color)}
                    className="rounded-full border border-border-gold bg-white/50 px-3 py-1 text-xs font-medium text-charcoal transition-colors duration-200 hover:border-gold hover:bg-white"
                  >
                    + {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-charcoal">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value || null }))
              }
              placeholder="Product details, care instructions, etc..."
              rows={4}
              className="w-full border border-border-gold bg-white px-4 py-3 text-charcoal placeholder-charcoal/40 transition-colors duration-200 focus:border-gold focus:outline-none"
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wider text-charcoal">
              Feature on Homepage
            </label>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, is_featured: !prev.is_featured }))
              }
              className={cn(
                'relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200',
                formData.is_featured ? 'bg-gold' : 'bg-gray-300'
              )}
            >
              <span
                className={cn(
                  'inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200',
                  formData.is_featured ? 'translate-x-7' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Images */}
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-charcoal">
              Product Images * {formData.images.length > 0 && `(${formData.images.length}/8)`}
            </label>

            {/* Upload Zone */}
            <div
              onDrop={(e) => {
                e.preventDefault();
                handleImageUpload(e.dataTransfer.files);
              }}
              onDragOver={(e) => e.preventDefault()}
              className="mb-4 rounded-lg border-2 border-dashed border-border-gold bg-white/30 p-8 text-center transition-colors duration-200 hover:border-gold hover:bg-gold/5"
            >
              <p className="text-sm text-charcoal/60">
                Drag and drop images here or{' '}
                <label className="cursor-pointer font-medium text-gold hover:text-gold-dark">
                  browse files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="mt-1 text-xs text-charcoal/50">JPG, PNG, WebP up to 8 images</p>
            </div>

            {/* Image Grid */}
            {formData.images.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-4">
                {formData.images.map((url, idx) => (
                  <div key={idx} className="relative aspect-square overflow-hidden rounded-lg bg-charcoal/10">
                    <Image
                      src={url}
                      alt={`Product image ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white transition-colors duration-200 hover:bg-red-700"
                    >
                      ✕
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-2 left-2 rounded bg-gold px-2 py-1 text-xs font-medium text-charcoal">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {errors.images && <p className="mt-2 text-xs text-red-600">{errors.images}</p>}
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-charcoal px-6 py-3 font-medium uppercase tracking-wider text-ivory transition-all duration-200 disabled:opacity-50 hover:bg-black"
            >
              {saving ? 'Saving...' : 'Save Product'}
            </button>
            <Link
              href="/Limitless89king/products"
              className="flex items-center justify-center rounded-lg border border-border-gold bg-white px-6 py-3 font-medium uppercase tracking-wider text-charcoal transition-colors duration-200 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
