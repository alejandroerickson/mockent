// SVG charts drawn from data. Every value is also in a table beneath (details.values).
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface Series { name: string; cat: number; values: number[] }

function ticks(max: number, n = 4): number[] {
  if (max <= 0) return [0];
  const raw = max / n;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? mag;
  const out: number[] = [];
  for (let v = 0; v <= max + step * 0.001; v += step) out.push(+v.toFixed(6));
  if (out[out.length - 1] < max) out.push(+(out[out.length - 1] + step).toFixed(6));
  return out;
}

export function ValuesTable({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <details className="values">
      <summary>Values behind this chart</summary>
      <div className="tbl-wrap"><table className="tbl tbl--compact"><thead><tr>{head.map((h, i) => <th key={i} scope="col" className={i > 0 ? 'num' : undefined}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j > 0 ? 'num' : undefined}>{c}</td>)}</tr>)}</tbody></table></div>
    </details>
  );
}

export function Legend({ items }: { items: { label: string; cat?: number; hollow?: boolean; ink?: boolean }[] }) {
  return <ul className="legend" aria-label="Legend">{items.map((it, i) => <li key={i}><span className={`sw ${it.hollow ? 'hollow' : it.ink ? '' : `cat-${it.cat ?? 7}`}`} style={it.ink ? { background: 'var(--ink)' } : undefined} aria-hidden="true" />{it.label}</li>)}</ul>;
}

/** Grouped or stacked columns. */
export function Columns({ title, unit, labels, series, stacked, width = 640, height = 220, fmt = (v) => v.toLocaleString('en-CA'), plan, hrefs }: { title: string; unit?: string; labels: string[]; series: Series[]; stacked?: boolean; width?: number; height?: number; fmt?: (v: number) => string; plan?: number[]; hrefs?: string[] }) {
  const padL = 56, padR = 12, padT = 12, padB = 28;
  const w = width - padL - padR, h = height - padT - padB;
  const totals = labels.map((_, i) => (stacked ? series.reduce((s, x) => s + x.values[i], 0) : Math.max(...series.map((x) => x.values[i]))));
  const max = Math.max(...totals, ...(plan ?? [0]), 1);
  const tk = ticks(max);
  const top = tk[tk.length - 1] || max;
  const y = (v: number) => padT + h - (v / top) * h;
  const gw = w / labels.length;
  const bw = stacked ? Math.min(40, gw * 0.6) : Math.min(28, (gw * 0.7) / series.length);
  return (
    <figure className="chart" style={{ margin: 0 }}>
      <figcaption className="chart-t"><span>{title}{unit ? <span className="u"> · {unit}</span> : null}</span></figcaption>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}${unit ? ', ' + unit : ''}`}>
        {tk.map((t) => <g key={t}><line className="grid-l" x1={padL} x2={width - padR} y1={y(t)} y2={y(t)} /><text className="mono" x={padL - 6} y={y(t) + 4} textAnchor="end">{fmt(t)}</text></g>)}
        <line className="ax-ink" x1={padL} x2={width - padR} y1={y(0)} y2={y(0)} />
        {labels.map((l, i) => {
          const cx = padL + gw * i + gw / 2;
          let acc = 0;
          const bars = series.map((s, si) => {
            const v = s.values[i];
            if (stacked) { const y0 = y(acc), y1 = y(acc + v); acc += v; return <rect key={si} x={cx - bw / 2} y={y1} width={bw} height={Math.max(0, y0 - y1)} className={`cat-${s.cat}`} style={{ fill: `var(--cat-${s.cat})` }}><title>{`${l}, ${s.name}: ${fmt(v)}`}</title></rect>; }
            const x = cx - (series.length * bw) / 2 + si * bw;
            return <rect key={si} x={x} y={y(v)} width={bw - 2} height={Math.max(0, y(0) - y(v))} style={{ fill: `var(--cat-${s.cat})` }}><title>{`${l}, ${s.name}: ${fmt(v)}`}</title></rect>;
          });
          const body = <g>{bars}{plan ? <line className="proj" x1={cx - gw * 0.4} x2={cx + gw * 0.4} y1={y(plan[i])} y2={y(plan[i])} /> : null}<text x={cx} y={height - 8} textAnchor="middle">{l}</text></g>;
          return hrefs?.[i] ? <Link key={i} to={hrefs[i]} aria-label={`${l}: ${fmt(totals[i])}`}>{body}</Link> : <g key={i}>{body}</g>;
        })}
      </svg>
      <Legend items={[...series.map((s) => ({ label: s.name, cat: s.cat })), ...(plan ? [{ label: 'Plan', hollow: true }] : [])]} />
      <ValuesTable head={[unit ? `Period` : '', ...series.map((s) => s.name), ...(stacked ? ['Total'] : []), ...(plan ? ['Plan'] : [])]} rows={labels.map((l, i) => [l, ...series.map((s) => fmt(s.values[i])), ...(stacked ? [fmt(totals[i])] : []), ...(plan ? [fmt(plan[i])] : [])])} />
    </figure>
  );
}

/** Horizontal bars, one per category, optionally marked as current. */
export function Bars({ title, unit, rows, width = 640, fmt = (v) => v.toLocaleString('en-CA'), cat }: { title: string; unit?: string; rows: { label: string; value: number; cat?: number; href?: string; sub?: string }[]; width?: number; fmt?: (v: number) => string; cat?: number }) {
  const rowH = 22, padL = 150, padR = 70, padT = 4;
  const height = padT + rows.length * rowH + 4;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const w = width - padL - padR;
  return (
    <figure className="chart" style={{ margin: 0 }}>
      <figcaption className="chart-t"><span>{title}{unit ? <span className="u"> · {unit}</span> : null}</span></figcaption>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        {rows.map((r, i) => {
          const y = padT + i * rowH;
          const bw = (r.value / max) * w;
          const g = <g><text x={padL - 8} y={y + 15} textAnchor="end" className="lbl-ink">{r.label}</text><rect x={padL} y={y + 4} width={Math.max(1, bw)} height={14} style={{ fill: `var(--cat-${r.cat ?? cat ?? 7})` }} /><text className="mono" x={padL + bw + 6} y={y + 15}>{fmt(r.value)}</text></g>;
          return r.href ? <Link key={i} to={r.href} aria-label={`${r.label}: ${fmt(r.value)}`}>{g}</Link> : <g key={i}>{g}</g>;
        })}
        <line className="ax-ink" x1={padL} x2={padL} y1={padT} y2={height - 4} />
      </svg>
      <ValuesTable head={['', unit ?? 'Value']} rows={rows.map((r) => [r.label, fmt(r.value)])} />
    </figure>
  );
}

/** Line chart with one or more series; plan may be dashed. */
export function Lines({ title, unit, labels, series, width = 640, height = 220, fmt = (v) => v.toLocaleString('en-CA'), dashed }: { title: string; unit?: string; labels: string[]; series: Series[]; width?: number; height?: number; fmt?: (v: number) => string; dashed?: number[] }) {
  const padL = 56, padR = 12, padT = 12, padB = 28;
  const w = width - padL - padR, h = height - padT - padB;
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  const tk = ticks(max);
  const top = tk[tk.length - 1] || max;
  const y = (v: number) => padT + h - (v / top) * h;
  const x = (i: number) => padL + (labels.length === 1 ? w / 2 : (i / (labels.length - 1)) * w);
  return (
    <figure className="chart" style={{ margin: 0 }}>
      <figcaption className="chart-t"><span>{title}{unit ? <span className="u"> · {unit}</span> : null}</span></figcaption>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        {tk.map((t) => <g key={t}><line className="grid-l" x1={padL} x2={width - padR} y1={y(t)} y2={y(t)} /><text className="mono" x={padL - 6} y={y(t) + 4} textAnchor="end">{fmt(t)}</text></g>)}
        <line className="ax-ink" x1={padL} x2={width - padR} y1={y(0)} y2={y(0)} />
        {series.map((s, si) => <polyline key={si} points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} fill="none" stroke={`var(--cat-${s.cat})`} strokeWidth={1.75} strokeDasharray={dashed?.includes(si) ? '4 3' : undefined} />)}
        {series.map((s, si) => s.values.map((v, i) => <circle key={`${si}-${i}`} cx={x(i)} cy={y(v)} r={2.5} fill={dashed?.includes(si) ? 'var(--ground)' : `var(--cat-${s.cat})`} stroke={`var(--cat-${s.cat})`}><title>{`${labels[i]}, ${s.name}: ${fmt(v)}`}</title></circle>))}
        {labels.map((l, i) => <text key={i} x={x(i)} y={height - 8} textAnchor="middle">{l}</text>)}
      </svg>
      <Legend items={series.map((s, i) => ({ label: s.name, cat: s.cat, hollow: dashed?.includes(i) }))} />
      <ValuesTable head={['', ...series.map((s) => s.name)]} rows={labels.map((l, i) => [l, ...series.map((s) => fmt(s.values[i]))])} />
    </figure>
  );
}

/** Scatter: x and y numeric; marks are links. */
export function Scatter({ title, xLabel, yLabel, points, width = 640, height = 260, fx = (v) => v.toLocaleString('en-CA'), fy = (v) => v.toLocaleString('en-CA'), legend }: { title: string; xLabel: string; yLabel: string; points: { x: number; y: number; label: string; cat: number; href?: string; r?: number; hollow?: boolean }[]; width?: number; height?: number; fx?: (v: number) => string; fy?: (v: number) => string; legend: { label: string; cat?: number; hollow?: boolean }[] }) {
  const padL = 56, padR = 16, padT = 12, padB = 36;
  const w = width - padL - padR, h = height - padT - padB;
  const maxX = Math.max(...points.map((p) => p.x), 1), maxY = Math.max(...points.map((p) => p.y), 1);
  const tx = ticks(maxX), ty = ticks(maxY);
  const topX = tx[tx.length - 1] || maxX, topY = ty[ty.length - 1] || maxY;
  const x = (v: number) => padL + (v / topX) * w;
  const y = (v: number) => padT + h - (v / topY) * h;
  return (
    <figure className="chart" style={{ margin: 0 }}>
      <figcaption className="chart-t"><span>{title}</span></figcaption>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        {ty.map((t) => <g key={'y' + t}><line className="grid-l" x1={padL} x2={width - padR} y1={y(t)} y2={y(t)} /><text className="mono" x={padL - 6} y={y(t) + 4} textAnchor="end">{fy(t)}</text></g>)}
        {tx.map((t) => <text key={'x' + t} className="mono" x={x(t)} y={height - 18} textAnchor="middle">{fx(t)}</text>)}
        <line className="ax-ink" x1={padL} x2={width - padR} y1={y(0)} y2={y(0)} /><line className="ax-ink" x1={padL} x2={padL} y1={padT} y2={y(0)} />
        <text x={width - padR} y={height - 4} textAnchor="end">{xLabel}</text>
        <text x={padL + 4} y={padT + 4} className="lbl-ink" fontSize={12}>{yLabel}</text>
        {points.map((p, i) => { const c = <circle cx={x(p.x)} cy={y(p.y)} r={p.r ?? 5} fill={p.hollow ? 'var(--ground)' : `var(--cat-${p.cat})`} stroke={`var(--cat-${p.cat})`} strokeWidth={1.5}><title>{`${p.label}: ${fx(p.x)}, ${fy(p.y)}`}</title></circle>; return p.href ? <Link key={i} to={p.href} aria-label={`${p.label}: ${xLabel} ${fx(p.x)}, ${yLabel} ${fy(p.y)}`}>{c}</Link> : <g key={i}>{c}</g>; })}
      </svg>
      <Legend items={legend} />
      <ValuesTable head={['', xLabel, yLabel]} rows={points.map((p) => [p.href ? <Link to={p.href}>{p.label}</Link> : p.label, fx(p.x), fy(p.y)])} />
    </figure>
  );
}

/** A split list: shares of a whole. */
export function Split({ parts, fmt = (v) => v.toLocaleString('en-CA') }: { parts: { label: string; value: number; cat?: number; ink?: boolean; hollow?: boolean }[]; fmt?: (v: number) => string }) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const bg = (p: typeof parts[number]) => (p.hollow ? 'transparent' : p.ink ? 'var(--ink)' : `var(--cat-${p.cat ?? 7})`);
  return (
    <ul className="split">
      <li className="rule" aria-hidden="true" style={{ display: 'flex' }}>{parts.map((p, i) => <i key={i} style={{ width: `${(p.value / total) * 100}%`, background: bg(p), border: p.hollow ? '1px solid var(--muted)' : undefined }} />)}</li>
      {parts.map((p, i) => <li key={i}><span className="sw" style={{ background: bg(p), border: p.hollow ? '1px solid var(--muted)' : undefined }} aria-hidden="true" />{p.label}<span className="q">{fmt(p.value)}</span><span className="p">{Math.round((p.value / total) * 100)} %</span></li>)}
    </ul>
  );
}
