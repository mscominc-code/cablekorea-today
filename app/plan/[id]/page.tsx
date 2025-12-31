import { carriers, plans } from "@/lib/plans";
import { calc12moTotal } from "@/lib/recommend";
import StickyCallBar from "@/components/StickyCallBar";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from "@/lib/utils";

export default async function PlanDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: { zip?: string };
}) {
  // ✅ Next 16 핵심 포인트
  const { id } = await params;

  const plan = plans.find((p) => p.id === id);

  if (!plan) {
    return (
      <div className="p-6 text-slate-600">
        플랜을 찾을 수 없습니다. (ID: {id})
      </div>
    );
  }

  const carrier = carriers.find((c) => c.id === plan.carrierId);
  const total12 = calc12moTotal(plan);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-6">
      <a
        className="text-sm text-slate-600 hover:underline"
        href={`/compare${searchParams.zip ? `?zip=${searchParams.zip}` : ""}`}
      >
        ← 비교로 돌아가기
      </a>

      <div className="mt-4 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="text-sm text-slate-500">{carrier?.name}</div>
        <h1 className="text-2xl font-extrabold text-ckNavy">{plan.name}</h1>

        <div className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-4 text-sm">
          <div className="flex justify-between">
            <span>프로모 월 요금</span>
            <b>${plan.promoPrice.toFixed(2)} ({plan.promoMonths}개월)</b>
          </div>
          <div className="flex justify-between">
            <span>프로모 종료 후</span>
            <b>${plan.regularPriceEst.toFixed(2)}/월</b>
          </div>
          <div className="flex justify-between">
            <span>장비비</span>
            <b>${plan.equipmentFee.toFixed(2)}/월</b>
          </div>
          <div className="flex justify-between">
            <span>설치비</span>
            <b>${plan.installationFee.toFixed(0)}</b>
          </div>
          <div className="flex justify-between">
            <span>12개월 총액</span>
            <b>${total12.toFixed(0)}</b>
          </div>
        </div>

        <div className="mt-4 space-y-1 text-sm text-slate-700">
          <div>
            <b>속도:</b> {plan.downloadMbps} Mbps
            {plan.uploadMbps ? ` / 업 ${plan.uploadMbps} Mbps` : ""}
          </div>
          <div>
            <b>약정:</b>{" "}
            {plan.contractMonths === 0 ? "무약정" : `${plan.contractMonths}개월`}
          </div>
          <div className="text-slate-600">{plan.hiddenFeesNoteKo}</div>
          <div className="text-slate-600">{plan.earlyTerminationNoteKo}</div>
        </div>

        <a
          href={`tel:${SUPPORT_PHONE_TEL}`}
          className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-ckOrange px-4 py-4 text-sm font-extrabold text-slate-500"
        >
          📞 이 플랜으로 지금 상담하기 ({SUPPORT_PHONE_DISPLAY})
        </a>
      </div>

      <StickyCallBar />
    </main>
  );
}
