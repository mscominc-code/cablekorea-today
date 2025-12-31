// lib/plans.ts

export type Category = "internet" | "tv" | "mobile";

export type Carrier = {
  id: string;
  name: string;
  nameKo: string;     // ✅ 추가
  brandColor: string;   // Tailwind class
  logo: string;         // 로고 이미지 경로
  logoText: string;     // 임시 텍스트 로고
};

export type Plan = {
  id: string;
  carrierId: string;
  category: Category;
  name: string;
  downloadMbps: number;
  uploadMbps?: number;
  promoPrice: number;
  promoMonths: number;
  regularPriceEst: number;
  contractMonths: 0 | 12 | 24;
  equipmentFee: number;
  installationFee: number;
  hiddenFeesNoteKo: string;
  earlyTerminationNoteKo: string;
  tags?: string[];
};

/* ================= Carriers ================= */

export const carriers: Carrier[] = [
  {
    id: "att",
    name: "AT&T",
    nameKo: "에이티앤티",
    brandColor: "bg-sky-50",
    logo: "/logos/att.png",
    logoText: "AT&T",
  },
  {
    id: "spectrum",
    name: "Spectrum",
    nameKo: "스펙트럼",
    brandColor: "bg-indigo-50",
    logo: "/logos/spectrum.png",
    logoText: "Spectrum",
  },
  {
    id: "frontier",
    name: "Frontier",
    nameKo: "프론티어",
    brandColor: "bg-emerald-50",
    logo: "/logos/frontier.png",
    logoText: "Frontier",
  },
];

/* ================= Plans ================= */

export const plans: Plan[] = [
  /* ===== AT&T ===== */
  {
    id: "att-300",
    carrierId: "att",
    category: "internet",
    name: "Fiber 300",
    downloadMbps: 300,
    uploadMbps: 300,
    promoPrice: 55,
    promoMonths: 12,
    regularPriceEst: 69.99,
    contractMonths: 0,
    equipmentFee: 0,
    installationFee: 0,
    hiddenFeesNoteKo: "세금 및 수수료는 지역에 따라 달라질 수 있어요.",
    earlyTerminationNoteKo: "무약정",
    tags: ["가성비"],
  },
  {
    id: "att-500",
    carrierId: "att",
    category: "internet",
    name: "Fiber 500",
    downloadMbps: 500,
    uploadMbps: 500,
    promoPrice: 65,
    promoMonths: 0,
    regularPriceEst: 84.99,
    contractMonths: 12,
    equipmentFee: 0,
    installationFee: 0,
    hiddenFeesNoteKo: "프로모션 종료 후 요금 인상 가능",
    earlyTerminationNoteKo: "무약정",
  },
  {
    id: "att-1000",
    carrierId: "att",
    category: "internet",
    name: "Fiber 1 Gig",
    downloadMbps: 1000,
    uploadMbps: 1000,
    promoPrice: 55,
    promoMonths: 12,
    regularPriceEst: 99.99,
    contractMonths: 0,
    equipmentFee: 0,
    installationFee: 0,
    hiddenFeesNoteKo: "세금/수수료 별도",
    earlyTerminationNoteKo: "무약정",
    tags: ["초고속"],
  },

  /* ===== Spectrum ===== */
  {
    id: "spectrum-100",
    carrierId: "spectrum",
    category: "internet",
    name: "Internet 100",
    downloadMbps: 100,
    uploadMbps: 10,
    promoPrice: 30,
    promoMonths: 12,
    regularPriceEst: 59.99,
    contractMonths: 0,
    equipmentFee: 10,
    installationFee: 0,
    hiddenFeesNoteKo: "라우터 임대료가 포함될 수 있어요.",
    earlyTerminationNoteKo: "무약정 및 장비 반납 필요",
    tags: ["저가"],
  },
  {
    id: "spectrum-500",
    carrierId: "spectrum",
    category: "internet",
    name: "Internet 500",
    downloadMbps: 500,
    uploadMbps: 20,
    promoPrice: 50,
    promoMonths: 12,
    regularPriceEst: 84.99,
    contractMonths: 0,
    equipmentFee: 10,
    installationFee: 0,
    hiddenFeesNoteKo: "장비 임대료 별도 부과 가능",
    earlyTerminationNoteKo: "무약정 및 장비 반납 필요",
    tags: ["인기"],
  },
  {
    id: "spectrum-1000",
    carrierId: "spectrum",
    category: "internet",
    name: "Internet Gig",
    downloadMbps: 1000,
    uploadMbps: 35,
    promoPrice: 70,
    promoMonths: 12,
    regularPriceEst: 104.99,
    contractMonths: 0,
    equipmentFee: 10,
    installationFee: 0,
    hiddenFeesNoteKo: "세금/장비비 별도",
    earlyTerminationNoteKo: "무약정 및 장비 반납 필요",
    tags: ["초고속"],
  },

  /* ===== Frontier ===== */
  {
    id: "frontier-500",
    carrierId: "frontier",
    category: "internet",
    name: "Fiber 500",
    downloadMbps: 500,
    uploadMbps: 500,
    promoPrice: 29.99,
    promoMonths: 12,
    regularPriceEst: 69.99,
    contractMonths: 0,
    equipmentFee: 0,
    installationFee: 0,
    hiddenFeesNoteKo: "설치비/세금은 지역별로 다를 수 있어요.",
    earlyTerminationNoteKo: "무약정",
    tags: ["가성비"],
  },
  {
    id: "frontier-1000",
    carrierId: "frontier",
    category: "internet",
    name: "Fiber 1 Gig",
    downloadMbps: 1000,
    uploadMbps: 1000,
    promoPrice: 49.99,
    promoMonths: 12,
    regularPriceEst: 89.99,
    contractMonths: 0,
    equipmentFee: 0,
    installationFee: 0,
    hiddenFeesNoteKo: "지역별 요금 상이",
    earlyTerminationNoteKo: "무약정",
  },
  {
    id: "frontier-2000",
    carrierId: "frontier",
    category: "internet",
    name: "Fiber 2 Gig",
    downloadMbps: 2000,
    uploadMbps: 2000,
    promoPrice: 64.99,
    promoMonths: 0,
    regularPriceEst: 129.99,
    contractMonths: 0,
    equipmentFee: 0,
    installationFee: 0,
    hiddenFeesNoteKo: "고속 플랜으로 지역 제한 가능",
    earlyTerminationNoteKo: "무약정",
    tags: ["최고속"],
  },
];
