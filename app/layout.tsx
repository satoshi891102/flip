import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/bottom-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flip — AI Listing Generator",
  description:
    "Snap a photo, get a perfect marketplace listing. AI-powered titles, descriptions, and pricing in seconds.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Flip",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0f0f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-md min-h-dvh pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
