// Programme optimiser: selects candidate drill targets under a budget and rig-day cap.
// A greedy ratio pass followed by a swap improvement. Deterministic for a given input.
import type { OptimiserTarget, CommodityCode } from './data/types';

export interface OptInput { targets: OptimiserTarget[]; budget: number; rigDays: number; objective: 'ev' | 'metres' | 'psuccess'; minPerCommodity: number; commodityOf: (t: OptimiserTarget) => CommodityCode }
export interface OptResult { selected: string[]; ev: number; cost: number; rigDaysUsed: number; metres: number; rejected: { id: string; reason: string }[] }

export function score(t: OptimiserTarget, objective: OptInput['objective']): number {
  if (objective === 'ev') return t.pSuccess * t.expectedValue;
  if (objective === 'metres') return t.metres;
  return t.pSuccess * 1e6;
}

export function optimise(input: OptInput): OptResult {
  const { targets, budget, rigDays, objective, minPerCommodity } = input;
  const sel = new Set<string>();
  let cost = 0, days = 0;
  const rejected: OptResult['rejected'] = [];
  const fits = (t: OptimiserTarget) => cost + t.cost <= budget && days + t.rigDays <= rigDays;
  // locked targets first
  for (const t of targets.filter((x) => x.locked)) {
    if (fits(t)) { sel.add(t.id); cost += t.cost; days += t.rigDays; } else rejected.push({ id: t.id, reason: 'locked, but does not fit the budget or rig days' });
  }
  // minimum per commodity: best-ratio target of each commodity that has fewer than the minimum
  const byCommodity = new Map<CommodityCode, OptimiserTarget[]>();
  for (const t of targets) { const c = input.commodityOf(t); if (!byCommodity.has(c)) byCommodity.set(c, []); byCommodity.get(c)!.push(t); }
  for (const [, ts] of byCommodity) {
    const have = ts.filter((t) => sel.has(t.id)).length;
    const cands = ts.filter((t) => !sel.has(t.id)).sort((a, b) => score(b, objective) / b.cost - score(a, objective) / a.cost);
    for (let i = have; i < minPerCommodity && cands.length; i++) { const t = cands.shift()!; if (fits(t)) { sel.add(t.id); cost += t.cost; days += t.rigDays; } }
  }
  // greedy by ratio
  const rest = targets.filter((t) => !sel.has(t.id)).sort((a, b) => score(b, objective) / b.cost - score(a, objective) / a.cost);
  for (const t of rest) { if (fits(t)) { sel.add(t.id); cost += t.cost; days += t.rigDays; } else rejected.push({ id: t.id, reason: cost + t.cost > budget ? 'budget exhausted' : 'rig days exhausted' }); }
  // one swap pass: replace a selected unlocked target with an unselected one if it improves the objective and still fits
  let improved = true;
  while (improved) {
    improved = false;
    for (const out of targets.filter((t) => sel.has(t.id) && !t.locked)) {
      for (const inn of targets.filter((t) => !sel.has(t.id))) {
        const c2 = cost - out.cost + inn.cost, d2 = days - out.rigDays + inn.rigDays;
        if (c2 <= budget && d2 <= rigDays && score(inn, objective) > score(out, objective)) { sel.delete(out.id); sel.add(inn.id); cost = c2; days = d2; improved = true; break; }
      }
      if (improved) break;
    }
  }
  const chosen = targets.filter((t) => sel.has(t.id));
  return { selected: chosen.map((t) => t.id), ev: chosen.reduce((s, t) => s + t.pSuccess * t.expectedValue, 0), cost, rigDaysUsed: days, metres: chosen.reduce((s, t) => s + t.metres, 0), rejected: rejected.filter((r) => !sel.has(r.id)) };
}
