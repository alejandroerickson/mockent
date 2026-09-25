import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useStore, useMe, can } from '../store';
import { COMMODITY } from '../data/world';
import { num, pct, date, grade, count } from '../data/fmt';
import { Chip, PageHead, Slot, Authority, DataTable, Dialog, Comments } from '../ui/primitives';
import { Bars, Split, Lines } from '../ui/charts';
import { daysBetween } from '../data/rng';
import type { SampleBatch, Sample } from '../data/types';
import { BatchTable } from './Projects';

export function Assays() {
  const [sp] = useSearchParams();
  const w = useStore().state.world;
  const status = sp.get('status'), project = sp.get('project'), lab = sp.get('lab');
  let rows = w.batches;
  if (status === 'lab') rows = rows.filter((b) => ['submitted', 'in-prep', 'analysing'].includes(b.status));
  else if (status) rows = rows.filter((b) => b.status === status);
  if (project) rows = rows.filter((b) => b.projectId === project);
  if (lab) rows = rows.filter((b) => b.labId === lab);
  return (
    <>
      <PageHead title="Sample batches" meta={<><span>{rows.length} of {w.batches.length} batches</span><span>{num(rows.reduce((s, b) => s + b.sampleCount, 0))} samples</span>{status ? <span>status: {status === 'lab' ? 'at the laboratory' : status}</span> : null}</>} actions={<Link className="btn btn--primary" to="/assays/new">New dispatch</Link>} />
      <div className="filters">
        <label className="field"><span>Project</span><select value={project ?? ''} onChange={(e) => { window.location.hash = `#/assays?${new URLSearchParams({ ...(status ? { status } : {}), ...(e.target.value ? { project: e.target.value } : {}) })}`; }}><option value="">All projects</option>{w.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label className="field"><span>Laboratory</span><select value={lab ?? ''} onChange={(e) => { window.location.hash = `#/assays?${new URLSearchParams({ ...(status ? { status } : {}), ...(project ? { project } : {}), ...(e.target.value ? { lab: e.target.value } : {}) })}`; }}><option value="">All laboratories</option>{w.labs.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
        <span className="ct">{rows.filter((b) => b.failures.length).length} with QAQC failures{project || lab || status ? <Link className="btn btn--small" to="/assays">Clear</Link> : null}</span>
      </div>
      <div className="panel panel--flush"><BatchTable rows={rows} /></div>
    </>
  );
}

export function NewDispatch() {
  const { state, dispatch, toast } = useStore();
  const w = state.world;
  const [projectId, setProjectId] = useState(w.projects.find((p) => w.holes.some((h) => h.projectId === p.id && h.status === 'logged'))?.id ?? w.projects[0].id);
  const [labId, setLabId] = useState(w.labs.filter((l) => l.active)[0].id);
  const [holeIds, setHoleIds] = useState<string[]>([]);
  const [done, setDone] = useState<string | null>(null);
  const holes = w.holes.filter((h) => h.projectId === projectId && h.status === 'logged');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holeIds.length) return;
    const n = Math.max(...w.batches.map((b) => Number(b.id.slice(7)))) + 1;
    const id = `LAB-26-${String(n).padStart(5, '0')}`;
    const est = holeIds.reduce((s, hid) => s + Math.round((w.holes.find((h) => h.id === hid)?.depth ?? 0) / 2), 0);
    const batch: SampleBatch = { id, projectId, labId, holeIds, submittedOn: state.clock.slice(0, 10), status: 'submitted', method: COMMODITY[w.projects.find((p) => p.id === projectId)!.commodity].method, sampleCount: est, standards: Math.round(est / 20), blanks: Math.round(est / 20), duplicates: Math.round(est / 20), failures: [], dispatchNo: `DSP-${projectId.slice(4)}-${String(Math.floor(Math.random() * 90) + 10)}` };
    dispatch({ type: 'batch.create', batch });
    for (const hid of holeIds) dispatch({ type: 'hole.update', id: hid, patch: { status: 'sampled' } });
    toast(`Dispatch ${id} submitted to ${w.labs.find((l) => l.id === labId)?.name}`, `/assays/${id}`); setDone(id);
  };
  if (done) return <p className="notice">Dispatch created. <Link to={`/assays/${done}`}>Open {done}</Link></p>;
  return (
    <>
      <PageHead title="New sample dispatch" crumbs={[{ to: '/assays', label: 'Assays' }, { label: 'New dispatch' }]} />
      <form className="panel stack" onSubmit={submit} style={{ maxWidth: 760 }}>
        <div className="grid grid--2">
          <label className="field"><span>Project</span><select value={projectId} onChange={(e) => { setProjectId(e.target.value); setHoleIds([]); }}>{w.projects.filter((p) => p.status !== 'closed').map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          <label className="field"><span>Laboratory</span><select value={labId} onChange={(e) => setLabId(e.target.value)}>{w.labs.map((l) => <option key={l.id} value={l.id} disabled={!l.active}>{l.name} · {l.turnaroundDays} d</option>)}</select></label>
        </div>
        <fieldset><legend>Logged holes awaiting dispatch</legend>
          {holes.length === 0 ? <p className="faint small">No logged holes on this project are waiting for dispatch.</p> : <div className="pills">{holes.map((h) => <label key={h.id}><input type="checkbox" checked={holeIds.includes(h.id)} onChange={(e) => setHoleIds(e.target.checked ? [...holeIds, h.id] : holeIds.filter((x) => x !== h.id))} />{h.id} · {num(h.depth)} m</label>)}</div>}
        </fieldset>
        <p className="faint small">QAQC insertions follow the tenant rule: one standard, one blank and one field duplicate per 20 samples. Sample numbers are assigned on dispatch.</p>
        <div className="row row--end"><Link className="btn" to="/assays">Cancel</Link><button type="submit" className="btn btn--primary" disabled={!holeIds.length}>Submit dispatch</button></div>
      </form>
    </>
  );
}

export function QaqcSummary() {
  const w = useStore().state.world;
  const byLab = w.labs.map((l) => { const bs = w.batches.filter((b) => b.labId === l.id && b.receivedOn); const checks = bs.reduce((s, b) => s + b.standards + b.blanks + b.duplicates, 0); const fails = bs.reduce((s, b) => s + b.failures.length, 0); return { lab: l, batches: bs.length, checks, fails, rate: checks ? 100 - (fails / checks) * 100 : null, tat: bs.length ? bs.reduce((s, b) => s + daysBetween(b.submittedOn, b.receivedOn!), 0) / bs.length : null }; });
  const byProject = w.projects.filter((p) => w.batches.some((b) => b.projectId === p.id)).map((p) => { const bs = w.batches.filter((b) => b.projectId === p.id); return { p, checks: bs.reduce((s, b) => s + b.standards + b.blanks + b.duplicates, 0), fails: bs.reduce((s, b) => s + b.failures.length, 0), holds: bs.filter((b) => b.status === 'qaqc-hold').length }; });
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const rate = months.map((_, i) => { const bs = w.batches.filter((b) => b.receivedOn?.startsWith(`2026-${String(i + 1).padStart(2, '0')}`)); const c = bs.reduce((s, b) => s + b.standards + b.blanks + b.duplicates, 0); return c ? +(100 - (bs.reduce((s, b) => s + b.failures.length, 0) / c) * 100).toFixed(1) : 0; });
  return (
    <>
      <PageHead title="QAQC summary" meta={<><span>{w.batches.filter((b) => b.receivedOn).length} received batches</span><span>tolerances: ±{w.settings.qaqc.standardSigma}σ standards · blanks {w.settings.qaqc.blankMaxMultiple}× detection · duplicates HARD {w.settings.qaqc.duplicateHardPct} %</span></>} actions={<Link className="btn" to="/admin/qaqc">Tolerances</Link>} />
      <div className="stack">
        <div className="grid grid--2">
          <div className="panel"><Lines title="QAQC pass rate by month received" unit="%" labels={months} series={[{ name: 'Pass rate', cat: 1, values: rate }]} fmt={(v) => num(v, 1)} /></div>
          <div className="panel"><Bars title="Failures by project" unit="failures" rows={byProject.filter((x) => x.fails).map((x) => ({ label: x.p.name, value: x.fails, cat: COMMODITY[x.p.commodity].cat, href: `/assays?project=${x.p.id}` }))} fmt={(v) => num(v)} /></div>
        </div>
        <section className="panel panel--flush"><div className="ph"><h2>By laboratory</h2></div>
          <DataTable caption="QAQC by laboratory" rows={byLab} rowKey={(r) => r.lab.id} cols={[
            { key: 'lab', label: 'Laboratory', render: (r) => <Link to={`/assays?lab=${r.lab.id}`}>{r.lab.name}</Link> },
            { key: 'acc', label: 'Accreditation', render: (r) => r.lab.accreditation },
            { key: 'b', label: 'Batches received', num: true, render: (r) => num(r.batches) },
            { key: 'c', label: 'Checks', num: true, render: (r) => num(r.checks) },
            { key: 'f', label: 'Failures', num: true, render: (r) => num(r.fails) },
            { key: 'r', label: 'Pass rate', num: true, render: (r) => r.rate === null ? <span className="dash">—</span> : pct(r.rate, 1) },
            { key: 't', label: 'Mean turnaround', num: true, render: (r) => r.tat === null ? <span className="dash">—</span> : `${num(r.tat, 1)} d` },
            { key: 'q', label: 'Quoted', num: true, render: (r) => `${r.lab.turnaroundDays} d` },
            { key: 'active', label: 'Status', render: (r) => <Chip status={r.lab.active ? 'active' : 'inactive'} /> },
          ]} /></section>
        <section className="panel panel--flush"><div className="ph"><h2>By project</h2></div>
          <DataTable caption="QAQC by project" rows={byProject} rowKey={(r) => r.p.id} cols={[
            { key: 'p', label: 'Project', render: (r) => <Link to={`/projects/${r.p.id}/assays`}>{r.p.name}</Link> },
            { key: 'c', label: 'Checks', num: true, render: (r) => num(r.checks) },
            { key: 'f', label: 'Failures', num: true, render: (r) => num(r.fails) },
            { key: 'r', label: 'Pass rate', num: true, render: (r) => r.checks ? pct(100 - (r.fails / r.checks) * 100, 1) : <span className="dash">—</span> },
            { key: 'h', label: 'On hold', num: true, render: (r) => r.holds ? <span className="ink">{r.holds}</span> : <span className="dash">0</span> },
          ]} /></section>
      </div>
    </>
  );
}

export function SampleRegister() {
  const w = useStore().state.world;
  const me = useMe();
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [projectId, setProjectId] = useState('');
  let rows = w.samples;
  if (projectId) { const holes = new Set(w.holes.filter((h) => h.projectId === projectId).map((h) => h.id)); rows = rows.filter((s) => holes.has(s.holeId)); }
  if (type) rows = rows.filter((s) => s.type === type);
  if (q) rows = rows.filter((s) => s.id.includes(q) || s.holeId.toLowerCase().includes(q.toLowerCase()) || s.batchId.toLowerCase().includes(q.toLowerCase()));
  const shown = rows.slice(0, 5000);
  return (
    <>
      <PageHead title="Sample register" meta={<><span>{num(rows.length)} of {num(w.samples.length)} samples</span>{rows.length > 5000 ? <span>first 5,000 shown; narrow the cut</span> : null}</>} />
      <div className="filters" role="search">
        <label className="field field--wide"><span>Sample, hole or batch id</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. 100482, WC-DDH-014, LAB-26-04412" /></label>
        <label className="field"><span>Project</span><select value={projectId} onChange={(e) => setProjectId(e.target.value)}><option value="">All</option>{w.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label className="field"><span>Type</span><select value={type} onChange={(e) => setType(e.target.value)}><option value="">All</option>{['core', 'chip', 'standard', 'blank', 'duplicate'].map((t) => <option key={t}>{t}</option>)}</select></label>
      </div>
      <div className="panel panel--flush"><DataTable caption="Samples" rows={shown} rowKey={(s) => s.id} pageSize={me.prefs.rowsPerPage} compact={me.prefs.compactTables} cols={[
        { key: 'id', label: 'Sample', sort: (s) => s.id, render: (s) => <span className="mono">{s.id}</span> },
        { key: 'hole', label: 'Hole', sort: (s) => s.holeId, render: (s) => <Link to={`/drilling/${s.holeId}`}><span className="mono">{s.holeId}</span></Link> },
        { key: 'from', label: 'From', num: true, sort: (s) => s.from, render: (s) => num(s.from, 1) }, { key: 'to', label: 'To', num: true, sort: (s) => s.to, render: (s) => num(s.to, 1) },
        { key: 'type', label: 'Type', sort: (s) => s.type, render: (s) => s.type },
        { key: 'g', label: 'Grade', num: true, sort: (s) => s.grade ?? -1, render: (s) => s.grade === null ? <span className="dash">pending</span> : grade(s.grade, me.prefs.gradeDecimals) },
        { key: 'batch', label: 'Batch', sort: (s) => s.batchId, render: (s) => <Link to={`/assays/${s.batchId}`}><span className="mono">{s.batchId}</span></Link> },
        { key: 'flag', label: 'Flag', render: (s) => s.flag ? <Chip status="qaqc-hold">{s.flag}</Chip> : null },
      ]} /></div>
    </>
  );
}

export function BatchDetail() {
  const { id } = useParams();
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const b = w.batches.find((x) => x.id === id);
  const [act, setAct] = useState<'accept' | 'reject' | 'hold' | 'receive' | null>(null);
  if (!b) return <><PageHead title="Batch not found" crumbs={[{ to: '/assays', label: 'Assays' }, { label: id }]} /><p className="empty">No batch has the id {id}.</p></>;
  const p = w.projects.find((x) => x.id === b.projectId)!;
  const c = COMMODITY[p.commodity];
  const lab = w.labs.find((l) => l.id === b.labId)!;
  const samples = w.samples.filter((s) => s.batchId === b.id);
  const primary = samples.filter((s) => (s.type === 'core' || s.type === 'chip') && s.grade !== null);
  const above = primary.filter((s) => s.grade! >= c.cutoff).length;
  const canReview = can(me, 'qaqc.review', w);
  const decide = () => {
    const status: SampleBatch['status'] = act === 'accept' ? 'accepted' : act === 'reject' ? 'rejected' : act === 'hold' ? 'qaqc-hold' : 'received';
    dispatch({ type: 'batch.update', id: b.id, patch: { status, ...(act === 'receive' ? { receivedOn: state.clock.slice(0, 10) } : {}) } });
    toast(`Batch ${b.id} ${status.replace('-', ' ')}`); setAct(null);
  };
  return (
    <>
      <PageHead crumbs={[{ to: '/assays', label: 'Assays' }, { label: b.id }]} title={b.id} meta={<><Link to={`/projects/${p.id}`} style={{ color: 'var(--muted)' }}>{p.name}</Link><Chip status={b.status} /><span>{lab.name}</span><span>dispatch {b.dispatchNo}</span><span>{b.method}</span></>}
        actions={canReview ? <>
          {['submitted', 'in-prep', 'analysing'].includes(b.status) ? <button type="button" className="btn btn--primary" onClick={() => setAct('receive')}>Import results</button> : null}
          {['received', 'qaqc-hold'].includes(b.status) ? <><button type="button" className="btn btn--primary" onClick={() => setAct('accept')}>Accept batch</button>{b.status !== 'qaqc-hold' ? <button type="button" className="btn" onClick={() => setAct('hold')}>Place on hold</button> : null}<button type="button" className="btn btn--danger" onClick={() => setAct('reject')}>Reject</button></> : null}
        </> : null} />
      <div className="stack">
        <div className="panel">
          <div className="stamp">
            <Slot label="Samples" value={num(b.sampleCount)} hero sub={count(b.holeIds.length, 'hole')} />
            <Slot label="QAQC insertions" long value={`${b.standards} / ${b.blanks} / ${b.duplicates}`} sub="standards / blanks / duplicates" />
            <Slot label="Insertion rate" value={pct(((b.standards + b.blanks + b.duplicates) / Math.max(1, b.sampleCount)) * 100, 1)} sub={`minimum ${w.settings.qaqc.minInsertionRate} %`} />
            <Slot label="Failures" value={num(b.failures.length)} cls={b.failures.length ? 'ink' : ''} sub={b.failures.length ? b.failures.map((f) => f.kind).join(', ') : 'none'} />
            <Slot label="Above cut-off" value={b.receivedOn ? num(above) : '—'} sub={b.receivedOn ? `${pct((above / Math.max(1, primary.length)) * 100)} of ${num(primary.length)} primary samples` : 'results not received'} />
            <Slot label="Turnaround" value={b.receivedOn ? num(daysBetween(b.submittedOn, b.receivedOn)) : num(daysBetween(b.submittedOn, state.clock.slice(0, 10)))} unit={b.receivedOn ? 'days' : 'days so far'} sub={`quoted ${lab.turnaroundDays} d`} />
          </div>
          <dl className="kv" style={{ marginTop: 12 }}><dt>Holes</dt><dd>{b.holeIds.map((h) => <Link key={h} to={`/drilling/${h}`} className="objchip" style={{ marginRight: 6, marginBottom: 4 }}><span className="k">hole</span>{h}</Link>)}</dd><dt>Dispatched</dt><dd className="mono">{date(b.submittedOn)}</dd><dt>Received</dt><dd className="mono">{date(b.receivedOn)}</dd></dl>
          <Authority text={`read from the laboratory certificate ${b.receivedOn ? `received ${b.receivedOn}` : '(pending)'} and ${count(samples.length, 'sample record')}`} />
        </div>
        <div className="grid grid--2">
          <section className="panel"><div className="ph"><h2>QAQC failures</h2><span className="r">{b.failures.length}</span></div>
            {b.failures.length === 0 ? <p className="faint small">No failures against the tenant tolerances.</p> : <ul className="steps">{b.failures.map((f) => <li key={f.sampleId}><span className="dot no" aria-hidden="true" /><span><span className="n">{f.kind} · sample <span className="mono">{f.sampleId}</span></span><br /><span className="who">{f.detail}</span></span><span className="d" /></li>)}</ul>}
            {b.receivedOn ? <div style={{ marginTop: 12 }}><div className="chart-t" style={{ fontSize: 13 }}><span>Primary samples by grade band</span></div><Split parts={[{ label: `≥ 1.5× cut-off`, value: primary.filter((s) => s.grade! >= c.cutoff * 1.5).length, ink: true }, { label: `cut-off to 1.5×`, value: primary.filter((s) => s.grade! >= c.cutoff && s.grade! < c.cutoff * 1.5).length, cat: 7 }, { label: 'below cut-off', value: primary.filter((s) => s.grade! < c.cutoff).length, hollow: true }]} /></div> : null}
          </section>
          <Comments entityType="batch" entityId={b.id} />
        </div>
        <section className="panel panel--flush"><div className="ph"><h2>Samples</h2><span className="r">{samples.length}</span></div>
          <DataTable caption="Samples in this batch" rows={samples} rowKey={(s) => s.id} pageSize={me.prefs.rowsPerPage} compact={me.prefs.compactTables} cols={[
            { key: 'id', label: 'Sample', sort: (s) => s.id, render: (s) => <span className="mono">{s.id}</span> },
            { key: 'hole', label: 'Hole', sort: (s) => s.holeId, render: (s) => <Link to={`/drilling/${s.holeId}`}><span className="mono">{s.holeId}</span></Link> },
            { key: 'from', label: 'From', num: true, sort: (s) => s.from, render: (s) => num(s.from, 1) }, { key: 'to', label: 'To', num: true, sort: (s) => s.to, render: (s) => num(s.to, 1) },
            { key: 'type', label: 'Type', sort: (s) => s.type, render: (s) => s.type === 'core' || s.type === 'chip' ? s.type : <Chip>{s.type}</Chip> },
            { key: 'g', label: c.gradeLabel, num: true, sort: (s) => s.grade ?? -1, render: (s) => s.grade === null ? <span className="dash">pending</span> : <span className={s.grade >= c.cutoff && (s.type === 'core' || s.type === 'chip') ? 'ink' : undefined}>{grade(s.grade, me.prefs.gradeDecimals)}</span> },
            ...Object.keys(primary[0]?.secondary ?? {}).map((k) => ({ key: k, label: k, num: true, render: (s: Sample) => s.secondary[k] !== undefined ? num(s.secondary[k], k.includes('ppm') ? 0 : 2) : <span className="dash">—</span> })),
            { key: 'flag', label: 'Flag', render: (s) => s.flag ? <Chip status="qaqc-hold">{s.flag}</Chip> : null },
          ]} /></section>
      </div>
      <Dialog open={!!act} onClose={() => setAct(null)} title={act === 'accept' ? `Accept ${b.id}` : act === 'reject' ? `Reject ${b.id}` : act === 'hold' ? `Place ${b.id} on QAQC hold` : `Import results for ${b.id}`}
        summary={act === 'accept' ? `${b.failures.length} failure${b.failures.length === 1 ? '' : 's'} recorded. Accepting releases the grades to intercepts and estimates.` : act === 'reject' ? 'Rejected batches are re-assayed at the laboratory\'s cost. The holes return to sampled.' : act === 'hold' ? 'The batch stays out of intercepts and estimates until it is accepted.' : `Results from ${lab.name} will be imported and QAQC checks run against the tenant tolerances.`}>
        <form onSubmit={(e) => { e.preventDefault(); decide(); }}>
          {act === 'accept' && b.failures.length ? <label className="check"><input type="checkbox" required />I have reviewed each failure and accept the batch with them noted.</label> : null}
          {act === 'reject' ? <label className="field"><span>Reason sent to the laboratory</span><textarea required placeholder="Which checks failed and what is requested" /></label> : null}
          <div className="dlg-act"><button type="button" className="btn" onClick={() => setAct(null)}>Cancel</button><button type="submit" className={`btn ${act === 'reject' ? 'btn--danger' : 'btn--primary'}`}>{act === 'accept' ? 'Accept' : act === 'reject' ? 'Reject batch' : act === 'hold' ? 'Place on hold' : 'Import'}</button></div>
        </form>
      </Dialog>
    </>
  );
}

