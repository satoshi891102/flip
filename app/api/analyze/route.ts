import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

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

    // Extract mime type and base64 data from data URL
    // Handles: data:image/jpeg;base64,... data:image/png;base64,... data:image/webp;base64,...
    const dataUrlMatch = image.match(/^data:([^;]+);base64,([\s\S]+)$/);
    
    let base64Data: string;
    let mimeType: string;
    
    if (dataUrlMatch) {
      mimeType = dataUrlMatch[1];
      base64Data = dataUrlMatch[2];
    } else {
      // If no data URL prefix, assume raw base64 jpeg
      mimeType = "image/jpeg";
      base64Data = image;
    }

    // Clean any whitespace/newlines from base64
    base64Data = base64Data.replace(/\s/g, "");

    // Validate base64 is not empty
    if (!base64Data || base64Data.length < 100) {
      return NextResponse.json(
        { error: "Image data is too small or empty" },
        { status: 400 }
      );
    }

    // Resize if the base64 is very large (>4MB) - compress by truncating quality
    // Gemini accepts up to 20MB but Vercel serverless has limits
    const sizeInBytes = Math.ceil(base64Data.length * 0.75);
    if (sizeInBytes > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image is too large. Please use a smaller photo (under 10MB)." },
        { status: 400 }
      );
    }

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
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    let listing;
    try {
      listing = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse Gemini response:", responseText.substring(0, 500));
      return NextResponse.json(
        { error: "AI returned an unexpected format. Please try again." },
        { status: 500 }
      );
    }

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
          { error: `AI response missing field: ${field}. Please try again.` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(listing);
  } catch (error: unknown) {
    console.error("Analyze error:", error);
    
    // Better error messages for common failures
    const message = error instanceof Error ? error.message : "Failed to analyze image";
    
    if (message.includes("API_KEY")) {
      return NextResponse.json({ error: "API configuration error. Please contact support." }, { status: 500 });
    }
    if (message.includes("quota") || message.includes("rate")) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
    }
    if (message.includes("SAFETY")) {
      return NextResponse.json({ error: "Image was flagged by safety filters. Please try a different photo." }, { status: 400 });
    }
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
