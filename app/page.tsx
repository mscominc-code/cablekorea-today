"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { gaEvent } from "@/lib/ga";



export default function HomePage() {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const zipOk = /^\d{5}$/.test(zip);
  const [locLoading, setLocLoading] = useState(false);


  return (
    <main className="min-h-screen bg-slate-50">
      {/* ===== Hero Section ===== */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-10">
        <div className="rounded-[32px] bg-white p-8 shadow-sm md:p-12">
          <h1 className="text-3xl font-extrabold leading-tight text-ckNavy md:text-4xl">
            미국 인터넷·모바일,
            <br />
            <span className="text-ckOrange">
              한국어로 쉽게 비교
            </span>
            하고 바로 가입
          </h1>

          <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
            Zip Code만 입력하면 우리 동네에서 가능한
            인터넷·모바일 요금제를 한눈에 비교하고,
            한국어 상담으로 바로 가입할 수 있어요.
          </p>

          {/* ZIP Input Card */}
          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
           <div className="flex flex-col gap-3 sm:flex-row">
  <input
    value={zip}
    onChange={(e) => setZip(e.target.value.trim())}
    inputMode="numeric"
    maxLength={5}
    placeholder="Zip Code 5자리를 입력하세요"
    className="
      flex-1
      rounded-2xl
      border
      border-slate-300
      bg-white
      px-5
      py-4
      text-base
      text-slate-900
      placeholder:text-slate-400
      outline-none
      focus:border-slate-900
      focus:ring-1
      focus:ring-slate-900
    "
  />

  <button
    disabled={!zipOk || locLoading}
    onClick={async () => {
      try {
        setLocLoading(true);
        localStorage.setItem("ck_zip", zip);
        window.dispatchEvent(new Event("ck_zip_updated"));
        router.push(`/compare?zip=${zip}`);
      } finally {
        setLocLoading(false);
      }
    }}
    className="
      shrink-0
      min-w-[140px]
      rounded-2xl
      bg-slate-900
      px-6
      py-4
      text-base
      font-extrabold
      text-white
      shadow-md
      transition
      hover:bg-slate-800
      disabled:opacity-40
    "
  >
    {locLoading ? "조회중..." : "TOP3 보기"}
  </button>
</div>


            <p className="mt-3 text-sm text-slate-500">
              ✔ 숨은 비용까지 고려한 추천 · ✔ 한국어 상담 가능
            </p>
          </div>
        </div>
      </section>

      {/* ===== Value Proposition ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "숨은 비용까지 계산",
              desc: "프로모션 이후 요금, 장비비, 설치비까지 모두 고려해 추천해요.",
            },
            {
              title: "유학생·가족·게이머 맞춤",
              desc: "사용 목적에 따라 가장 유리한 요금제를 자동으로 골라드려요.",
            },
            {
              title: "한국어 상담 & 가입",
              desc: "복잡한 계약 조건, 한국어로 설명 듣고 바로 가입하세요.",
            },
          ].map((v, i) => (
            <div
              key={i}
              className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-extrabold text-ckNavy">
                {v.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
     
    </main>
  );
}

