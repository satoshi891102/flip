import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#0f0f0f", padding: "100px 0" }}>
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div
          className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
          style={{
            borderColor: "#e3e8ee",
            color: "#425466",
            fontFamily: "var(--font-body)",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#30d158" }} />
          Now available
        </div>

        <h1
          className="mb-6 tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-4xl)",
            lineHeight: "var(--leading-tight)",
            color: "#0a2540",
          }}
        >
          Build something{" "}
          <span style={{ color: "#635BFF" }}>extraordinary</span>
        </h1>

        <p
          className="mx-auto mb-10 max-w-2xl"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-lg)",
            lineHeight: "var(--leading-relaxed)",
            color: "#425466",
          }}
        >
          The modern platform for teams who ship fast. Designed with precision,
          built for scale, and loved by developers worldwide.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{
              backgroundColor: "#635BFF",
              borderRadius: "var(--radius-xl)",
              fontFamily: "var(--font-body)",
            }}
          >
            Start for free
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center border px-6 py-3 text-sm font-semibold transition-all hover:bg-gray-50"
            style={{
              borderColor: "#e3e8ee",
              borderRadius: "var(--radius-xl)",
              color: "#0a2540",
              fontFamily: "var(--font-body)",
            }}
          >
            Book a demo
          </Link>
        </div>
      </div>
    </section>
  );
}
