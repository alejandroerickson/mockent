import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useStore, useMe, can } from '../store';
import { COMMODITY, COMMODITIES } from '../data/world';
import { money, num, pct, date, grade, count } from '../data/fmt';
import { Chip, PageHead, Slot, Authority, DataTable, Dialog, Comments, type Col } from '../ui/primitives';
import { Bars, Columns, Split } from '../ui/charts';
import type { ResourceEstimate, CommodityCode, Approval } from '../data/types';

function tonnesOf(e: ResourceEstimate) { return e.blocks.reduce((s, b) => s + b.tonnes, 0); }
function gradeOf(e: ResourceEstimate) { return e.blocks.reduce((s, b) => s + b.tonnes * b.grade, 0) / Math.max(1e-9, tonnesOf(e)); }
function containedOf(e: ResourceEstimate) { return e.blocks.reduce((s, b) => s + b.contained, 0); }
export function unitPrice(_code: CommodityCode, deck: { value: number; unit: string }) { return deck.unit.includes('/lb') ? deck.value * 2204.62 : deck.value; }
export function valueOf(e: ResourceEstimate, code: CommodityCode, deck: { value: number; unit: string }, priceFactor = 1) { return containedOf(e) * unitPrice(code, deck) * priceFactor; }

function latestReleased(estimates: ResourceEstimate[], projectId: string) { return estimates.filter((e) => e.projectId === projectId && e.status === 'released').sort((a, b) => (a.asOf < b.asOf ? 1 : -1))[0]; }

export function ResourcesHome() {
  const w = useStore().state.world;
  const rows = w.projects.map((p) => ({ p, e: latestReleased(w.estimates, p.id) })).filter((r) => r.e);
  const deck = (c: CommodityCode) => w.settings.priceDeck.find((d) => d.commodity === c)!;
  const totalValue = rows.reduce((s, r) => s + valueOf(r.e, r.p.commodity, deck(r.p.commodity)), 0);
  return (
    <>
      <PageHead title="Portfolio resources" meta={<><span>{rows.length} projects with a released estimate</span><span>price deck {w.settings.priceDeck[0].asOf}</span></>} actions={<Link className="btn" to="/resources/price-deck">Price deck</Link>} />
      <div className="stack">
        <div className="panel">
          <div className="stamp">
            <Slot label="In-situ value at deck" value={money(totalValue, { compact: true })} unit={w.settings.baseCurrency} hero sub="released estimates only; no recovery or cost applied" />
            <Slot label="Estimates in review" value={num(w.estimates.filter((e) => ['draft', 'internal-review', 'qp-review'].includes(e.status)).length)} sub={`${w.estimates.filter((e) => e.status === 'qp-review').length} at QP review`} />
            <Slot label="Measured + indicated share" value={pct((rows.reduce((s, r) => s + r.e.blocks.filter((b) => b.category !== 'inferred').reduce((x, b) => x + b.contained * unitPrice(r.p.commodity, deck(r.p.commodity)), 0), 0) / Math.max(1, totalValue)) * 100)} sub="of in-situ value" />
            <Slot label="Release requests pending" value={num(w.approvals.filter((a) => a.type === 'resource-release' && a.status === 'pending').length)} />
          </div>
          <Authority text={`computed by ADIT from ${count(rows.length, 'released estimate')} and the corporate price deck`} detail={<dl className="kv"><dt>In-situ value</dt><dd>Contained metal × deck price, per project, summed. Copper is priced per pound and converted at 2,204.62 lb/t.</dd><dt>Not applied</dt><dd>Mining recovery, metallurgical recovery, payability, costs.</dd></dl>} />
        </div>
        <div className="grid grid--2">
          <div className="panel"><Bars title="In-situ value by project" unit={w.settings.baseCurrency} rows={rows.map((r) => ({ label: r.p.name, value: valueOf(r.e, r.p.commodity, deck(r.p.commodity)), cat: COMMODITY[r.p.commodity].cat, href: `/resources/estimates/${r.e.id}` })).sort((a, b) => b.value - a.value)} fmt={(v) => money(v, { compact: true })} /></div>
          <div className="panel"><div className="chart-t"><span>Value by commodity</span></div><Split parts={COMMODITIES.map((c) => ({ label: c.name, value: rows.filter((r) => r.p.commodity === c.code).reduce((s, r) => s + valueOf(r.e, c.code, deck(c.code)), 0), cat: c.cat })).filter((x) => x.value > 0)} fmt={(v) => money(v, { compact: true })} /><div className="chart-t" style={{ marginTop: 16 }}><span>Value by category</span></div><Split parts={(['measured', 'indicated', 'inferred'] as const).map((cat) => ({ label: cat, value: rows.reduce((s, r) => s + r.e.blocks.filter((b) => b.category === cat).reduce((x, b) => x + b.contained * unitPrice(r.p.commodity, deck(r.p.commodity)), 0), 0), ink: cat === 'measured', cat: cat === 'indicated' ? 7 : undefined, hollow: cat === 'inferred' }))} fmt={(v) => money(v, { compact: true })} /></div>
        </div>
        <section className="panel panel--flush"><div className="ph"><h2>Released estimates by project</h2></div>
          <DataTable caption="Released estimates" rows={rows} rowKey={(r) => r.p.id} cols={[
            { key: 'p', label: 'Project', sort: (r) => r.p.name, render: (r) => <Link to={`/projects/${r.p.id}/resource`}>{r.p.name}</Link> },
            { key: 'c', label: 'Commodity', sort: (r) => r.p.commodity, render: (r) => <span className="chip"><span className={`sw cat-${COMMODITY[r.p.commodity].cat}`} aria-hidden="true" />{COMMODITY[r.p.commodity].name}</span> },
            { key: 'e', label: 'Estimate', render: (r) => <Link to={`/resources/estimates/${r.e.id}`}><span className="mono">{r.e.id}</span></Link> },
            { key: 'asof', label: 'As of', sort: (r) => r.e.asOf, render: (r) => <span className="mono">{date(r.e.asOf)}</span> },
            { key: 't', label: 'Tonnes', num: true, sort: (r) => tonnesOf(r.e), render: (r) => <>{num(tonnesOf(r.e), 1)}<span className="unit">Mt</span></> },
            { key: 'g', label: 'Grade', num: true, render: (r) => <>{grade(gradeOf(r.e))}<span className="unit">{COMMODITY[r.p.commodity].gradeUnit} {COMMODITY[r.p.commodity].gradeLabel}</span></> },
            { key: 'm', label: 'Contained', num: true, sort: (r) => containedOf(r.e), render: (r) => <>{num(containedOf(r.e))}<span className="unit">{COMMODITY[r.p.commodity].metalUnit}</span></> },
            { key: 'v', label: 'In-situ value', num: true, sort: (r) => valueOf(r.e, r.p.commodity, deck(r.p.commodity)), render: (r) => money(valueOf(r.e, r.p.commodity, deck(r.p.commodity))) },
            { key: 'cat', label: 'Categories', render: (r) => r.e.blocks.map((b) => b.category[0].toUpperCase()).join(' + ') },
          ]} /></section>
      </div>
    </>
  );
}

export function Estimates() {
  const [sp] = useSearchParams();
  const w = useStore().state.world;
  const me = useMe();
  const status = sp.get('status'), project = sp.get('project');
  let rows = w.estimates;
  if (status === 'review') rows = rows.filter((e) => ['draft', 'internal-review', 'qp-review'].includes(e.status));
  else if (status) rows = rows.filter((e) => e.status === status);
  if (project) rows = rows.filter((e) => e.projectId === project);
  const cols: Col<ResourceEstimate>[] = [
    { key: 'id', label: 'Estimate', sort: (e) => e.id, render: (e) => <Link to={`/resources/estimates/${e.id}`}><span className="mono">{e.id}</span></Link> },
    { key: 'p', label: 'Project', sort: (e) => e.projectId, render: (e) => <Link to={`/projects/${e.projectId}`}>{w.projects.find((p) => p.id === e.projectId)?.name}</Link> },
    { key: 'asof', label: 'As of', sort: (e) => e.asOf, render: (e) => <span className="mono">{date(e.asOf)}</span> },
    { key: 'status', label: 'Status', sort: (e) => e.status, render: (e) => <Chip status={e.status} /> },
    { key: 'method', label: 'Method', render: (e) => e.method },
    { key: 'cut', label: 'Cut-off', num: true, render: (e) => e.cutoff },
    { key: 't', label: 'Tonnes', num: true, sort: (e) => tonnesOf(e), render: (e) => `${num(tonnesOf(e), 1)} Mt` },
    { key: 'g', label: 'Grade', num: true, render: (e) => grade(gradeOf(e)) },
    { key: 'c', label: 'Contained', num: true, sort: (e) => containedOf(e), render: (e) => `${num(containedOf(e))} ${COMMODITY[w.projects.find((p) => p.id === e.projectId)!.commodity].metalUnit}` },
    { key: 'a', label: 'Author', render: (e) => w.users.find((u) => u.id === e.authorId)?.name },
    { key: 'r', label: 'Reviewer', render: (e) => w.users.find((u) => u.id === e.reviewerId)?.name ?? <span className="dash">—</span> },
  ];
  return (
    <>
      <PageHead title="Resource estimates" meta={<><span>{rows.length} of {w.estimates.length}</span>{status ? <span>{status === 'review' ? 'in review' : status}</span> : null}</>} actions={can(me, 'resource.write', w) ? <Link className="btn btn--primary" to="/resources/estimates/new">New estimate</Link> : null} />
      <div className="panel panel--flush"><DataTable caption="Resource estimates" rows={rows} cols={cols} rowKey={(e) => e.id} defaultSort={{ key: 'asof', dir: 'descending' }} /></div>
    </>
  );
}

export function NewEstimate() {
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const [f, setF] = useState({ projectId: w.projects.filter((p) => p.status === 'active')[0].id, method: 'Ordinary kriging', cutoff: '', indicated: '', indicatedGrade: '', inferred: '', inferredGrade: '', notes: '' });
  const [done, setDone] = useState<string | null>(null);
  const p = w.projects.find((x) => x.id === f.projectId)!;
  const c = COMMODITY[p.commodity];
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Math.max(...w.estimates.map((x) => Number(x.id.slice(9)))) + 1;
    const id = `RES-2026-${String(n).padStart(2, '0')}`;
    const blocks = [{ category: 'indicated' as const, tonnes: Number(f.indicated) || 0, grade: Number(f.indicatedGrade) || 0 }, { category: 'inferred' as const, tonnes: Number(f.inferred) || 0, grade: Number(f.inferredGrade) || 0 }].filter((b) => b.tonnes > 0).map((b) => ({ ...b, contained: Math.round(c.contained(b.tonnes, b.grade)) }));
    if (!blocks.length) return;
    const total = blocks.reduce((s, b) => s + b.contained, 0);
    const est: ResourceEstimate = { id, projectId: f.projectId, asOf: state.clock.slice(0, 10), status: 'draft', method: f.method, cutoff: Number(f.cutoff) || w.settings.cutoffs[p.commodity], authorId: me.id, blocks, p10: Math.round(total * 0.68), p50: total, p90: Math.round(total * 1.41), notes: f.notes };
    dispatch({ type: 'estimate.create', estimate: est });
    toast(`${id} saved as a draft`, `/resources/estimates/${id}`); setDone(id);
  };
  if (done) return <p className="notice">Estimate saved. <Link to={`/resources/estimates/${done}`}>Open {done}</Link></p>;
  return (
    <>
      <PageHead title="New resource estimate" crumbs={[{ to: '/resources/estimates', label: 'Estimates' }, { label: 'New' }]} />
      <form className="panel stack" onSubmit={submit} style={{ maxWidth: 760 }}>
        <div className="grid grid--2">
          <label className="field"><span>Project</span><select value={f.projectId} onChange={(e) => setF({ ...f, projectId: e.target.value })}>{w.projects.filter((x) => x.status !== 'closed').map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
          <label className="field"><span>Method</span><select value={f.method} onChange={(e) => setF({ ...f, method: e.target.value })}>{['Ordinary kriging', 'Ordinary kriging with top-cut', 'Inverse distance squared', 'Polygonal, bed-thickness weighted', 'Nearest neighbour'].map((m) => <option key={m}>{m}</option>)}</select></label>
          <label className="field"><span>Cut-off, {c.gradeUnit} {c.gradeLabel}</span><input type="number" step="0.01" placeholder={String(w.settings.cutoffs[p.commodity])} value={f.cutoff} onChange={(e) => setF({ ...f, cutoff: e.target.value })} /></label>
        </div>
        <fieldset><legend>Indicated</legend><div className="grid grid--2"><label className="field"><span>Tonnes, Mt</span><input type="number" step="0.01" value={f.indicated} onChange={(e) => setF({ ...f, indicated: e.target.value })} /></label><label className="field"><span>Grade, {c.gradeUnit} {c.gradeLabel}</span><input type="number" step="0.01" value={f.indicatedGrade} onChange={(e) => setF({ ...f, indicatedGrade: e.target.value })} /></label></div></fieldset>
        <fieldset><legend>Inferred</legend><div className="grid grid--2"><label className="field"><span>Tonnes, Mt</span><input type="number" step="0.01" value={f.inferred} onChange={(e) => setF({ ...f, inferred: e.target.value })} /></label><label className="field"><span>Grade, {c.gradeUnit} {c.gradeLabel}</span><input type="number" step="0.01" value={f.inferredGrade} onChange={(e) => setF({ ...f, inferredGrade: e.target.value })} /></label></div></fieldset>
        <label className="field"><span>Notes</span><textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} placeholder="Domains, top-cuts, density, what changed since the last estimate" /></label>
        <p className="faint small">Measured resources are entered by the database geologist after QP review. The estimate is saved as a draft; use Submit for release on the estimate page.</p>
        <div className="row row--end"><Link className="btn" to="/resources/estimates">Cancel</Link><button type="submit" className="btn btn--primary">Save draft</button></div>
      </form>
    </>
  );
}

export function EstimateDetail() {
  const { id } = useParams();
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const e = w.estimates.find((x) => x.id === id);
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  if (!e) return <><PageHead title="Estimate not found" crumbs={[{ to: '/resources/estimates', label: 'Estimates' }, { label: id }]} /><p className="empty">No estimate has the id {id}.</p></>;
  const p = w.projects.find((x) => x.id === e.projectId)!;
  const c = COMMODITY[p.commodity];
  const deck = w.settings.priceDeck.find((d) => d.commodity === p.commodity)!;
  const release = w.approvals.find((a) => a.type === 'resource-release' && a.subjectId === e.id);
  const sens = [-20, -10, 0, 10, 20].map((d) => ({ d, v: valueOf(e, p.commodity, deck, 1 + d / 100) }));
  const submitRelease = () => {
    const n = Math.max(...w.approvals.map((a) => Number(a.id.slice(8)))) + 1;
    const def = w.workflows.find((x) => x.type === 'resource-release')!;
    const ap: Approval = { id: `WF-2026-${String(n).padStart(4, '0')}`, type: 'resource-release', title: `Resource release: ${e.id}, ${p.name}`, projectId: p.id, subjectType: 'estimate', subjectId: e.id, requestedById: me.id, submittedOn: state.clock.slice(0, 10), dueOn: state.clock.slice(0, 10), status: 'pending', steps: def.steps.map((s) => ({ name: s.name, roleCode: s.roleCode, actorId: w.users.find((u) => u.active && u.roleCode === s.roleCode)?.id })), currentStep: 0, summary: `${e.method}, cut-off ${e.cutoff} ${c.gradeUnit}. ${num(tonnesOf(e), 1)} Mt at ${grade(gradeOf(e))} ${c.gradeUnit} ${c.gradeLabel} for ${num(containedOf(e))} ${c.metalUnit}.` };
    dispatch({ type: 'approval.create', approval: ap });
    dispatch({ type: 'estimate.update', id: e.id, patch: { status: 'internal-review' } });
    toast(`${ap.id} submitted`, `/approvals/${ap.id}`); setReleaseOpen(false);
  };
  return (
    <>
      <PageHead crumbs={[{ to: '/resources/estimates', label: 'Estimates' }, { label: e.id }]} title={`${p.name} · ${e.id}`} meta={<><Chip status={e.status} /><span>as of {date(e.asOf)}</span><span>{e.method}</span><span>cut-off {e.cutoff} {c.gradeUnit} {c.gradeLabel}</span></>}
        actions={<>
          {can(me, 'resource.write', w) && e.status === 'draft' && !release ? <button type="button" className="btn btn--primary" onClick={() => setReleaseOpen(true)}>Submit for release</button> : null}
          {can(me, 'resource.write', w) && e.status !== 'released' && e.status !== 'superseded' ? <button type="button" className="btn" onClick={() => setStatusOpen(true)}>Change status</button> : null}
          {release ? <Link className="btn" to={`/approvals/${release.id}`}>Release request {release.id}</Link> : null}
        </>} />
      <div className="stack">
        <div className="panel">
          <div className="stamp">
            <Slot label={`Contained ${c.gradeLabel}`} value={num(containedOf(e))} unit={c.metalUnit} hero />
            <Slot label="Tonnes" value={num(tonnesOf(e), 1)} unit="Mt" />
            <Slot label="Grade" value={grade(gradeOf(e))} unit={`${c.gradeUnit} ${c.gradeLabel}`} />
            <Slot label="In-situ value at deck" value={money(valueOf(e, p.commodity, deck), { compact: true })} unit={w.settings.baseCurrency} sub={`${deck.value.toLocaleString('en-CA')} ${deck.unit} · ${deck.asOf}`} />
            <Slot label="Forecast P10 / P50 / P90" long value={`${num(e.p10 / 1000)} / ${num(e.p50 / 1000)} / ${num(e.p90 / 1000)}`} unit={`k ${c.metalUnit}`} />
          </div>
          <Authority text={`computed by ADIT from ${count(e.blocks.length, 'category block')}, ${count(w.holes.filter((h) => h.projectId === p.id && h.status === 'assayed').length, 'assayed hole')} and the price deck of ${deck.asOf}`} detail={<dl className="kv"><dt>Author</dt><dd>{w.users.find((u) => u.id === e.authorId)?.name}</dd><dt>Reviewer</dt><dd>{w.users.find((u) => u.id === e.reviewerId)?.name ?? '—'}</dd><dt>P-values</dt><dd>Lognormal spread on contained metal; P10 at 0.68×, P90 at 1.41× of the P50.</dd><dt>Notes</dt><dd>{e.notes}</dd></dl>} />
        </div>
        <div className="grid grid--2">
          <section className="panel panel--flush"><div className="ph"><h2>By category</h2></div>
            <DataTable caption="Resource by category" rows={e.blocks} rowKey={(b) => b.category} cols={[
              { key: 'cat', label: 'Category', render: (b) => <span className="ink">{b.category}</span> },
              { key: 't', label: 'Tonnes', num: true, render: (b) => `${num(b.tonnes, 2)} Mt` },
              { key: 'g', label: `Grade`, num: true, render: (b) => `${grade(b.grade)} ${c.gradeUnit}` },
              { key: 'c', label: 'Contained', num: true, render: (b) => `${num(b.contained)} ${c.metalUnit}` },
              { key: 'v', label: 'Value at deck', num: true, render: (b) => money(b.contained * unitPrice(p.commodity, deck)) },
            ]} foot={<tr><td>Total</td><td className="num">{num(tonnesOf(e), 2)} Mt</td><td className="num">{grade(gradeOf(e))} {c.gradeUnit}</td><td className="num">{num(containedOf(e))} {c.metalUnit}</td><td className="num">{money(valueOf(e, p.commodity, deck))}</td></tr>} /></section>
          <div className="panel"><Columns title="Value sensitivity to price" unit={w.settings.baseCurrency} labels={sens.map((s) => `${s.d > 0 ? '+' : ''}${s.d} %`)} series={[{ name: 'In-situ value', cat: c.cat, values: sens.map((s) => Math.round(s.v)) }]} fmt={(v) => money(v, { compact: true })} width={520} /></div>
        </div>
        <Comments entityType="estimate" entityId={e.id} />
      </div>
      <Dialog open={releaseOpen} onClose={() => setReleaseOpen(false)} title={`Submit ${e.id} for release`} summary="Database sign-off, then QP review, then manager release. The estimate moves to internal review while the workflow runs.">
        <form onSubmit={(ev) => { ev.preventDefault(); submitRelease(); }}><label className="check"><input type="checkbox" required />The block model, drillhole database and QAQC record are archived for this estimate.</label><div className="dlg-act"><button type="button" className="btn" onClick={() => setReleaseOpen(false)}>Cancel</button><button type="submit" className="btn btn--primary">Submit</button></div></form>
      </Dialog>
      <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} title={`Change status of ${e.id}`}>
        <form onSubmit={(ev) => { ev.preventDefault(); const fd = new FormData(ev.currentTarget); dispatch({ type: 'estimate.update', id: e.id, patch: { status: fd.get('status') as ResourceEstimate['status'], reviewerId: String(fd.get('reviewer')) || undefined } }); toast('Status updated'); setStatusOpen(false); }}>
          <label className="field"><span>Status</span><select name="status" defaultValue={e.status}>{['draft', 'internal-review', 'qp-review', 'superseded'].map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="field"><span>Reviewer</span><select name="reviewer" defaultValue={e.reviewerId ?? ''}><option value="">None</option>{w.users.filter((u) => u.active && ['PGEO', 'DBGEO'].includes(u.roleCode)).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></label>
          <p className="faint small">Released is set by the release workflow, not here.</p>
          <div className="dlg-act"><button type="button" className="btn" onClick={() => setStatusOpen(false)}>Cancel</button><button type="submit" className="btn btn--primary">Save</button></div>
        </form>
      </Dialog>
    </>
  );
}

export function Valuation() {
  const w = useStore().state.world;
  const [factor, setFactor] = useState(100);
  const [recovery, setRecovery] = useState(85);
  const rows = w.projects.map((p) => ({ p, e: latestReleased(w.estimates, p.id) })).filter((r) => r.e);
  const deck = (c: CommodityCode) => w.settings.priceDeck.find((d) => d.commodity === c)!;
  const total = rows.reduce((s, r) => s + valueOf(r.e, r.p.commodity, deck(r.p.commodity), factor / 100) * (recovery / 100), 0);
  return (
    <>
      <PageHead title="In-situ value" meta={<><span>{rows.length} released estimates</span><span>deck {w.settings.priceDeck[0].asOf}</span></>} />
      <div className="filters">
        <label className="field"><span>Price factor, % of deck</span><input type="number" min={20} max={300} step={5} value={factor} onChange={(e) => setFactor(Number(e.target.value))} /></label>
        <label className="field"><span>Recovery applied, %</span><input type="number" min={0} max={100} step={1} value={recovery} onChange={(e) => setRecovery(Number(e.target.value))} /></label>
        <span className="ct">Recovered value {money(total, { compact: true })} {w.settings.baseCurrency}</span>
      </div>
      <div className="panel panel--flush"><DataTable caption="Valuation" rows={rows} rowKey={(r) => r.p.id} cols={[
        { key: 'p', label: 'Project', render: (r) => <Link to={`/resources/estimates/${r.e.id}`}>{r.p.name}</Link> },
        { key: 'c', label: 'Commodity', render: (r) => COMMODITY[r.p.commodity].name },
        { key: 'm', label: 'Contained', num: true, render: (r) => `${num(containedOf(r.e))} ${COMMODITY[r.p.commodity].metalUnit}` },
        { key: 'price', label: 'Price used', num: true, render: (r) => `${num(deck(r.p.commodity).value * factor / 100, deck(r.p.commodity).unit.includes('/lb') ? 2 : 0)} ${deck(r.p.commodity).unit}` },
        { key: 'insitu', label: 'In-situ', num: true, render: (r) => money(valueOf(r.e, r.p.commodity, deck(r.p.commodity), factor / 100)) },
        { key: 'rec', label: `Recovered at ${recovery} %`, num: true, render: (r) => money(valueOf(r.e, r.p.commodity, deck(r.p.commodity), factor / 100) * recovery / 100) },
        { key: 'mi', label: 'M + I share', num: true, render: (r) => pct((r.e.blocks.filter((b) => b.category !== 'inferred').reduce((s, b) => s + b.contained, 0) / Math.max(1, containedOf(r.e))) * 100) },
      ]} foot={<tr><td>Total</td><td /><td /><td /><td className="num">{money(rows.reduce((s, r) => s + valueOf(r.e, r.p.commodity, deck(r.p.commodity), factor / 100), 0))}</td><td className="num">{money(total)}</td><td /></tr>} /></div>
      <p className="faint small" style={{ marginTop: 8 }}>A screening figure only. Recovery is applied uniformly; no mining, processing or capital cost is deducted.</p>
    </>
  );
}

export function Forecast() {
  const w = useStore().state.world;
  const rows = w.projects.map((p) => ({ p, e: w.estimates.filter((x) => x.projectId === p.id).sort((a, b) => (a.asOf < b.asOf ? 1 : -1))[0] })).filter((r) => r.e && r.e.status !== 'superseded');
  return (
    <>
      <PageHead title="Forecast" meta={<span>{rows.length} projects with an estimate, latest of any status</span>} />
      <div className="stack">
        <div className="grid grid--2">
          {rows.map((r) => <div className="panel" key={r.p.id}><Columns title={`${r.p.name} · contained ${COMMODITY[r.p.commodity].gradeLabel}`} unit={`k ${COMMODITY[r.p.commodity].metalUnit}`} labels={['P10', 'P50', 'P90']} series={[{ name: r.e.id, cat: COMMODITY[r.p.commodity].cat, values: [r.e.p10, r.e.p50, r.e.p90].map((v) => Math.round(v / 1000)) }]} fmt={(v) => num(v)} width={420} height={180} /></div>)}
        </div>
        <section className="panel panel--flush"><div className="ph"><h2>Forecast table</h2></div>
          <DataTable caption="Forecast" rows={rows} rowKey={(r) => r.p.id} cols={[
            { key: 'p', label: 'Project', render: (r) => <Link to={`/resources/estimates/${r.e.id}`}>{r.p.name}</Link> },
            { key: 'e', label: 'Estimate', render: (r) => <span className="mono">{r.e.id}</span> },
            { key: 's', label: 'Status', render: (r) => <Chip status={r.e.status} /> },
            { key: 'p10', label: 'P10', num: true, render: (r) => num(r.e.p10) }, { key: 'p50', label: 'P50', num: true, render: (r) => num(r.e.p50) }, { key: 'p90', label: 'P90', num: true, render: (r) => num(r.e.p90) },
            { key: 'u', label: 'Unit', render: (r) => COMMODITY[r.p.commodity].metalUnit },
          ]} /></section>
      </div>
    </>
  );
}

export function PriceDeck() {
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const [edit, setEdit] = useState(false);
  return (
    <>
      <PageHead title="Price deck" meta={<><span>{w.settings.priceDeck[0].source}</span><span>as of {w.settings.priceDeck[0].asOf}</span></>} actions={can(me, 'admin.write', w) ? <button type="button" className="btn" onClick={() => setEdit(true)}>Edit deck</button> : null} />
      <div className="panel panel--flush"><DataTable caption="Price deck" rows={w.settings.priceDeck} rowKey={(d) => d.commodity} cols={[
        { key: 'c', label: 'Commodity', render: (d) => <span className="chip"><span className={`sw cat-${COMMODITY[d.commodity].cat}`} aria-hidden="true" />{COMMODITY[d.commodity].name}</span> },
        { key: 'v', label: 'Price', num: true, render: (d) => num(d.value, d.unit.includes('/lb') ? 2 : 0) },
        { key: 'u', label: 'Unit', render: (d) => d.unit },
        { key: 'cut', label: 'Default cut-off', num: true, render: (d) => `${w.settings.cutoffs[d.commodity]} ${COMMODITY[d.commodity].gradeUnit} ${COMMODITY[d.commodity].gradeLabel}` },
        { key: 's', label: 'Source', render: (d) => d.source },
        { key: 'a', label: 'As of', render: (d) => <span className="mono">{date(d.asOf)}</span> },
      ]} /></div>
      <Dialog open={edit} onClose={() => setEdit(false)} title="Edit the price deck" summary="Changes apply to every valuation immediately and are written to the audit log.">
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); dispatch({ type: 'settings.update', patch: { priceDeck: w.settings.priceDeck.map((d) => ({ ...d, value: Number(fd.get(d.commodity)) || d.value, asOf: state.clock.slice(0, 10), source: String(fd.get('source')) || d.source })) } }); toast('Price deck updated'); setEdit(false); }}>
          {w.settings.priceDeck.map((d) => <label className="field" key={d.commodity}><span>{COMMODITY[d.commodity].name}, {d.unit}</span><input type="number" name={d.commodity} step={d.unit.includes('/lb') ? 0.01 : 1} defaultValue={d.value} /></label>)}
          <label className="field"><span>Source</span><input name="source" defaultValue={w.settings.priceDeck[0].source} /></label>
          <div className="dlg-act"><button type="button" className="btn" onClick={() => setEdit(false)}>Cancel</button><button type="submit" className="btn btn--primary">Save deck</button></div>
        </form>
      </Dialog>
    </>
  );
}
