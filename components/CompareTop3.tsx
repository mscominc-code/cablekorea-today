"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { carriers, type Plan } from "@/lib/plans";
import { calc12moTotal } from "@/lib/recommend";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from "@/lib/utils";
import { gaEvent } from "@/lib/ga";

type Scenario = "student" | "family" | "gamer";

function money12(plan: Plan, includeHidden: boolean) {
  return includeHidden ? calc12moTotal(plan) : plan.promoPrice * 12;
}

/* ===== 시나리오별 점수 ===== */
function scorePlan(
  p: Plan,
  plans: Plan[],
  includeHidden: boolean,
  scenario: Scenario
) {
  const speeds = plans.map((x) => x.downloadMbps);
  const costs = plans.map((x) => money12(x, includeHidden));

  const sMin = Math.min(...speeds);
  const sMax = Math.max(...speeds);
  const cMin = Math.min(...costs);
  const cMax = Math.max(...costs);

  const norm = (x: number, min: number, max: number) =>
    max === min ? 0.5 : (x - min) / (max - min);

  const s = norm(p.downloadMbps, sMin, sMax);
  const c = norm(money12(p, includeHidden), cMin, cMax);

  const w =
    scenario === "student"
      ? { cost: 0.75, speed: 0.25 }
      : scenario === "family"
      ? { cost: 0.6, speed: 0.4 }
      : { cost: 0.35, speed: 0.65 };

  return (1 - c) * w.cost + s * w.speed;
}

/* ===== TOP3 선택 ===== */
function pickTop3(plans: Plan[], includeHidden: boolean, scenario: Scenario) {
  const list = [...plans];

  const byCheap = [...list].sort(
    (a, b) => money12(a, includeHidden) - money12(b, includeHidden)
  );

  const byFast = [...list].sort(
    (a, b) => b.downloadMbps - a.downloadMbps
  );

  const byScenario = [...list].sort(
    (a, b) =>
      scorePlan(b, list, includeHidden, scenario) -
      scorePlan(a, list, includeHidden, scenario)
  );

  const used = new Set<string>();
  const pick = (arr: Plan[]) => {
    const p = arr.find((x) => !used.has(x.id))!;
    used.add(p.id);
    return p;
  };

  return [
    { label: "가성비 TOP", plan: pick(byCheap) },
    {
      label:
        scenario === "student"
          ? "유학생 추천"
          : scenario === "family"
          ? "가족 추천"
          : "게이머 추천",
      plan: pick(byScenario),
    },
    { label: "최고속 TOP", plan: pick(byFast) },
  ];
}

/* ===== 메인 컴포넌트 ===== */
export default function CompareTop3({
  plans,
  includeHidden,
}: {
  plans: Plan[];
  includeHidden: boolean;
}) {
  const sp = useSearchParams();
  const zip = (sp.get("zip") ?? "").trim();

  const [scenario, setScenario] = useState<Scenario>("family");

  const top3 = useMemo(
    () => pickTop3(plans, includeHidden, scenario),
    [plans, includeHidden, scenario]
  );

  if (!plans.length) return null;

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      {/* ===== 헤더 ===== */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-ckNavy">
            이 지역 추천 TOP3
          </h2>
          <p className="text-sm text-slate-600">
            {includeHidden ? "숨은 비용 포함(12개월)" : "프로모 기준(12개월)"}
            {zip && ` · ZIP ${zip}`}
          </p>
        </div>

        <div className="flex gap-2">
          {(["student", "family", "gamer"] as Scenario[]).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={
                "rounded-2xl px-4 py-2 text-sm font-extrabold transition " +
                (scenario === s
                  ? "bg-ckNavy text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200")
              }
            >
              {s === "student" && "🎓 유학생"}
              {s === "family" && "👨‍👩‍👧‍👦 가족"}
              {s === "gamer" && "🎮 게이머"}
            </button>
          ))}
        </div>
      </div>

      {/* ===== 카드 ===== */}
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {top3.map(({ label, plan }) => {
          const c = carriers.find((x) => x.id === plan.carrierId);
          const total12 = money12(plan, includeHidden);

          return (
            <div
              key={plan.id}
              className="relative rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
            >
              {/* ✅ 브랜드 컬러 바 */}
              {c && (
                <div
                  className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${
                    c.brandColor.split(" ")[0]
                  }`}
                />
              )}

              <div className="ml-2">
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-700">
                    {label}
                  </span>
                  <span className="text-xs text-slate-500">{c?.name}</span>
                </div>

                <div className="mt-3 text-lg font-extrabold text-ckNavy">
                  {plan.name}
                </div>

                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-slate-600">속도</div>
                    <div className="font-extrabold">
                      {plan.downloadMbps}M
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-slate-600">월</div>
                    <div className="font-extrabold">
                      ${plan.promoPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-slate-600">12개월</div>
                    <div className="font-extrabold">
                      ${total12.toFixed(0)}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${SUPPORT_PHONE_TEL}`}
                  onClick={() =>
                    gaEvent("call_click", {
                      placement: "compare_top3",
                      plan_id: plan.id,
                      zip,
                    })
                  }
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-ckOrange px-4 py-3 text-sm font-extrabold text-ckNavy"
                >
                  📞 이 플랜으로 상담 ({SUPPORT_PHONE_DISPLAY})
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
