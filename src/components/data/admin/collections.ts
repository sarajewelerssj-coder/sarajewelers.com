export type CollectionType = 'feature' | 'gifts' | 'shop-by-category'

export type CollectionProduct = {
  productId: string
  productName: string
  sku: string
  price: number
}

export type CollectionCategory = {
  categoryId: string
  categoryName: string
  slug: string
  image: string
}

export type Collection = {
  id: string
  name: string
  type: CollectionType
  products: CollectionProduct[]
  categories: CollectionCategory[]
}

// Initialize collections
export const collections: Collection[] = [
  {
    id: 'feature',
    name: 'Feature Products',
    type: 'feature',
    products: [],
    categories: []
  },
  {
    id: 'gifts',
    name: 'Gifts Collection',
    type: 'gifts',
    products: [],
    categories: []
  },
  {
    id: 'shop-by-category',
    name: 'Shop by Category',
    type: 'shop-by-category',
    products: [],
    categories: []
  }
]

// Helper functions to manage collections
export const addProductToCollection = (collectionId: string, product: CollectionProduct) => {
  const collection = collections.find(c => c.id === collectionId)
  if (collection && !collection.products.find(p => p.productId === product.productId)) {
    collection.products.push(product)
  }
}

export const removeProductFromCollection = (collectionId: string, productId: string) => {
  const collection = collections.find(c => c.id === collectionId)
  if (collection) {
    collection.products = collection.products.filter(p => p.productId !== productId)
  }
}

export const addCategoryToCollection = (collectionId: string, category: CollectionCategory) => {
  const collection = collections.find(c => c.id === collectionId)
  if (collection && !collection.categories.find(c => c.categoryId === category.categoryId)) {
    collection.categories.push(category)
  }
}

export const removeCategoryFromCollection = (collectionId: string, categoryId: string) => {
  const collection = collections.find(c => c.id === collectionId)
  if (collection) {
    collection.categories = collection.categories.filter(c => c.categoryId !== categoryId)
  }
}

