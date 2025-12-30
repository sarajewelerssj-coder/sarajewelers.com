import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import CustomDesign from '@/models/CustomDesign'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const data = await request.json()
    
    const { name, email, phone, stoneType, jewelryTypes, metalType, budget, comments, images } = data
    
    if (!name || !email || !stoneType || !jewelryTypes || !metalType || !budget) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newDesign = new CustomDesign({
      name,
      email,
      phone,
      stoneType,
      jewelryTypes,
      metalType,
      budget,
      comments,
      images
    })

    await newDesign.save()

    return NextResponse.json({ message: 'Request submitted successfully', design: newDesign }, { status: 201 })
  } catch (error) {
    console.error('Error submitting custom design:', error)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}
