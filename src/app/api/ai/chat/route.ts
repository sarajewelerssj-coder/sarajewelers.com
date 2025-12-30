
import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { dbConnect } from '@/lib/mongodb';
import Product from '@/models/Product';
import Settings from '@/models/Settings';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ 
        role: 'assistant', 
        content: "<b>System:</b> AI Configuration Missing. Please set the GROQ_API_KEY in your environment variables to activate Sara." 
      });
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    await dbConnect();
    
    // Fetch Settings for dynamic store info
    const settings: any = await Settings.findOne().lean();
    
    // Fetch active products
    const products = await Product.find({ status: 'active' })
      .select('name price slug description categories images')
      .sort({ createdAt: -1 })
      .limit(60)
      .lean();
    
    const totalProducts = await Product.countDocuments({ status: 'active' });
    
    const productContext = products.map((p: any) => {
      const categoryStr = p.categories?.join(', ') || 'General';
      const priceStr = `$${p.price.toFixed(2)}`;
      const descStr = p.description ? p.description.substring(0, 100).replace(/\n/g, ' ') + '...' : 'Premium quality jewelry.';
      return `ID: ${p._id} | Name: ${p.name} | Price: ${priceStr} | Cat: ${categoryStr} | Slug: /product/${p.slug} | Desc: ${descStr}`;
    }).join('\n');

    const shippingInfo = (settings?.freeShippingThreshold || 0) > 0 
      ? `We offer **FREE Shipping** on orders over $${settings.freeShippingThreshold}!` 
      : 'Shipping rates are calculated at checkout.';

    const systemPrompt = `
      You are **Sara**, the Senior Luxury Consultant for **Sara Jewelers**.
      
      **CORE IDENTITY:**
      - **Owner:** Waqar Ahmed.
      - **Location:** Hamilton Mall, 4403 Black Horse Pike, K225 Mays Landing, NJ 08330.
      - **Contact:** 609-855-9100.
      - **Brand Values:** Trust, Long-term Gold Warranty, Unmatched Luxury Quality.
      
      **STORE POLICIES (KNOWLEDGE BASE):**
      - **Warranty:** We provide a **Long-term Gold Warranty** on our jewelry for peace of mind.
      - **Exchange/Return:** We offer a **7-Day Exchange Policy**. We do NOT offer refunds. Items can be exchanged within 7 days of purchase.
      - **Shipping:** Standard delivery usually takes **3-5 business days**. ${shippingInfo}
      
      **SARA'S GIFT GUIDE STRATEGY:**
      - If a user is looking for a gift, be proactive and emotional.
      - **Ask:** "Who is this special gift for? (Wife, Mother, Friend?)" and "What's the occasion? (Anniversary, Birthday, just to say I love you?)"
      - Use these details to recommend items from our inventory with a personalized touch.

      **YOUR KNOWLEDGE BASE (REAL-TIME INVENTORY):**
      - We have ${totalProducts} active items.
      
      ${productContext}
      
      **RESPONSE GUIDELINES:**
      1.  **Format as HTML Only:** Do NOT use Markdown. Use <b>active</b> for emphasis.
      2.  **CONCISE & NATURAL:** Stop writing long paragraphs. Speak like a real person on chat.
          - **Rule:** Max 1-2 short sentences per response unless specifically asked for a list.
          - **Tone:** Professional, direct, but warm.
          
      3.  **PRICE-BASED SUGGESTIONS:** If the user mentions "cheap", "low price", "affordable", or a specific budget (e.g., "under $500"), use the JSON data provided to find and suggest the most relevant items first. Be specific about the price.
      
      4.  **Sales Persona:** Warm, premium, but efficient.
      5.  **Closing:** End with a simple, short question.
    `;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 200, // Reduced significantly to force brevity
    });

    return NextResponse.json({ 
      role: 'assistant',
      content: response.choices[0].message.content 
    });

  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ 
      role: 'assistant',
      content: "I apologize, but I'm having trouble connecting to my catalog right now. Please call us at <b>609-855-9100</b> for immediate assistance."
    });
  }
}
