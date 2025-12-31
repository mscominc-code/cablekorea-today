import "./globals.css";
import type { Metadata } from "next";

import Header from "@/components/Header";
import ClientStickyCallBar from "@/components/ClientStickyCallBar";

export const metadata: Metadata = {
  title: "케이블코리아 | 미국 인터넷·모바일 한국어 비교",
  description:
    "미국 인터넷·모바일 요금제를 한국어로 쉽게 비교하고 바로 가입하세요. Zip Code 입력만으로 우리 동네 추천 요금제 제공.",
    icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Header />

        <main className="relative mx-auto w-full max-w-[1200px] px-4 py-8">
          {children}
        </main>

        <ClientStickyCallBar />
      </body>
    </html>
  );
}

