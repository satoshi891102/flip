import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
}

const sizeStyles = {
  sm: { fontSize: "var(--text-xs)", padding: "6px 12px" },
  md: { fontSize: "var(--text-sm)", padding: "10px 20px" },
  lg: { fontSize: "var(--text-base)", padding: "14px 28px" },
};

const variantStyles = {
  primary: {
    backgroundColor: "#635BFF",
    color: "#ffffff",
    border: "none",
  },
  secondary: {
    backgroundColor: "transparent",
    color: "#0a2540",
    border: "1px solid #e3e8ee",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#425466",
    border: "none",
  },
  danger: {
    backgroundColor: "#ff453a",
    color: "#ffffff",
    border: "none",
  },
};

export function Button({ variant = "primary", size = "md", loading, children, disabled, style, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        borderRadius: "var(--radius-xl)",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1,
        transition: "all 150ms ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {loading && (
        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
}
