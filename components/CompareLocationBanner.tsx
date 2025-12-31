"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from "@/lib/utils";
import { gaEvent } from "@/lib/ga";

type ZipLookup = { zip: string; city: string | null; state: string | null; error?: string };

export default function CompareLocationBanner() {
  const sp = useSearchParams();
  const router = useRouter();

  const zip = (sp.get("zip") ?? "").trim();
  const [zipInput, setZipInput] = useState(zip);

  const [loc, setLoc] = useState<ZipLookup | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const zipOk = useMemo(() => /^\d{5}$/.test(zipInput), [zipInput]);

  useEffect(() => {
    setZipInput(zip);
  }, [zip]);

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!/^\d{5}$/.test(zip)) {
        setLoc(null);
        setMsg("Zip Code를 입력하면 우리 동네 가능한 요금제를 정확히 비교할 수 있어요.");
        return;
      }

      setLoading(true);
      setMsg(null);
      try {
        const res = await fetch(`/api/zip/${zip}`);
        const data = (await res.json()) as ZipLookup;

        if (!alive) return;

        if (!res.ok || data.error) {
          setLoc({ zip, city: null, state: null });
          setMsg("해당 Zip의 City/State 정보를 찾을 수 없어요. (전화로 1분 내 확인 가능)");
          return;
        }

        setLoc({ zip, city: data.city ?? null, state: data.state ?? null });
      } catch {
        if (!alive) return;
        setLoc({ zip, city: null, state: null });
        setMsg("Zip 조회 중 오류가 발생했어요. (전화로 1분 내 확인 가능)");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [zip]);

  const applyZip = () => {
    const z = zipInput.trim();
    if (!/^\d{5}$/.test(z)) return;
    try {
      localStorage.setItem("ck_zip", z);
      window.dispatchEvent(new Event("ck_zip_updated"));
    } catch {}
    gaEvent("zip_submit", { zip: z, from: "compare_banner" });
    router.push(`/compare?zip=${z}`);
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="text-sm text-slate-600">📍 지역</div>

          {loading ? (
            <div className="text-lg font-extrabold text-ckNavy">조회중...</div>
          ) : loc?.zip ? (
            <div className="text-lg font-extrabold text-ckNavy">
              {loc.city ? loc.city : "—"}, {loc.state ? loc.state : "—"} ({loc.zip})
            </div>
          ) : (
            <div className="text-lg font-extrabold text-ckNavy">(Zip 미입력)</div>
          )}

          {msg && <p className="mt-1 text-sm text-slate-600">{msg}</p>}
          {!msg && (
            <p className="mt-1 text-sm text-slate-600">
              정확한 설치 가능 여부는 <b>전화 1분</b>이면 확인돼요.
            </p>
          )}

          {/* Zip 수정 */}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value.trim())}
              inputMode="numeric"
              maxLength={5}
              placeholder="Zip Code 5자리"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-ckOrange sm:w-56"
            />
            <button
              onClick={applyZip}
              disabled={!zipOk}
              className="rounded-2xl bg-ckNavy px-5 py-3 text-sm font-extrabold text-slate-600 disabled:opacity-40"
            >
              적용
            </button>
          </div>
        </div>

       <a
  href={`tel:${SUPPORT_PHONE_TEL}`}
  onClick={() => gaEvent("call_click", { placement: "compare_banner", zip })}
  className="
    relative
    inline-flex
    w-full
    items-center
    justify-center
    rounded-2xl
    bg-ckOrange
    px-4
    py-4
    shadow-lg
    md:w-auto
  "
>
  <span className="text-slate-500 font-extrabold">
  📞 지금 전화로 상담 ({SUPPORT_PHONE_DISPLAY})
</span>
</a>


      </div>
    </section>
  );
}
