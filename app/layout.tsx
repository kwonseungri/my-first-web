import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import NotificationListener from "@/components/NotificationListener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "승리의 블로그",
  description: "Next.js로 만든 블로그입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <AuthProvider>
          <NotificationListener />
          <Header />
          <main className="flex-1 max-w-4xl mx-auto p-6 w-full">
            {children}
          </main>
        </AuthProvider>
        <Toaster />
        <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto">
          © 2026 승리의 블로그
        </footer>
      </body>
    </html>
  );
}
