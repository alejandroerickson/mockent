// Formatting helpers. Figures are mono and tabular in the stylesheet; these only make the strings.
const nf = (locale: string, opts: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, opts);
let locale = 'en-CA';
export function setLocale(l: string) { locale = l; }

export function money(n: number | undefined | null, opts: { compact?: boolean; sign?: boolean } = {}): string {
  if (n === undefined || n === null || Number.isNaN(n)) return '—';
  const abs = Math.abs(n);
  let s: string;
  if (opts.compact && abs >= 1e9) s = nf(locale, { maximumFractionDigits: 2 }).format(abs / 1e9) + ' B';
  else if (opts.compact && abs >= 1e6) s = nf(locale, { maximumFractionDigits: 2 }).format(abs / 1e6) + ' M';
  else if (opts.compact && abs >= 1e3) s = nf(locale, { maximumFractionDigits: 0 }).format(abs / 1e3) + ' k';
  else s = nf(locale, { maximumFractionDigits: 0 }).format(abs);
  const sign = n < 0 ? '−' : opts.sign ? '+' : '';
  return sign + s;
}
export function num(n: number | undefined | null, d = 0): string {
  if (n === undefined || n === null || Number.isNaN(n)) return '—';
  return nf(locale, { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
}
export function pct(n: number | undefined | null, d = 0): string {
  if (n === undefined || n === null || Number.isNaN(n)) return '—';
  return nf(locale, { minimumFractionDigits: d, maximumFractionDigits: d }).format(n) + ' %';
}
export function grade(n: number | null | undefined, d = 2): string {
  if (n === null || n === undefined) return '—';
  return nf(locale, { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
}
export function metres(n: number | undefined | null): string { return n === undefined || n === null ? '—' : num(n) + ' m'; }
export function date(iso: string | undefined | null, fmt: 'ISO' | 'DMY' | 'MDY' = 'ISO'): string {
  if (!iso) return '—';
  const d = iso.slice(0, 10);
  if (fmt === 'ISO') return d;
  const [y, m, dd] = d.split('-');
  return fmt === 'DMY' ? `${dd}/${m}/${y}` : `${m}/${dd}/${y}`;
}
export function datetime(iso: string | undefined | null): string {
  if (!iso) return '—';
  return iso.slice(0, 10) + ' ' + iso.slice(11, 16) + ' UTC';
}
export function relDays(iso: string, today: string): string {
  const a = new Date(iso.slice(0, 10) + 'T00:00:00Z').getTime();
  const b = new Date(today + 'T00:00:00Z').getTime();
  const d = Math.round((a - b) / 86400000);
  if (d === 0) return 'today';
  if (d === 1) return 'tomorrow';
  if (d === -1) return 'yesterday';
  return d > 0 ? `in ${d} days` : `${-d} days ago`;
}
export function count(n: number, noun: string, plural?: string): string { return `${num(n)} ${n === 1 ? noun : (plural ?? noun + 's')}`; }
export function titleCase(s: string): string { return s.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()); }
export function initials(name: string): string { return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase(); }
