import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import Loading from "../components/loading";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Funny Movie",
  description: "Share your video",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable
      )}
      >
        <main>{children}</main><Toaster /></body>
    </html>
  );
}
