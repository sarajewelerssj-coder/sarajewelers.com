import { NextResponse } from 'next/server';
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productName, categories, type, keywords } = body;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
    }

    // Validation
    if (type !== 'template' && !productName) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    let systemPrompt = '';
    let userContent = '';
    let maxTokens = 1000; // Default max tokens

    if (type === 'template') {
      const { prompt } = body;
      systemPrompt = `You are an expert email marketing copywriter for a luxury jewelry brand called 'Sara Jewelers'. 
      Your task is to create a professional, high-converting, and aesthetically pleasing HTML email template based on the Subject provided.
      
      3. Return a JSON object with this exact structure:
      {
        "subject": "Refined and improved subject line based on user input",
        "name": "Short_Internal_Template_Name",
        "html": "The full HTML code here..."
      }
      4. The design must be responsive, mobile-friendly, and use inline CSS for styling.
      5. Use a clean, elegant, and premium design suitable for a high-end jewelry brand. Use colors like Gold (#d4af37), Black, White, and subtle Grays.
      6. Include placeholders exactly as follows where appropriate: {{name}} for customer name, {{companyName}} for 'Sara Jewelers'.
      7. URL RULES: NEVER use 'example.com'. ALWAYS use 'https://sarajeweler.com'. Use specific paths like '/products', '/collections/new-arrivals', or '/contact'.
      8. Include a clear Call to Action (CTA) button styled elegantly.
      9. KEEP IT CONCISE: The email body text should be SHORT and DIRECT. Max 150 words. Focus on visual appeal.
      
      Subject Input: "${prompt}"`;
      
      userContent = `Generate a JSON object containing a refined subject, internal name, and HTML template for: "${prompt}"`;
      maxTokens = 1500;
    } else if (type === 'variations') {
      systemPrompt = `You are an expert luxury jewelry consultant. Given a product name and categories, suggest logically relevant variations (e.g., Ring Size, Metal Type, Polish, Diamond Quality).
      Return ONLY a JSON object with this exact structure:
      {
        "variations": [
          { "title": "Size", "values": [{ "value": "6", "price": 0 }, { "value": "7", "price": 0 }] },
          { "title": "Material", "values": [{ "value": "22K Gold", "price": 0 }, { "value": "Platinum", "price": 500 }] }
        ]
      }`;
      userContent = `Suggest variations for a jewelry piece named "${productName}" in categories: ${categories ? categories.join(', ') : 'Jewelry'}.`;
      maxTokens = 800;
    } else if (type === 'pricing') {
      systemPrompt = `You are a jewelry market analyst. Given a product name and categories, suggest a realistic selling price, market price (old price), and initial stock level.
      Return ONLY a JSON object with this exact structure:
      {
        "price": "1250.00",
        "oldPrice": "1500.00",
        "stock": "10"
      }
      Rules:
      1. Prices should be realistic for luxury jewelry (e.g., Gold rings $500-$3000, Diamond sets $2000+).
      2. 'oldPrice' should be 15-30% higher than 'price'.
      3. Stock should be low (5-20) to create scarcity.`;
      
      userContent = `Suggest pricing and stock for "${productName}" (Categories: ${categories ? categories.join(', ') : 'Jewelry'}).`;
      maxTokens = 500;
    } else if (type === 'specifications') {
      systemPrompt = `You are an expert jewelry gemologist. Given a product name and categories, suggest realistic technical specifications (e.g., Material, Weight in grams, Purity, Gemstone, Dimension).
      Return ONLY a JSON object with this exact structure:
      {
        "specifications": [
          { "title": "Material", "value": "22K Gold", "type": "string" },
          { "title": "Weight (g)", "value": "5.5", "type": "number" }
        ]
      }`;
      userContent = `Suggest technical specifications for a jewelry piece named "${productName}" in categories: ${categories ? categories.join(', ') : 'Jewelry'}.`;
      maxTokens = 800;
    } else {
      const { productName, categories, keywords } = body;
      const isShort = type === 'short';
      const lengthInstruction = isShort 
        ? "Keep it extremely concise. Maximum 150 characters. 1-2 punchy sentences maximum." 
        : "Write a concise but detailed description. Maximum 100 words. Focus on impact over length.";

      systemPrompt = `You are an expert luxury jewelry copywriter. Your tone is elegant, sophisticated, and persuasive.
      You are writing for 'Sara Jewelers', a high-end brand.
      Avoid generic adjectives. Use sensory words.
      Do NOT wrap the output in quotes.
      STRICTLY follow the length constraints provided.`;
      
      userContent = `Write a ${isShort ? 'short' : 'long'} product description for a jewelry piece named "${productName}".
      Categories: ${categories ? categories.join(', ') : 'Jewelry'}
      Keywords: ${keywords || 'Luxury, Craftsmanship'}
      
      ${lengthInstruction}`;
      
      maxTokens = isShort ? 120 : 350;
    }

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    const content = response.choices[0].message.content || "";

    if (['template', 'variations', 'specifications', 'pricing'].includes(type)) {
      try {
        // Clean any potential markdown wrapping
        const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
        const parsedData = JSON.parse(cleanedContent);
        return NextResponse.json(parsedData);
      } catch (e) {
        console.error("JSON Parse Error:", e, content);
        return NextResponse.json({ 
          error: "Failed to parse AI response as JSON",
          content: content 
        }, { status: 500 });
      }
    }

    return NextResponse.json({ content });

  } catch (error: any) {
    console.error("AI Generate Error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
