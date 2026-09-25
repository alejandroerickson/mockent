import { describe, it, expect } from 'vitest';
import { buildWorld, COMMODITY } from './world';

describe('the demonstration tenant', () => {
  const w = buildWorld();
  it('is the same on every build', () => {
    const w2 = buildWorld();
    expect(w2.holes.map((h) => h.id + h.depth)).toEqual(w.holes.map((h) => h.id + h.depth));
    expect(w2.samples.length).toBe(w.samples.length);
  });
  it('keeps every record chain intact', () => {
    const projectIds = new Set(w.projects.map((p) => p.id));
    const programmeIds = new Set(w.programmes.map((p) => p.id));
    const holeIds = new Set(w.holes.map((h) => h.id));
    const batchIds = new Set(w.batches.map((b) => b.id));
    for (const t of w.tenements) expect(projectIds.has(t.projectId)).toBe(true);
    for (const p of w.programmes) expect(projectIds.has(p.projectId)).toBe(true);
    for (const h of w.holes) { expect(projectIds.has(h.projectId)).toBe(true); expect(programmeIds.has(h.programmeId)).toBe(true); }
    for (const b of w.batches) for (const hid of b.holeIds) expect(holeIds.has(hid)).toBe(true);
    for (const s of w.samples) { expect(holeIds.has(s.holeId)).toBe(true); expect(batchIds.has(s.batchId)).toBe(true); }
    for (const a of w.approvals) expect(projectIds.has(a.projectId)).toBe(true);
    for (const e of w.estimates) expect(projectIds.has(e.projectId)).toBe(true);
  });
  it('has unique ids', () => {
    for (const list of [w.projects, w.programmes, w.holes, w.batches, w.samples, w.approvals, w.estimates, w.notifications, w.audit]) {
      const ids = (list as { id: string }[]).map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
  it('grades an intercept at or above its cut-off', () => {
    for (const i of w.intercepts) { expect(i.grade).toBeGreaterThanOrEqual(i.cutoff); expect(i.to).toBeGreaterThan(i.from); }
  });
  it('counts batch samples from the sample table', () => {
    for (const b of w.batches.slice(0, 20)) expect(w.samples.filter((s) => s.batchId === b.id).length).toBe(b.sampleCount);
  });
  it('holds a pending step for every active role that has work', () => {
    const pending = w.approvals.filter((a) => a.status === 'pending');
    expect(pending.length).toBeGreaterThan(5);
    for (const a of pending) expect(a.steps[a.currentStep].decision).toBeUndefined();
  });
  it('contains metal consistently with tonnes and grade', () => {
    for (const e of w.estimates) for (const b of e.blocks) {
      const c = COMMODITY[w.projects.find((p) => p.id === e.projectId)!.commodity];
      expect(Math.abs(b.contained - c.contained(b.tonnes, b.grade))).toBeLessThan(1);
    }
  });
});
