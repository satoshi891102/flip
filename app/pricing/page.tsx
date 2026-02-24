"use client";

import { Check, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Zap,
    color: "#a0a0a0",
    bg: "rgba(255,255,255,0.03)",
    features: [
      "3 listings per day",
      "AI photo analysis",
      "SEO-optimized titles",
      "Price suggestions",
      "Copy to clipboard",
      "Listing history (last 10)",
    ],
    cta: "Current Plan",
    ctaStyle: { backgroundColor: "rgba(255,255,255,0.06)", color: "#a0a0a0" },
    disabled: true,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    icon: Crown,
    color: "#635BFF",
    bg: "rgba(99,91,255,0.06)",
    border: "rgba(99,91,255,0.2)",
    features: [
      "Unlimited listings",
      "AI photo analysis",
      "SEO-optimized titles",
      "Price suggestions with comps",
      "Copy to clipboard",
      "Unlimited history",
      "Multi-photo support",
      "Platform-specific formatting",
      "Priority support",
    ],
    cta: "Coming Soon",
    ctaStyle: { backgroundColor: "#635BFF", color: "#fff" },
    disabled: true,
    badge: "BEST VALUE",
  },
];

export default function PricingPage() {
  return (
    <div className="px-5 pt-14 animate-fade-in">
      <div className="mb-8 text-center">
        <h1
          className="text-2xl font-bold"
          style={{ color: "#f0f0f0", fontFamily: "var(--font-display)" }}
        >
          Simple pricing
        </h1>
        <p className="mt-2 text-sm" style={{ color: "#666" }}>
          Start free. Upgrade when you need more.
        </p>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="relative overflow-hidden rounded-2xl p-5"
            style={{
              backgroundColor: plan.bg,
              border: plan.border ? `1px solid ${plan.border}` : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {plan.badge && (
              <div
                className="absolute top-3 right-3 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: "#635BFF", color: "#fff" }}
              >
                {plan.badge}
              </div>
            )}

            <div className="mb-4 flex items-center gap-2.5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${plan.color}15` }}
              >
                <plan.icon size={20} style={{ color: plan.color }} />
              </div>
              <div>
                <p className="text-base font-bold" style={{ color: "#f0f0f0" }}>
                  {plan.name}
                </p>
                <p>
                  <span className="text-xl font-bold" style={{ color: "#f0f0f0" }}>
                    {plan.price}
                  </span>
                  <span className="text-xs" style={{ color: "#666" }}>
                    {plan.period}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-5 space-y-2.5">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={14} style={{ color: plan.color }} />
                  <span className="text-sm" style={{ color: "#a0a0a0" }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>

            <button
              disabled={plan.disabled}
              className="w-full rounded-xl py-3 text-sm font-semibold transition-all"
              style={plan.ctaStyle}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs" style={{ color: "#444" }}>
        Pro plan launching soon. Free tier is fully functional.
      </p>
    </div>
  );
}
