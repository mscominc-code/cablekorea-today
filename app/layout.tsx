import "./globals.css";
import type { Metadata } from "next";

import Header from "@/components/Header";
import ClientStickyCallBar from "@/components/ClientStickyCallBar";

export const metadata: Metadata = {
  title: "케이블코리아 | 미국 인터넷 요금제 비교 | ZIP 기준 추천 플랜",
  description:
    "ZIP Code 기준으로 미국 인터넷 요금제를 비교하세요. 지역별 추천 플랜과 한국어 상담 제공.",
    icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  keywords: [
    "미국 인터넷",
    "미국 인터넷 가입",
    "미국 인터넷 한국어",
    "미국 인터넷 요금제",
    "미국 인터넷 비교",
    "미국 유학생 인터넷",
    "미국 가족 인터넷",
    "미국 인터넷 ZIP",
  ],
  metadataBase: new URL("https://cablekorea.com"),
  openGraph: {
    title: "케이블코리아 | 미국 인터넷 한국어 비교",
    description:
      "미국 인터넷·모바일 요금제를 한국어로 비교하고 바로 가입하세요. 한국어 상담 지원.",
    url: "https://cablekorea.com",
    siteName: "케이블코리아",
    locale: "ko_KR",
    type: "website",
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
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "케이블코리아",
      url: "https://cablekorea.com",
      logo: "https://cablekorea.com/icon.png",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-800-777-5840",
        contactType: "customer service",
        areaServed: "US",
        availableLanguage: ["Korean", "English"],
      },
    }),
  }}
/>

      </body>
    </html>
  );
}

