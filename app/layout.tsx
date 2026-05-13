import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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
        <header className="bg-gray-800 text-white p-4">
          <nav className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-bold text-lg">내 블로그</Link>
            <div className="flex gap-4">
              <Link href="/" className="hover:underline">홈</Link>
              <Link href="/posts" className="hover:underline">블로그</Link>
              <Link href="/posts/new" className="hover:underline">새 글 쓰기</Link>
              <Link href="/login" className="hover:underline">로그인</Link>
              <Link href="/mypage" className="hover:underline">마이페이지</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 max-w-4xl mx-auto p-6 w-full">
          {children}
        </main>
        <footer className="text-center text-gray-500 py-6 border-t mt-auto">
          © 2026 내 블로그
        </footer>
      </body>
    </html>
  );
}
