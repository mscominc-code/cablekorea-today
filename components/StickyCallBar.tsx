"use client";
import { gaEvent } from "@/lib/ga";

export default function StickyCallBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 px-4 py-3 shadow-lg"

    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between">
        {/* 텍스트 영역 */}
        <div className="text-sm font-semibold text-white">
          🇺🇸 한국어 전화 상담
          <span className="ml-2 text-base font-extrabold text-rose-400">
            1-800-777-5840
          </span>
        </div>

        {/* CTA 버튼 */}
        <a
  href="tel:18007775840"
  onClick={() => gaEvent("call_click", { location: "sticky_bar" })}
  className="
    flex items-center gap-3
    rounded-full
    bg-rose-500
    px-5 py-2.5
    text-sm font-extrabold text-white
    shadow-lg
    hover:bg-rose-600
    active:scale-95
    transition
  "
>
  {/* 아이콘 */}
  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-500">
    📞
  </span>

  <span className="hidden sm:inline">지금 전화하기</span>
</a>

      </div>
    </div>
  );
}
