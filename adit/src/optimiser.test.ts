import { describe, it, expect } from 'vitest';
import { optimise } from './optimiser';
import { buildWorld } from './data/world';

describe('the programme optimiser', () => {
  const w = buildWorld();
  const commodityOf = (t: { projectId: string }) => w.projects.find((p) => p.id === t.projectId)!.commodity;
  it('never exceeds the budget or the rig days', () => {
    for (const budget of [1e6, 3e6, 4.5e6, 9e6]) for (const rigDays of [60, 150, 400]) {
      const r = optimise({ targets: w.targets, budget, rigDays, objective: 'ev', minPerCommodity: 0, commodityOf });
      expect(r.cost).toBeLessThanOrEqual(budget);
      expect(r.rigDaysUsed).toBeLessThanOrEqual(rigDays);
    }
  });
  it('includes a locked target when it fits', () => {
    const r = optimise({ targets: w.targets, budget: 4.5e6, rigDays: 240, objective: 'ev', minPerCommodity: 0, commodityOf });
    for (const t of w.targets.filter((x) => x.locked)) expect(r.selected).toContain(t.id);
  });
  it('gives at least the minimum per commodity when the budget allows', () => {
    const r = optimise({ targets: w.targets, budget: 9e6, rigDays: 600, objective: 'ev', minPerCommodity: 1, commodityOf });
    const got = new Set(w.targets.filter((t) => r.selected.includes(t.id)).map(commodityOf));
    expect(got.size).toBe(new Set(w.targets.map(commodityOf)).size);
  });
  it('is monotone in the budget', () => {
    let last = -1;
    for (const budget of [1e6, 2e6, 4e6, 8e6]) { const r = optimise({ targets: w.targets, budget, rigDays: 1000, objective: 'ev', minPerCommodity: 0, commodityOf }); expect(r.ev).toBeGreaterThanOrEqual(last); last = r.ev; }
  });
});
