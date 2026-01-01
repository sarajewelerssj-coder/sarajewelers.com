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
    let maxTokens = 1000;
    const { instructions } = body;

    const toneRule = "\n\nSTRICT RULE: Use very simple, clear English. No complex words. Short sentences only. Avoid 'tough' vocabulary.";
    const instructionPrompt = instructions ? `\n\nADMIN INSTRUCTIONS: ${instructions}` : "";

    if (type === 'template') {
      const { prompt } = body;
      systemPrompt = `You are an expert email marketing copywriter for 'Sara Jewelers'. 
      Create a professional, high-converting HTML email template.
      ${toneRule}
      
      Return a JSON object:
      {
        "subject": "Refined subject line",
        "name": "Internal_Name",
        "html": "HTML code"
      }
      - Responsive, inline CSS.
      - Colors: Gold (#d4af37), Black, White.
      - Placeholders: {{name}}, {{companyName}}.
      - URLs: ALWAYS use 'https://www.sarajeweler.com'.
      - Concise text: Max 150 words.
      ${instructionPrompt}`;
      
      userContent = `Generate a JSON object containing a refined subject, internal name, and HTML template for: "${prompt}"`;
      maxTokens = 1500;
    } else if (type === 'variations') {
      systemPrompt = `You are an expert jewelry inventory assistant. 
      Task: Suggest variations for jewelry (e.g., Ring Size, Metal Type).
      ${toneRule}
      
      PRECISION RULES:
      1. BE TO THE POINT: Only suggest variations that are highly relevant to the product.
      2. NO EXTRA FLUFF: Do not add unnecessary or redundant variation types.
      3. STRICT INSTRUCTION COMPLIANCE: If ADMIN INSTRUCTIONS provide specific values or types, use them EXACTLY.
      
      RULES FOR PRICES:
      1. ONLY add prices if they are explicitly mentioned in the ADMIN INSTRUCTIONS.
      2. Default to "price": 0 if no prices are specified in instructions.
      3. NEVER hallucinate or guess prices. No extra pricing logic.
      
      Return ONLY a JSON object:
      {
        "variations": [
          { "title": "Size", "values": [{ "value": "6", "price": 0 }, { "value": "7", "price": 0 }] }
        ]
      }
      ${instructionPrompt}`;
      userContent = `Suggest variations for a jewelry piece named "${productName}" in categories: ${categories ? categories.join(', ') : 'Jewelry'}.`;
      maxTokens = 800;
    } else if (type === 'pricing') {
      systemPrompt = `Suggest realistic selling price, old price, and stock.
      ${toneRule}
      Return ONLY JSON:
      {
        "price": "1250.00",
        "oldPrice": "1500.00",
        "stock": "10"
      }
      ${instructionPrompt}`;
      userContent = `Suggest pricing and stock for "${productName}" (Categories: ${categories ? categories.join(', ') : 'Jewelry'}).`;
      maxTokens = 500;
    } else if (type === 'specifications') {
      systemPrompt = `You are a technical jewelry specialist. 
      Task: Suggest precise specifications (e.g., Material, Purity, Gemstone).
      ${toneRule}
      
      PRECISION RULES:
      1. TO THE POINT: Provide concise, accurate technical details. No conversational filler.
      2. STRICT INSTRUCTION COMPLIANCE: If ADMIN INSTRUCTIONS specify materials (e.g., "10K Gold"), YOU MUST USE THEM EXACTLY. DO NOT substitute with general suggestions like "22K Gold".
      3. PRIORITIZE KEYWORDS: Use provided keywords to focus the specifications.
      
      Return ONLY JSON:
      {
        "specifications": [
          { "title": "Material", "value": "22K Gold", "type": "string" }
        ]
      }
      ${instructionPrompt}`;
      userContent = `Suggest technical specifications for a jewelry piece named "${productName}" in categories: ${categories ? categories.join(', ') : 'Jewelry'}.`;
      maxTokens = 800;
    } else if (type === 'polish-name') {
      systemPrompt = `You are a creative naming expert for luxury jewelry.
      ${toneRule}
      Task: Polish the product name.
      Constraints:
      1. Length: MINIMUM 3 words, MAXIMUM 9 words.
      2. Relevance: Keep it relevant to the original input. Do not change the product type (e.g. don't change 'Ring' to 'Necklace').
      3. Style: clear, amazing, simple words.
      
      Return ONLY JSON:
      {
        "polishedName": "Radiant Gold Eternity Ring"
      }
      ${instructionPrompt}`;
      userContent = `Polish this product name: "${productName}".`;
      maxTokens = 200;
    } else {
      const { productName, categories, keywords } = body;
      const isShort = type === 'short';
      const lengthInstruction = isShort 
        ? "Write 2-3 sentences. Around 200-250 characters. Make it punchy but complete." 
        : "Write a detailed description. 150-200 words. Cover key features, benefits, and what makes it special.";

      systemPrompt = `You are a jewelry copywriter. Tone: Simple and persuasive.
      ${toneRule}
      ${instructionPrompt}`;
      
      userContent = `Write a ${isShort ? 'short' : 'long'} product description for a jewelry piece named "${productName}".
      Categories: ${categories ? categories.join(', ') : 'Jewelry'}
      Keywords: ${keywords || 'Luxury, Craftsmanship'}
      
      ${lengthInstruction}`;
      
      maxTokens = isShort ? 200 : 500;
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

    if (['template', 'variations', 'specifications', 'pricing', 'polish-name'].includes(type)) {
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
