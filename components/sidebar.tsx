"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface SidebarItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  header?: ReactNode;
}

export function Sidebar({ items, header }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-screen w-64 flex-col border-r"
      style={{
        backgroundColor: "#1a1a1a",
        borderColor: "#e3e8ee",
      }}
    >
      {header && (
        <div className="flex h-16 items-center border-b px-5" style={{ borderColor: "#e3e8ee" }}>
          {header}
        </div>
      )}

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: active ? "#f5f3ff" : "transparent",
                color: active ? "#635BFF" : "#425466",
              }}
            >
              {item.icon && <span className="h-4 w-4 shrink-0">{item.icon}</span>}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4" style={{ borderColor: "#e3e8ee" }}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full" style={{ backgroundColor: "#ede9fe" }} />
          <div>
            <p className="text-sm font-medium" style={{ color: "#0a2540", fontFamily: "var(--font-body)" }}>User Name</p>
            <p className="text-xs" style={{ color: "#8898aa", fontFamily: "var(--font-body)" }}>user@email.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
