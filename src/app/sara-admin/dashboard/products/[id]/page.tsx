'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, EyeOff, Star } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

export default function ProductViewPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/products/${productId}`)
      if (response.ok) {
        const productData = await response.json()
        setProduct(productData)
      } else {
        toast.error('Product not found')
        router.push('/sara-admin/dashboard/products')
      }
    } catch (error) {
      toast.error('Failed to fetch product')
      router.push('/sara-admin/dashboard/products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Product deleted successfully')
        router.push('/sara-admin/dashboard/products')
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const response = await fetch(`/api/products/${product._id}/reviews/${reviewId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success('Review deleted')
        setProduct(data.product)
      } else {
        toast.error('Failed to delete review')
      }
    } catch (error) {
       toast.error('Failed to delete review')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Loading Product...</h2>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Product Not Found</h2>
        <button
          onClick={() => router.push('/sara-admin/dashboard/products')}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
        >
          Back to Products
        </button>
      </div>
    )
  }

  const frontImage = product.images?.find((img: any) => img.type === 'front')
  const backImage = product.images?.find((img: any) => img.type === 'back')
  const galleryImages = product.images?.filter((img: any) => img.type === 'gallery') || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/sara-admin/dashboard/products')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/sara-admin/dashboard/products/${productId}/edit`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Product Images</h3>
            
            {/* Main Images */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Front Image</p>
                <div className="aspect-square bg-gray-100 dark:bg-[#2a2a2a] rounded-lg overflow-hidden">
                  {frontImage ? (
                    frontImage.isVideo ? (
                      <video src={frontImage.url} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={frontImage.url} alt="Front" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <EyeOff className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Back Image</p>
                <div className="aspect-square bg-gray-100 dark:bg-[#2a2a2a] rounded-lg overflow-hidden">
                  {backImage ? (
                    backImage.isVideo ? (
                      <video src={backImage.url} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={backImage.url} alt="Back" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <EyeOff className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Gallery ({galleryImages.length})</p>
                <div className="grid grid-cols-4 gap-3">
                  {galleryImages.map((image: any, index: number) => (
                    <div key={index} className="aspect-square bg-gray-100 dark:bg-[#2a2a2a] rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                      {image.isVideo ? (
                        <video src={image.url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={image.url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-2">Categories:</span>
                <div className="flex flex-wrap gap-2">
                  {product.categories && product.categories.length > 0 ? (
                    product.categories.map((category: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-[#d4af37]/10 text-[#d4af37] rounded-lg text-sm font-medium">
                        {category}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">No categories assigned</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  product.status === 'active' ? 'bg-emerald-500/15 text-emerald-600' : 
                  product.status === 'draft' ? 'bg-amber-500/15 text-amber-600' : 
                  'bg-gray-500/15 text-gray-600'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Pricing & Inventory</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Price:</span>
                <span className="font-bold text-xl text-gray-900 dark:text-gray-100">${product.price?.toFixed(2)}</span>
              </div>
              {product.oldPrice && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Old Price:</span>
                  <span className="font-medium text-gray-500 line-through">${product.oldPrice.toFixed(2)}</span>
                </div>
              )}
              {product.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                  <span className="font-medium text-red-600">{product.discount}%</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                <span className={`font-medium ${
                  product.stock > 10 ? 'text-emerald-600' : 
                  product.stock > 0 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {product.stock} units
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sold:</span>
                <span className="font-bold text-[#d4af37]">{product.sold || 0} units</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{product.description}</p>
            {product.longDescription && (
              <p className="text-gray-600 dark:text-gray-400 text-sm">{product.longDescription}</p>
            )}
          </div>

          {/* Variations */}
          {(product.variations?.sizes?.length > 0 || product.variations?.colors?.length > 0 || product.variations?.lengths?.length > 0) && (
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Product Variations</h3>
              <div className="space-y-3">
                {product.variations?.sizes?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sizes:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.variations.sizes.map((size: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {product.variations?.colors?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Colors:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.variations.colors.map((color: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {product.variations?.lengths?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lengths:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.variations.lengths.map((length: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                          {length}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                  value && (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {/* Handle both camelCase and regular spaced strings nicely */}
                        {key.includes(' ') ? key : key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Rating & Reviews */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Rating & Reviews</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (product.rating || 0)
                            ? 'fill-[#d4af37] text-[#d4af37]'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {product.rating?.toFixed(1) || '0.0'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Reviews:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {product.reviewCount || product.reviews?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Customer Reviews</h3>
          <div className="space-y-4">
            {product.reviews.map((review: any, index: number) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg border border-gray-200 dark:border-gray-700"
              >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{review.author || 'Anonymous'}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= (review.rating || 0)
                                  ? 'fill-[#d4af37] text-[#d4af37]'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.date && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{review.date}</p>
                      )}
                      {review.title && (
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">{review.title}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}