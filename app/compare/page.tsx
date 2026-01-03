import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "미국 인터넷 요금제 비교 | ZIP 코드 기반 추천 – 케이블코리아",
  description:
    "미국 인터넷 요금제를 ZIP 코드 기준으로 비교하세요. AT&T, Spectrum, Frontier 요금제 한눈에 비교하고 한국어 상담으로 바로 가입 가능합니다.",
};

import { Suspense } from "react";
import CompareClient from "./CompareClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-600">Loading...</div>}>
      <CompareClient />
    </Suspense>
  );
}
