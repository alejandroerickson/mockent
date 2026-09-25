// Seeded pseudo-random source so every tenant load produces the same records.
export class Rng {
  private s: number;
  constructor(seed: number) { this.s = seed >>> 0 || 1; }
  next(): number {
    // mulberry32
    this.s = (this.s + 0x6d2b79f5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  int(min: number, max: number): number { return min + Math.floor(this.next() * (max - min + 1)); }
  float(min: number, max: number): number { return min + this.next() * (max - min); }
  pick<T>(arr: readonly T[]): T { return arr[Math.floor(this.next() * arr.length)]; }
  chance(p: number): boolean { return this.next() < p; }
  // log-normal-ish grade around a range
  grade(range: [number, number]): number {
    const [lo, hi] = range;
    const u = this.next();
    const v = Math.pow(u, 2.2); // skew towards the low end, with a long tail
    return lo + v * (hi - lo) * (this.chance(0.08) ? 3 : 1);
  }
  shuffle<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(this.next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
}

export function pad(n: number, w: number): string { return String(n).padStart(w, '0'); }

export function addDays(iso: string, days: number): string {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00Z' : ''));
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a.slice(0, 10) + 'T00:00:00Z').getTime();
  const db = new Date(b.slice(0, 10) + 'T00:00:00Z').getTime();
  return Math.round((db - da) / 86400000);
}
