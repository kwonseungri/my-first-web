import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "내 블로그",
  description: "개인 블로그입니다.",
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
          <Header />
          <main className="flex-1 max-w-4xl mx-auto p-6 w-full">
            {children}
          </main>
        </AuthProvider>
        <footer className="text-center text-gray-500 py-6 border-t mt-auto">
          © 2026 내 블로그
        </footer>
      </body>
    </html>
  );
}
