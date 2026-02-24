"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, Sparkles, Zap, Copy } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const compressImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 1200;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const compressed = await compressImage(file);
      sessionStorage.setItem("flip-image", compressed);
      router.push("/generate");
    },
    [router, compressImage]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div className="px-5 pt-14 animate-fade-in">
      {/* Logo */}
      <div className="mb-10">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "#f0f0f0" }}
        >
          flip<span style={{ color: "#635BFF" }}>.</span>
        </h1>
      </div>

      {/* Hero */}
      <div className="mb-8">
        <h2
          className="mb-3 text-[32px] font-bold leading-[1.1] tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "#f0f0f0" }}
        >
          Photo in,
          <br />
          <span style={{ color: "#635BFF" }}>listing out.</span>
        </h2>
        <p
          className="text-[15px] leading-relaxed"
          style={{ color: "#a0a0a0" }}
        >
          Snap a photo of anything you want to sell. AI generates the perfect
          title, description, and price in seconds.
        </p>
      </div>

      {/* Upload area */}
      <div
        className="relative mb-8 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all"
        style={{
          borderColor: isDragging ? "#635BFF" : "rgba(255, 255, 255, 0.12)",
          backgroundColor: isDragging
            ? "rgba(99, 91, 255, 0.08)"
            : "rgba(255, 255, 255, 0.03)",
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl pulse-glow"
          style={{ backgroundColor: "rgba(99, 91, 255, 0.15)" }}
        >
          <Camera size={28} style={{ color: "#635BFF" }} />
        </div>
        <p
          className="mb-1 text-base font-semibold"
          style={{ color: "#f0f0f0" }}
        >
          Upload a photo
        </p>
        <p className="text-sm" style={{ color: "#666666" }}>
          Take a photo or drag & drop an image
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* How it works */}
      <div className="mb-8">
        <h3
          className="mb-4 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#666666" }}
        >
          How it works
        </h3>
        <div className="space-y-3">
          {[
            {
              icon: Camera,
              title: "Snap a photo",
              desc: "Upload or take a photo of your item",
            },
            {
              icon: Sparkles,
              title: "AI analyzes it",
              desc: "Identifies item, condition, brand & value",
            },
            {
              icon: Zap,
              title: "Get your listing",
              desc: "SEO title, description, price — all editable",
            },
            {
              icon: Copy,
              title: "Copy & sell",
              desc: "Paste into any marketplace in one tap",
            },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl p-3"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
            >
              <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(99, 91, 255, 0.12)" }}
              >
                <Icon size={16} style={{ color: "#635BFF" }} />
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#f0f0f0" }}
                >
                  {title}
                </p>
                <p className="text-xs" style={{ color: "#666666" }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
