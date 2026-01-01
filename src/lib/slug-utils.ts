import { Model } from 'mongoose'

export async function ensureUniqueSlug(model: Model<any>, slug: string, excludeId?: string): Promise<string> {
  let uniqueSlug = slug
  let counter = 1
  
  while (true) {
    const query: any = { slug: uniqueSlug }
    if (excludeId) {
      query._id = { $ne: excludeId }
    }
    
    // Select only _id to be lighter
    const exists = await model.findOne(query).select('_id')
    if (!exists) {
      return uniqueSlug
    }
    
    uniqueSlug = `${slug}-${counter}`
    counter++
  }
}
