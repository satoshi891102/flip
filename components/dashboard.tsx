import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

function StatCard({ label, value, change, changeType = "neutral" }: StatCardProps) {
  const changeColor = {
    positive: "#30d158",
    negative: "#ff453a",
    neutral: "#8898aa",
  }[changeType];

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "var(--radius-xl)",
        padding: "32px",
      }}
    >
      <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "#8898aa", marginBottom: "4px" }}>
        {label}
      </p>
      <div className="flex items-end gap-2">
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 600, color: "#0a2540", lineHeight: 1 }}>
          {value}
        </p>
        {change && (
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 500, color: changeColor }}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

interface DashboardLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen" style={{ backgroundColor: "#0f0f0f" }}>
      {sidebar}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}

export function DashboardStats({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
