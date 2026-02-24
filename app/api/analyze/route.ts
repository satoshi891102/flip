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
    const apiKey = process.env.GROQ_API_KEY;
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

    // Ensure we have a proper data URL
    let imageUrl = image;
    if (!image.startsWith("data:")) {
      imageUrl = `data:image/jpeg;base64,${image}`;
    }

    // Call Groq REST API directly (no SDK needed)
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: PROMPT },
                { type: "image_url", image_url: { url: imageUrl } },
              ],
            },
          ],
          max_tokens: 1024,
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Groq API error:", response.status, errBody);

      if (response.status === 429) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a moment and try again." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `AI service error (${response.status}). Please try again.` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response, stripping any markdown fences
    const cleaned = responseText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    let listing;
    try {
      listing = JSON.parse(cleaned);
    } catch {
      console.error(
        "Failed to parse response:",
        responseText.substring(0, 500)
      );
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
    const message =
      error instanceof Error ? error.message : "Failed to analyze image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
