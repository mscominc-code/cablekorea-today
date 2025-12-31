import { Plan } from "./plans";

export function calc12moTotal(p: Plan) {
  const promoTotal = p.promoPrice * Math.min(12, p.promoMonths);
  const afterMonths = Math.max(0, 12 - p.promoMonths);
  const afterTotal = p.regularPriceEst * afterMonths;
  const equipTotal = p.equipmentFee * 12;
  return promoTotal + afterTotal + equipTotal + p.installationFee;
}

function normalize(value: number, min: number, max: number) {
  if (max === min) return 1;
  return (value - min) / (max - min);
}

export function pickTop3(plans: Plan[]) {
  const internetPlans = plans.filter(p => p.category === "internet");
  if (internetPlans.length === 0) return [];

  const speeds = internetPlans.map(p => p.downloadMbps);
  const totals = internetPlans.map(p => calc12moTotal(p));

  const minSpeed = Math.min(...speeds);
  const maxSpeed = Math.max(...speeds);
  const minTotal = Math.min(...totals);
  const maxTotal = Math.max(...totals);

  const scored = internetPlans.map(p => {
    const speedScore = normalize(p.downloadMbps, minSpeed, maxSpeed);
    const priceScore = 1 - normalize(calc12moTotal(p), minTotal, maxTotal);
    const contractScore = p.contractMonths === 0 ? 1 : p.contractMonths === 12 ? 0.7 : 0.4;
    const trustScore = 0.7; // MVP: fixed. later -> data-driven

    const score = speedScore * 0.3 + priceScore * 0.3 + contractScore * 0.2 + trustScore * 0.2;
    return { plan: p, score };
  });

  const recommended = [...scored].sort((a,b) => b.score - a.score)[0]?.plan;
  const bestValue = [...internetPlans].sort((a,b) => calc12moTotal(a) - calc12moTotal(b))[0];
  const fastest = [...internetPlans].sort((a,b) => b.downloadMbps - a.downloadMbps)[0];

  const result: { role: "추천 1" | "가성비" | "최고속"; plan: Plan }[] = [];
  const used = new Set<string>();

  if (recommended) { result.push({ role: "추천 1", plan: recommended }); used.add(recommended.id); }
  if (bestValue && !used.has(bestValue.id)) { result.push({ role: "가성비", plan: bestValue }); used.add(bestValue.id); }
  if (fastest && !used.has(fastest.id)) { result.push({ role: "최고속", plan: fastest }); used.add(fastest.id); }

  for (const s of [...scored].sort((a,b)=>b.score-a.score)) {
    if (result.length >= 3) break;
    if (!used.has(s.plan.id)) {
      result.push({ role: "추천 1", plan: s.plan });
      used.add(s.plan.id);
    }
  }
  return result.slice(0,3);
}
