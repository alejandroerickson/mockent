import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useStore, useMe, can } from '../store';
import { COMMODITY, COMMODITIES } from '../data/world';
import { num, date, metres as fmtM, grade, count } from '../data/fmt';
import { Chip, PageHead, Slot, Authority, DataTable, Dialog, Comments, type Col } from '../ui/primitives';
import { Columns, Scatter } from '../ui/charts';
import type { Drillhole, Intercept, Sample } from '../data/types';
import { HoleTable } from './Projects';
import { PERSON } from './Programmes';

export function Drilling() {
  const [sp] = useSearchParams();
  const w = useStore().state.world;
  const status = sp.get('status'), project = sp.get('project'), type = sp.get('type');
  const [q, setQ] = useState('');
  let rows = w.holes;
  if (status) rows = rows.filter((h) => h.status === status);
  if (project) rows = rows.filter((h) => h.projectId === project);
  if (type) rows = rows.filter((h) => h.type === type);
  if (q) rows = rows.filter((h) => h.id.toLowerCase().includes(q.toLowerCase()));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  return (
    <>
      <PageHead title="Drillholes" meta={<><span>{rows.length} of {w.holes.length} holes</span>{status ? <span>status: {status}</span> : null}{project ? <span>project {project}</span> : null}</>} />
      <div className="filters" role="search">
        <label className="field"><span>Hole id</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. WC-DDH-014" /></label>
        <label className="field"><span>Project</span><select value={project ?? ''} onChange={(e) => { window.location.hash = `#/drilling?${new URLSearchParams({ ...(status ? { status } : {}), ...(e.target.value ? { project: e.target.value } : {}) })}`; }}><option value="">All projects</option>{w.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label className="field"><span>Type</span><select value={type ?? ''} onChange={(e) => { window.location.hash = `#/drilling?${new URLSearchParams({ ...(status ? { status } : {}), ...(project ? { project } : {}), ...(e.target.value ? { type: e.target.value } : {}) })}`; }}><option value="">All types</option>{['DDH', 'RC', 'AC', 'Sonic'].map((t) => <option key={t}>{t}</option>)}</select></label>
        <span className="ct">{fmtM(rows.reduce((s, h) => s + h.depth, 0))} drilled{status || project || type ? <Link className="btn btn--small" to="/drilling">Clear</Link> : null}</span>
      </div>
      {!status && !project && !type && !q ? <div className="panel" style={{ marginBottom: 16 }}><Columns title="Holes completed by month" unit="holes" labels={months} series={COMMODITIES.map((c) => ({ name: c.name, cat: c.cat, values: months.map((_, i) => w.holes.filter((h) => w.projects.find((p) => p.id === h.projectId)?.commodity === c.code && h.completedOn?.startsWith(`2026-${String(i + 1).padStart(2, '0')}`)).length) }))} stacked fmt={(v) => num(v)} /></div> : null}
      <div className="panel panel--flush"><HoleTable rows={rows} /></div>
    </>
  );
}

export function Intercepts() {
  const w = useStore().state.world;
  const [commodity, setCommodity] = useState('');
  const [sigOnly, setSigOnly] = useState(true);
  let rows = w.intercepts;
  if (sigOnly) rows = rows.filter((i) => i.significant);
  if (commodity) rows = rows.filter((i) => w.projects.find((p) => p.id === i.projectId)?.commodity === commodity);
  const pts = rows.slice(0, 400).map((i) => { const p = w.projects.find((x) => x.id === i.projectId)!; const c = COMMODITY[p.commodity]; return { x: i.length, y: i.grade / c.cutoff, label: `${i.holeId} ${i.from}–${i.to} m`, cat: c.cat, href: `/drilling/${i.holeId}`, r: 4 }; });
  const cols: Col<Intercept>[] = [
    { key: 'hole', label: 'Hole', sort: (i) => i.holeId, render: (i) => <Link to={`/drilling/${i.holeId}`}><span className="mono">{i.holeId}</span></Link> },
    { key: 'project', label: 'Project', sort: (i) => i.projectId, render: (i) => <Link to={`/projects/${i.projectId}`}>{w.projects.find((p) => p.id === i.projectId)?.name}</Link> },
    { key: 'from', label: 'From', num: true, sort: (i) => i.from, render: (i) => fmtM(i.from) },
    { key: 'to', label: 'To', num: true, sort: (i) => i.to, render: (i) => fmtM(i.to) },
    { key: 'len', label: 'Length', num: true, sort: (i) => i.length, render: (i) => fmtM(i.length) },
    { key: 'grade', label: 'Grade', num: true, sort: (i) => i.grade, render: (i) => { const c = COMMODITY[w.projects.find((p) => p.id === i.projectId)!.commodity]; return <>{grade(i.grade)}<span className="unit">{c.gradeUnit} {c.gradeLabel}</span></>; } },
    { key: 'gm', label: 'Grade × length', num: true, sort: (i) => i.grade * i.length, render: (i) => num(i.grade * i.length, 1) },
    { key: 'cut', label: 'Cut-off', num: true, render: (i) => i.cutoff },
    { key: 'sig', label: 'Significant', sort: (i) => (i.significant ? 1 : 0), render: (i) => i.significant ? <Chip status="accepted">yes</Chip> : <span className="dash">no</span> },
  ];
  return (
    <>
      <PageHead title="Intercepts" meta={<><span>{rows.length} intercepts</span><span>{sigOnly ? 'significant only' : 'all above cut-off'}</span></>} />
      <div className="filters">
        <fieldset><legend>Commodity</legend><div className="pills">{COMMODITIES.map((c) => <label key={c.code}><input type="radio" name="c" checked={commodity === c.code} onChange={() => setCommodity(commodity === c.code ? '' : c.code)} onClick={() => commodity === c.code && setCommodity('')} />{c.name}</label>)}</div></fieldset>
        <label className="check" style={{ alignSelf: 'center' }}><input type="checkbox" checked={sigOnly} onChange={(e) => setSigOnly(e.target.checked)} />Significant only (≥ 1.5× cut-off over a minimum length)</label>
        <span className="ct">{rows.length} rows</span>
      </div>
      <div className="panel" style={{ marginBottom: 16 }}><Scatter title="Intercept length against grade over cut-off" xLabel="Length, m" yLabel="Grade ÷ cut-off" points={pts} fx={(v) => num(v)} fy={(v) => num(v, 1) + '×'} legend={COMMODITIES.map((c) => ({ label: c.name, cat: c.cat }))} /></div>
      <div className="panel panel--flush"><DataTable caption="Intercepts" rows={rows} cols={cols} rowKey={(i) => i.id} pageSize={50} defaultSort={{ key: 'gm', dir: 'descending' }} /></div>
    </>
  );
}

export function HoleDetail() {
  const { id } = useParams();
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const h = w.holes.find((x) => x.id === id);
  const [edit, setEdit] = useState(false);
  if (!h) return <><PageHead title="Hole not found" crumbs={[{ to: '/drilling', label: 'Drilling' }, { label: id }]} /><p className="empty">No drillhole has the id {id}.</p></>;
  const p = w.projects.find((x) => x.id === h.projectId)!;
  const c = COMMODITY[p.commodity];
  const prg = w.programmes.find((x) => x.id === h.programmeId)!;
  const samples = w.samples.filter((s) => s.holeId === h.id);
  const batches = w.batches.filter((b) => b.holeIds.includes(h.id));
  const ints = w.intercepts.filter((i) => i.holeId === h.id).sort((a, b) => a.from - b.from);
  const assayed = samples.filter((s) => s.type === 'core' || s.type === 'chip').filter((s) => s.grade !== null);
  const STATUSES: Drillhole['status'][] = ['planned', 'drilling', 'completed', 'abandoned', 'logged', 'sampled', 'assayed'];
  return (
    <>
      <PageHead crumbs={[{ to: '/drilling', label: 'Drilling' }, { label: h.id }]} title={h.id} meta={<><Link to={`/projects/${p.id}`} style={{ color: 'var(--muted)' }}>{p.name}</Link><Link to={`/programmes/${prg.id}`} style={{ color: 'var(--muted)' }}>{prg.name}</Link><Chip status={h.status} /><span>{h.type}</span></>}
        actions={can(me, 'hole.write', w) ? <button type="button" className="btn" onClick={() => setEdit(true)}>Update hole</button> : null} />
      <div className="stack">
        <div className="panel">
          <div className="stamp">
            <Slot label="Depth" value={h.depth ? num(h.depth) : '—'} unit={`of ${num(h.plannedDepth)} m planned`} hero />
            <Slot label="Collar" long value={`${num(h.easting)} E · ${num(h.northing)} N`} sub={`RL ${num(h.rl, 1)} m`} />
            <Slot label="Orientation" value={`${h.azimuth}° / ${h.dip}°`} sub="azimuth / dip" />
            <Slot label="Samples" value={num(samples.length)} sub={`${assayed.length} assayed · ${samples.filter((s) => s.type !== 'core' && s.type !== 'chip').length} QAQC`} />
            <Slot label="Best intercept" long value={h.bestIntercept ?? '—'} />
          </div>
          <dl className="kv" style={{ marginTop: 12 }}><dt>Rig</dt><dd className="mono">{h.rigId ?? '—'}</dd><dt>Logged by</dt><dd>{h.loggerId ? PERSON(h.loggerId, w.users) : '—'}</dd><dt>Started</dt><dd className="mono">{date(h.startedOn)}</dd><dt>Completed</dt><dd className="mono">{date(h.completedOn)}</dd><dt>Batches</dt><dd>{batches.length ? batches.map((b) => <Link key={b.id} to={`/assays/${b.id}`} className="objchip" style={{ marginRight: 6 }}><span className="k">batch</span>{b.id}</Link>) : '—'}</dd></dl>
          <Authority text={`read from the collar table, ${count(samples.length, 'sample')} and ${count(batches.length, 'batch', 'batches')}`} />
        </div>
        {assayed.length > 0 ? <div className="panel"><DownholeChart samples={assayed} cutoff={c.cutoff} unit={`${c.gradeUnit} ${c.gradeLabel}`} depth={h.depth} /></div> : null}
        <div className="grid grid--2">
          <section className="panel panel--flush"><div className="ph"><h2>Intercepts</h2><span className="r">cut-off {c.cutoff} {c.gradeUnit}</span></div>
            <DataTable caption="Intercepts" rows={ints} rowKey={(i) => i.id} empty={h.status === 'assayed' ? 'No intercept above cut-off in this hole.' : 'Assays not yet received.'} cols={[
              { key: 'from', label: 'From', num: true, render: (i) => fmtM(i.from) }, { key: 'to', label: 'To', num: true, render: (i) => fmtM(i.to) }, { key: 'len', label: 'Length', num: true, render: (i) => fmtM(i.length) }, { key: 'g', label: c.gradeLabel, num: true, render: (i) => `${grade(i.grade)} ${c.gradeUnit}` }, { key: 'sig', label: 'Significant', render: (i) => i.significant ? <Chip status="accepted">yes</Chip> : <span className="dash">no</span> },
            ]} /></section>
          <Comments entityType="hole" entityId={h.id} />
        </div>
        <section className="panel panel--flush"><div className="ph"><h2>Samples</h2><span className="r">{samples.length}</span></div>
          <DataTable caption="Samples" rows={samples} rowKey={(s) => s.id} pageSize={50} compact empty="No samples taken yet." cols={[
            { key: 'id', label: 'Sample', sort: (s) => s.id, render: (s) => <span className="mono">{s.id}</span> },
            { key: 'from', label: 'From', num: true, sort: (s) => s.from, render: (s) => num(s.from, 1) }, { key: 'to', label: 'To', num: true, sort: (s) => s.to, render: (s) => num(s.to, 1) },
            { key: 'type', label: 'Type', sort: (s) => s.type, render: (s) => s.type === 'core' || s.type === 'chip' ? s.type : <Chip>{s.type}</Chip> },
            { key: 'g', label: c.gradeLabel, num: true, sort: (s) => s.grade ?? -1, render: (s) => s.grade === null ? <span className="dash">pending</span> : <span className={s.grade >= c.cutoff && (s.type === 'core' || s.type === 'chip') ? 'ink' : undefined}>{grade(s.grade, me.prefs.gradeDecimals)}</span> },
            ...Object.keys(assayed[0]?.secondary ?? {}).map((k) => ({ key: k, label: k, num: true, render: (s: Sample) => s.secondary[k] !== undefined ? num(s.secondary[k], k.includes('ppm') ? 0 : 2) : <span className="dash">—</span> })),
            { key: 'batch', label: 'Batch', render: (s) => <Link to={`/assays/${s.batchId}`}><span className="mono">{s.batchId}</span></Link> },
            { key: 'flag', label: 'Flag', render: (s) => s.flag ? <Chip status="qaqc-hold">{s.flag}</Chip> : null },
          ]} /></section>
      </div>
      <Dialog open={edit} onClose={() => setEdit(false)} title={`Update ${h.id}`}>
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); dispatch({ type: 'hole.update', id: h.id, patch: { status: fd.get('status') as Drillhole['status'], depth: Number(fd.get('depth')), completedOn: String(fd.get('completed')) || undefined } }); toast(`${h.id} updated`); setEdit(false); }}>
          <label className="field"><span>Status</span><select name="status" defaultValue={h.status}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
          <div className="grid grid--2">
            <label className="field"><span>Depth, m</span><input type="number" name="depth" min={0} step={0.5} defaultValue={h.depth} /></label>
            <label className="field"><span>Completed</span><input type="date" name="completed" defaultValue={h.completedOn ?? ''} /></label>
          </div>
          <div className="dlg-act"><button type="button" className="btn" onClick={() => setEdit(false)}>Cancel</button><button type="submit" className="btn btn--primary">Save</button></div>
        </form>
      </Dialog>
    </>
  );
}

function DownholeChart({ samples, cutoff, unit, depth }: { samples: Sample[]; cutoff: number; unit: string; depth: number }) {
  const width = 900, height = 160, padL = 48, padR = 12, padT = 10, padB = 24;
  const w = width - padL - padR, h = height - padT - padB;
  const max = Math.max(cutoff * 2, ...samples.map((s) => s.grade ?? 0));
  const x = (d: number) => padL + (d / depth) * w;
  const y = (g: number) => padT + h - (g / max) * h;
  return (
    <figure className="chart" style={{ margin: 0 }}>
      <figcaption className="chart-t"><span>Downhole grade · {unit}</span><span className="u">dashed: cut-off {cutoff}</span></figcaption>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Downhole grade profile">
        <line className="ax-ink" x1={padL} x2={width - padR} y1={y(0)} y2={y(0)} />
        <line className="proj" x1={padL} x2={width - padR} y1={y(cutoff)} y2={y(cutoff)} />
        <text className="mono" x={padL - 6} y={y(max) + 4} textAnchor="end">{max.toFixed(1)}</text>
        <text className="mono" x={padL - 6} y={y(cutoff) + 4} textAnchor="end">{cutoff}</text>
        {samples.map((s) => <rect key={s.id} x={x(s.from)} y={y(s.grade!)} width={Math.max(1, x(s.to) - x(s.from) - 0.5)} height={Math.max(0, y(0) - y(s.grade!))} style={{ fill: s.grade! >= cutoff ? 'var(--ink)' : 'var(--dim)' }}><title>{`${s.from}–${s.to} m: ${s.grade}`}</title></rect>)}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => <text key={f} className="mono" x={x(depth * f)} y={height - 6} textAnchor={f === 0 ? 'start' : f === 1 ? 'end' : 'middle'}>{Math.round(depth * f)} m</text>)}
      </svg>
      <ul className="legend"><li><span className="sw" style={{ background: 'var(--ink)' }} aria-hidden="true" />At or above cut-off</li><li><span className="sw" style={{ background: 'var(--dim)' }} aria-hidden="true" />Below cut-off</li></ul>
      <details className="values"><summary>Values behind this chart</summary><p className="faint small" style={{ marginTop: 6 }}>The sample table below lists every interval and grade.</p></details>
    </figure>
  );
}
