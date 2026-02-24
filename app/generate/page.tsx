"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Check,
  Save,
  Loader2,
  AlertCircle,
  Tag,
  DollarSign,
  Package,
  Sparkles,
} from "lucide-react";

interface Listing {
  title: string;
  description: string;
  suggestedPrice: number;
  priceRange: { low: number; high: number };
  category: string;
  condition: string;
  features: string[];
}

export default function GeneratePage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Editable fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  const analyze = useCallback(async (imageData: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data: Listing = await res.json();
      setListing(data);
      setTitle(data.title);
      setDescription(data.description);
      setPrice(String(data.suggestedPrice));
      setCategory(data.category);
      setCondition(data.condition);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("flip-image");
    if (!stored) {
      router.replace("/");
      return;
    }
    setImage(stored);
    analyze(stored);
  }, [router, analyze]);

  const copyToClipboard = async () => {
    const text = `${title}\n\n${description}\n\nPrice: $${price}\nCondition: ${condition}\nCategory: ${category}${listing?.features?.length ? "\n\nFeatures:\n" + listing.features.map((f) => `• ${f}`).join("\n") : ""}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveToHistory = () => {
    if (!image || !listing) return;
    const history = JSON.parse(localStorage.getItem("flip-history") || "[]");
    history.unshift({
      id: Date.now(),
      image: image.substring(0, 200) + "...", // Store thumbnail reference
      imageData: image,
      title,
      description,
      price: Number(price),
      category,
      condition,
      features: listing.features,
      createdAt: new Date().toISOString(),
    });
    // Keep last 50
    if (history.length > 50) history.pop();
    localStorage.setItem("flip-history", JSON.stringify(history));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const conditionOptions = ["New", "Like New", "Good", "Fair", "Poor"];
  const categoryOptions = [
    "Electronics",
    "Clothing",
    "Furniture",
    "Books",
    "Sports",
    "Toys",
    "Home & Garden",
    "Automotive",
    "Collectibles",
    "Other",
  ];

  return (
    <div className="px-5 pt-4 pb-6 animate-fade-in">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <ArrowLeft size={18} style={{ color: "#a0a0a0" }} />
        </button>
        <h1
          className="text-lg font-bold"
          style={{ color: "#f0f0f0", fontFamily: "var(--font-display)" }}
        >
          {loading ? "Analyzing..." : "Your Listing"}
        </h1>
      </div>

      {/* Photo preview */}
      {image && (
        <div className="mb-5 overflow-hidden rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
          <img
            src={image}
            alt="Product"
            className="w-full object-cover"
            style={{ maxHeight: "280px" }}
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-12">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(99,91,255,0.15)" }}
          >
            <Loader2
              size={28}
              className="animate-spin"
              style={{ color: "#635BFF" }}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "#f0f0f0" }}>
              AI is analyzing your item...
            </p>
            <p className="mt-1 text-xs" style={{ color: "#666" }}>
              Identifying brand, condition & market value
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="mb-5 flex items-start gap-3 rounded-xl p-4"
          style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
        >
          <AlertCircle size={18} style={{ color: "#ef4444" }} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium" style={{ color: "#ef4444" }}>
              Analysis failed
            </p>
            <p className="mt-1 text-xs" style={{ color: "#a0a0a0" }}>
              {error}
            </p>
            <button
              onClick={() => image && analyze(image)}
              className="mt-2 text-xs font-medium"
              style={{ color: "#635BFF" }}
            >
              Try again →
            </button>
          </div>
        </div>
      )}

      {/* Generated listing */}
      {listing && !loading && (
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider" style={{ color: "#666" }}>
              <Sparkles size={12} /> Title
            </label>
            {editMode ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border-0 px-4 py-3 text-sm font-medium outline-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  color: "#f0f0f0",
                }}
              />
            ) : (
              <p className="text-[15px] font-semibold leading-snug" style={{ color: "#f0f0f0" }}>
                {title}
              </p>
            )}
          </div>

          {/* Price + Condition + Category row */}
          <div className="grid grid-cols-3 gap-2">
            <div
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: "rgba(99,91,255,0.1)" }}
            >
              <DollarSign size={14} className="mx-auto mb-1" style={{ color: "#635BFF" }} />
              {editMode ? (
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  className="w-full border-0 bg-transparent text-center text-lg font-bold outline-none"
                  style={{ color: "#f0f0f0" }}
                />
              ) : (
                <p className="text-lg font-bold" style={{ color: "#f0f0f0" }}>
                  ${price}
                </p>
              )}
              {listing.priceRange && (
                <p className="text-[10px]" style={{ color: "#666" }}>
                  ${listing.priceRange.low}–${listing.priceRange.high}
                </p>
              )}
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            >
              <Package size={14} className="mx-auto mb-1" style={{ color: "#a0a0a0" }} />
              {editMode ? (
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full border-0 bg-transparent text-center text-xs font-medium outline-none"
                  style={{ color: "#f0f0f0" }}
                >
                  {conditionOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              ) : (
                <p className="text-xs font-medium" style={{ color: "#f0f0f0" }}>
                  {condition}
                </p>
              )}
              <p className="text-[10px]" style={{ color: "#666" }}>Condition</p>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            >
              <Tag size={14} className="mx-auto mb-1" style={{ color: "#a0a0a0" }} />
              {editMode ? (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border-0 bg-transparent text-center text-xs font-medium outline-none"
                  style={{ color: "#f0f0f0" }}
                >
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              ) : (
                <p className="text-xs font-medium" style={{ color: "#f0f0f0" }}>
                  {category}
                </p>
              )}
              <p className="text-[10px]" style={{ color: "#666" }}>Category</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 text-xs font-medium uppercase tracking-wider" style={{ color: "#666" }}>
              Description
            </label>
            {editMode ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-xl border-0 px-4 py-3 text-sm leading-relaxed outline-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  color: "#a0a0a0",
                }}
              />
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#a0a0a0" }}>
                {description}
              </p>
            )}
          </div>

          {/* Features */}
          {listing.features?.length > 0 && (
            <div>
              <label className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: "#666" }}>
                Key Features
              </label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {listing.features.map((f, i) => (
                  <span
                    key={i}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium"
                    style={{
                      backgroundColor: "rgba(99,91,255,0.1)",
                      color: "#635BFF",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex-1 rounded-xl py-3 text-sm font-medium transition-colors"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                color: "#a0a0a0",
              }}
            >
              {editMode ? "Done editing" : "Edit"}
            </button>
            <button
              onClick={saveToHistory}
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                color: saved ? "#22c55e" : "#a0a0a0",
              }}
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          <button
            onClick={copyToClipboard}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all"
            style={{
              backgroundColor: copied ? "#22c55e" : "#635BFF",
              color: "#fff",
            }}
          >
            {copied ? (
              <>
                <Check size={18} /> Copied to clipboard!
              </>
            ) : (
              <>
                <Copy size={18} /> Copy Listing
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
