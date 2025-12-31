"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { carriers, plans } from "@/lib/plans";
import { pickTop3, calc12moTotal } from "@/lib/recommend";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from "@/lib/utils";
import { gaEvent } from "@/lib/ga";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold text-orange-700">
      {children}
    </span>
  );
}

type ZipLookup = { zip: string; city: string | null; state: string | null };

export default function ZipSearch() {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [submittedZip, setSubmittedZip] = useState<string | null>(null);

  const [loc, setLoc] = useState<ZipLookup | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const zipOk = /^\d{5}$/.test(zip);
  const top3 = useMemo(() => pickTop3(plans), [submittedZip]);

  async function lookupZip(z: string) {
    setLoc(null);
    setLocError(null);
    setLocLoading(true);
    try {
      const res = await fetch(`/api/zip/${z}`);
      if (!res.ok) {
        setLocError("해당 Zip의 City/State 정보를 찾을 수 없어요. (전화로 1분 내 확인 가능)");
        return;
      }
      const data = (await res.json()) as ZipLookup;
      setLoc(data);
    } catch {
      setLocError("Zip 조회 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setLocLoading(false);
    }
  }

  return (
   <section className="
  relative overflow-hidden
  rounded-[28px]
  bg-gradient-to-br from-slate-50 via-white to-slate-100
  p-7
  shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]
">

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
          미국 인터넷·모바일, <span className="text-ckOrange">한국어로 쉽게 비교</span>하고 바로 가입
        </h1>
        <p className="text-base text-slate-500 md:text-lg">
          Zip Code만 입력하면 우리 동네 가능한 요금제를 추천해드려요.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={zip}
          onChange={(e) => setZip(e.target.value.trim())}
          inputMode="numeric"
          maxLength={5}
          placeholder="우편번호(Zip Code) 5자리를 입력하세요"
          className="
  w-full rounded-2xl
  border border-slate-300
  bg-white/80
  px-5 py-4 text-base
  backdrop-blur
  outline-none
  transition
  focus:border-ckOrange
  focus:ring-4 focus:ring-ckOrange/20
"

        />
        <button
          disabled={!zipOk || locLoading}
          onClick={async () => {
            setSubmittedZip(zip);
            gaEvent("zip_submit", { zip });
            try { localStorage.setItem("ck_zip", zip);
              window.dispatchEvent(new Event("ck_zip_updated"));
            } catch {}
            await lookupZip(zip);
          }}
          className="
  rounded-2xl
  bg-gradient-to-r from-ckNavy to-slate-900
  px-7 py-4
  text-base font-extrabold text-white
  shadow-lg shadow-ckNavy/30
  transition
  hover:-translate-y-0.5 hover:shadow-xl
  disabled:opacity-40 disabled:hover:translate-y-0
"

        >
          {locLoading ? "조회중..." : "TOP3 보기"}
        </button>
      </div>

      {!submittedZip && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          ⏱️ 통신사마다 지역별 가능 플랜이 다를 수 있어요. Zip 입력 후 <b>TOP3 추천</b>을 확인하세요.
        </div>
      )}

      {submittedZip && (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-600">📍 지역</div>

            {loc && (loc.city || loc.state) ? (
              <div className="text-lg font-extrabold text-ckNavy">
                {loc.city ? loc.city : "—"}, {loc.state ? loc.state : "—"} ({submittedZip})
              </div>
            ) : (
              <div className="text-lg font-extrabold text-ckNavy">
                ({submittedZip})
              </div>
            )}

            {locError ? (
              <p className="mt-1 text-sm text-slate-600">{locError}</p>
            ) : (
              <p className="mt-1 text-sm text-slate-600">
                정확한 설치 가능 여부는 <b>전화 1분</b>이면 확인돼요.
              </p>
            )}

            <a
  className="
    mt-4
    inline-flex
    w-full
    items-center
    justify-center
    gap-2
    rounded-2xl
    bg-ckOrange
    px-4
    py-4
    text-base
    font-extrabold
    text-white
    shadow-lg
    ring-1 ring-black/5
    hover:brightness-95
  "
>
  📞
  <span>전화로 바로 확인하기</span>
  <span className="opacity-80 text-sm">({SUPPORT_PHONE_DISPLAY})</span>
</a>

          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {top3.map(({ role, plan }) => {
              const carrier = carriers.find((c) => c.id === plan.carrierId);
              const total12 = calc12moTotal(plan);

              return (
                <div key={plan.id} className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <Badge>{role}</Badge>
                    <div className="text-xs text-slate-500">{carrier?.name}</div>
                  </div>

                  <div className="mt-3 text-lg font-extrabold text-ckNavy">{plan.name}</div>

                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-slate-600">속도</div>
                      <div className="font-extrabold">{plan.downloadMbps}M</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-slate-600">월</div>
                      <div className="font-extrabold">${plan.promoPrice.toFixed(0)}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-slate-600">12개월</div>
                      <div className="font-extrabold">${total12.toFixed(0)}</div>
                    </div>
                  </div>

                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-bold text-ckNavy">
                      숨은 비용/위약금 보기
                    </summary>
                    <div className="mt-2 space-y-1 text-sm text-slate-700">
                      <div>프로모 종료 후 예상: <b>${plan.regularPriceEst.toFixed(2)}/월</b></div>
                      <div>장비비: <b>${plan.equipmentFee.toFixed(2)}/월</b> · 설치비: <b>${plan.installationFee.toFixed(0)}</b></div>
                      <div className="text-slate-600">{plan.hiddenFeesNoteKo}</div>
                      <div className="text-slate-600">{plan.earlyTerminationNoteKo}</div>
                    </div>
                  </details>

                  <div className="mt-4 grid gap-2">
                    <a
                      href={`tel:${SUPPORT_PHONE_TEL}`}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-ckOrange px-4 py-3 text-sm font-extrabold text-white"
                      onClick={() =>
                        gaEvent("call_click", {
                          placement: "top3_card",
                          plan_id: plan.id,
                          carrier: carrier?.name,
                          zip: submittedZip,
                        })
                      }
                    >
                      📞 이 플랜으로 상담
                    </a>

                    <button
                      onClick={() => {
                        gaEvent("plan_detail_view", { from: "top3", plan_id: plan.id, zip: submittedZip });
                        router.push(`/plan/${plan.id}?zip=${submittedZip}`);
                      }}
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-extrabold text-ckNavy"
                    >
                      플랜 자세히
                    </button>

                    <button
                      onClick={() => {
                        gaEvent("compare_click", { from: "top3", zip: submittedZip });
                        router.push(`/compare?zip=${submittedZip}`);
                      }}
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-extrabold text-ckNavy"
                    >
                      비교로 이동
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              gaEvent("compare_click", { from: "home_cta", zip: submittedZip });
              router.push(`/compare?zip=${submittedZip}`);
            }}
            className="w-full rounded-[26px] bg-ckNavy px-4 py-5 text-base font-extrabold text-white"
          >
            전체 요금제 비교하기 →
          </button>
        </div>
      )}
    </section>
  );
}
