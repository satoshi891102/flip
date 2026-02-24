"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, Tag } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: Clock },
  { href: "/pricing", label: "Pricing", icon: Tag },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        backgroundColor: "rgba(15, 15, 15, 0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-4 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1 transition-colors"
              style={{
                color: isActive ? "#635BFF" : "#666666",
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span
                className="text-[10px] font-medium"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
