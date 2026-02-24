"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Copy, Check, Trash2, Package } from "lucide-react";

interface HistoryItem {
  id: number;
  imageData: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  features: string[];
  createdAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("flip-history") || "[]");
    setItems(stored);
  }, []);

  const copyItem = async (item: HistoryItem) => {
    const text = `${item.title}\n\n${item.description}\n\nPrice: $${item.price}\nCondition: ${item.condition}\nCategory: ${item.category}${item.features?.length ? "\n\nFeatures:\n" + item.features.map((f) => `• ${f}`).join("\n") : ""}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteItem = (id: number) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    localStorage.setItem("flip-history", JSON.stringify(updated));
  };

  const reuse = (item: HistoryItem) => {
    if (item.imageData) {
      sessionStorage.setItem("flip-image", item.imageData);
      router.push("/generate");
    }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="px-5 pt-14 animate-fade-in">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "#f0f0f0", fontFamily: "var(--font-display)" }}
        >
          History
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#666" }}>
          {items.length} listing{items.length !== 1 ? "s" : ""} generated
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          >
            <Clock size={28} style={{ color: "#666" }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "#a0a0a0" }}>
              No listings yet
            </p>
            <p className="mt-1 text-xs" style={{ color: "#666" }}>
              Upload a photo to create your first listing
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl"
              style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex gap-3 p-3">
                {/* Thumbnail */}
                {item.imageData && !item.imageData.endsWith("...") && (
                  <img
                    src={item.imageData}
                    alt={item.title}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    onClick={() => reuse(item)}
                    style={{ cursor: "pointer" }}
                  />
                )}
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-semibold"
                    style={{ color: "#f0f0f0" }}
                  >
                    {item.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#635BFF" }}
                    >
                      ${item.price}
                    </span>
                    <span
                      className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        color: "#a0a0a0",
                      }}
                    >
                      {item.condition}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Package size={10} style={{ color: "#666" }} />
                    <span className="text-[11px]" style={{ color: "#666" }}>
                      {item.category}
                    </span>
                    <span className="text-[11px]" style={{ color: "#444" }}>·</span>
                    <span className="text-[11px]" style={{ color: "#666" }}>
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div
                className="flex border-t"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <button
                  onClick={() => copyItem(item)}
                  className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors"
                  style={{
                    color: copiedId === item.id ? "#22c55e" : "#a0a0a0",
                  }}
                >
                  {copiedId === item.id ? (
                    <Check size={13} />
                  ) : (
                    <Copy size={13} />
                  )}
                  {copiedId === item.id ? "Copied!" : "Copy"}
                </button>
                <div
                  className="w-px"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                />
                <button
                  onClick={() => deleteItem(item.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors"
                  style={{ color: "#666" }}
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
