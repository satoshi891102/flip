import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const PROMPT = `You are an expert marketplace listing generator. Analyze this product photo and generate a complete, SEO-optimized marketplace listing.

Return ONLY valid JSON with this exact structure (no markdown, no code fences):
{
  "title": "SEO-optimized marketplace listing title (max 80 chars, include brand/key features)",
  "description": "Detailed 2-3 paragraph product description for marketplace listing. Include condition notes, measurements if visible, material, brand, key features, and selling points. Use natural language, not bullet points for the main description.",
  "suggestedPrice": 25,
  "priceRange": { "low": 20, "high": 35 },
  "category": "One of: Electronics, Clothing, Furniture, Books, Sports, Toys, Home & Garden, Automotive, Collectibles, Other",
  "condition": "One of: New, Like New, Good, Fair, Poor",
  "features": ["feature1", "feature2", "feature3"]
}

Rules:
- Title should be what you'd search for on eBay/Facebook Marketplace
- Price in USD based on typical resale value for this item in this condition
- Be specific about brand, model, color, size when visible
- Description should be compelling and honest
- Features should be 3-6 key selling points`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const { image } = await request.json();
    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Strip data URL prefix to get raw base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const mimeMatch = image.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      PROMPT,
      {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      },
    ]);

    const responseText = result.response.text();

    // Parse JSON from response, stripping any markdown fences
    const cleaned = responseText
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const listing = JSON.parse(cleaned);

    // Validate required fields
    const required = [
      "title",
      "description",
      "suggestedPrice",
      "category",
      "condition",
    ];
    for (const field of required) {
      if (!(field in listing)) {
        return NextResponse.json(
          { error: `Missing field: ${field}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Analyze error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to analyze image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
