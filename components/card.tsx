import { ReactNode } from "react";

interface CardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export function Card({ title, description, icon, children }: CardProps) {
  return (
    <div
      className="group transition-all hover:translate-y-[-2px]"
      style={{
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "var(--shadow-elevated)",
        borderRadius: "var(--radius-xl)",
        padding: "32px",
      }}
    >
      {icon && (
        <div
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#f5f3ff", color: "#635BFF" }}
        >
          {icon}
        </div>
      )}
      <h3
        className="mb-2 font-semibold"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-lg)",
          color: "#0a2540",
        }}
      >
        {title}
      </h3>
      <p
        className="leading-relaxed"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          color: "#425466",
        }}
      >
        {description}
      </p>
      {children}
    </div>
  );
}
