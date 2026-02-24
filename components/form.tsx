import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

const fieldStyle = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-sm)",
  color: "#0a2540",
  backgroundColor: "#1a1a1a",
  border: "1px solid #e3e8ee",
  borderRadius: "var(--radius-xl)",
  padding: "10px 14px",
  width: "100%",
  outline: "none",
  transition: "border-color 150ms ease",
};

export function Input({ label, error, hint, id, ...props }: InputProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 500, color: "#0a2540" }}
      >
        {label}
      </label>
      <input
        id={fieldId}
        style={{ ...fieldStyle, borderColor: error ? "#ff453a" : "#e3e8ee" }}
        onFocus={(e) => (e.target.style.borderColor = "#635BFF")}
        onBlur={(e) => (e.target.style.borderColor = error ? "#ff453a" : "#e3e8ee")}
        {...props}
      />
      {error && <span style={{ fontSize: "var(--text-xs)", color: "#ff453a" }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: "var(--text-xs)", color: "#8898aa" }}>{hint}</span>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, ...props }: TextareaProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 500, color: "#0a2540" }}>
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={4}
        style={{ ...fieldStyle, resize: "vertical", borderColor: error ? "#ff453a" : "#e3e8ee" }}
        onFocus={(e) => (e.target.style.borderColor = "#635BFF")}
        onBlur={(e) => (e.target.style.borderColor = error ? "#ff453a" : "#e3e8ee")}
        {...props}
      />
      {error && <span style={{ fontSize: "var(--text-xs)", color: "#ff453a" }}>{error}</span>}
    </div>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export function SelectField({ label, options, id, ...props }: SelectFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 500, color: "#0a2540" }}>
        {label}
      </label>
      <select id={fieldId} style={fieldStyle} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
