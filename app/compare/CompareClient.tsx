"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CompareLocationBanner from "@/components/CompareLocationBanner";
import { carriers, plans, type Plan } from "@/lib/plans";
import { calc12moTotal } from "@/lib/recommend";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from "@/lib/utils";
import { gaEvent } from "@/lib/ga";

/* =========================
   유틸
========================= */

function money12(plan: Plan, includeHidden: boolean) {
  return includeHidden ? calc12moTotal(plan) : plan.promoPrice * 12;
}
function fmtPrice(n: number) {
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2);
}

function getPlanRoles(list: Plan[], includeHidden: boolean) {
  if (list.length === 0) return {};

  const bySpeed = [...list].sort(
    (a, b) => a.downloadMbps - b.downloadMbps
  );

  const byCost = [...list].sort(
    (a, b) => money12(a, includeHidden) - money12(b, includeHidden)
  );

  return {
    cheapId: byCost[0].id, // 가성비
    fastId: bySpeed[bySpeed.length - 1].id, // 최고속
    recommendId: bySpeed[Math.floor(bySpeed.length / 2)].id, // 추천
  };
}

function PlanBadge({ label }: { label: "가성비" | "최고속" | "추천" }) {
  const style =
    label === "가성비"
      ? "bg-emerald-50 text-emerald-700"
      : label === "최고속"
      ? "bg-blue-50 text-blue-700"
      : "bg-purple-50 text-purple-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${style}`}
    >
      {label}
    </span>
  );
}

/* =========================
   메인 컴포넌트
========================= */

export default function CompareClient() {
  const sp = useSearchParams();
  const zip = (sp.get("zip") ?? "").trim();

  const [includeHidden, setIncludeHidden] = useState(false);

  // 통신사별로 묶기
  const grouped = useMemo(() => {
    return carriers.map((carrier) => {
      const list = plans
        .filter((p) => p.carrierId === carrier.id)
        .sort((a, b) => a.downloadMbps - b.downloadMbps); // 속도 낮 → 높

      return {
        carrier,
        list,
        roles: getPlanRoles(list, includeHidden),
      };
    });
  }, [includeHidden]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* ZIP 배너 */}
      <CompareLocationBanner />

      {/* 옵션 */}
      <section className="mt-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-ckNavy">
              요금제 비교
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {zip
                ? `ZIP ${zip} 기준 추천 요금제`
                : "ZIP을 입력하면 더 정확해져요"}
            </p>
          </div>

          <button
            onClick={() => setIncludeHidden((v) => !v)}
            className={
              "rounded-2xl px-4 py-2 text-sm font-extrabold transition " +
              (includeHidden
                ? "bg-ckNavy text-slate-500"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200")
            }
          >
            {includeHidden ? "✅ 숨은 비용 포함" : "숨은 비용 포함"}
          </button>
        </div>
      </section>

      {/* ===== 통신사별 플랜 ===== */}
      <section className="mt-6 space-y-6">
        {grouped.map(({ carrier, list, roles }) => (
          <div
            key={carrier.id}
             className={`rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm`}
          >
            <div className="flex items-center gap-3">
              <img
              src={carrier.logo}
              /* 로고있을때는 텍스트 안보여 주기
              alt={carrier.name}
              className="h-8 w-auto"
  />
            <h2 className="text-lg font-extrabold text-ckNavy">
             {carrier.name}
            </h2>
            */
          </div>
            <p className="mt-1 text-sm text-slate-600">
             {carrier.id === "att" && "업로드 속도가 빠른 광랜(Fiber) 중심 요금제"}
             {carrier.id === "spectrum" && "미국 전역 가용성이 높은 케이블 인터넷"}
              {carrier.id === "frontier" && "가성비 좋은 파이버 요금제"}
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {list.map((p) => {
                const total12 = money12(p, includeHidden);

                return (
                  <div
                    key={p.id}
                    className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    {/* 제목 + 뱃지 */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-lg font-extrabold text-ckNavy">
                        {p.name}
                      </div>

                      {p.id === roles.cheapId && (
                        <PlanBadge label="가성비" />
                      )}
                      {p.id === roles.fastId && (
                        <PlanBadge label="최고속" />
                      )}
                      {p.id === roles.recommendId && (
                        <PlanBadge label="추천" />
                      )}
                    </div>

                    <p className="mt-1 text-sm text-slate-600">
                      다운로드 {p.downloadMbps}Mbps
                    </p>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="text-slate-500">월</div>
                        <div className="font-extrabold">
                          ${fmtPrice(p.promoPrice)}
                        </div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="text-slate-500">12개월</div>
                        <div className="font-extrabold">
                          ${total12.toFixed(0)}
                        </div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="text-slate-500">약정</div>
                        <div className="font-extrabold">
                          {p.contractMonths === 0
                            ? "무약정"
                            : `${p.contractMonths}개월`}
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:${SUPPORT_PHONE_TEL}`}
                      onClick={() =>
                        gaEvent("call_click", {
                          placement: "compare_card",
                          carrier: carrier.name,
                          plan_id: p.id,
                          zip,
                        })
                      }
                      className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-ckOrange px-4 py-3 text-sm font-extrabold text-ckNavy"
                    >
                      📞 이 플랜으로 상담 ({SUPPORT_PHONE_DISPLAY})
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
