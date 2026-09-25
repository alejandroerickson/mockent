import { useState, type FormEvent } from 'react';
import { Link, useParams, useSearchParams, NavLink, Navigate } from 'react-router-dom';
import { useStore, useMe, can, TODAY } from '../store';
import { STAGES, COMMODITY, COMMODITIES, STAGE_NAME } from '../data/world';
import { money, num, pct, date, relDays, metres as fmtM, grade, count } from '../data/fmt';
import { Chip, PageHead, Slot, Authority, DataTable, Dialog, Comments, type Col } from '../ui/primitives';
import { Star } from '../ui/icons';
import { Columns, Split, Bars } from '../ui/charts';
import { daysBetween } from '../data/rng';
import type { Project, Tenement, Programme, Stage, Approval } from '../data/types';
import { ProjectTable } from './Portfolio';

export function Projects() {
  const [sp] = useSearchParams();
  const { state } = useStore();
  const w = state.world;
  const [q, setQ] = useState('');
  const status = sp.get('status'), commodity = sp.get('commodity'), stage = sp.get('stage');
  let rows = w.projects.filter((p) => (status ? p.status === status : p.status !== 'closed'));
  if (commodity) rows = rows.filter((p) => p.commodity === commodity);
  if (stage) rows = rows.filter((p) => p.stage === stage);
  if (q) rows = rows.filter((p) => `${p.id} ${p.name} ${p.jurisdiction}`.toLowerCase().includes(q.toLowerCase()));
  const cut = [status && `status: ${status}`, commodity && `commodity: ${COMMODITY[commodity as keyof typeof COMMODITY]?.name}`, stage && `stage: ${STAGE_NAME[stage as Stage]}`].filter(Boolean).join(' · ');
  return (
    <>
      <PageHead title="Projects" meta={<><span>{rows.length} of {w.projects.length}</span>{cut ? <span>{cut}</span> : null}</>} actions={<Link className="btn btn--primary" to="/projects/new">New project</Link>} />
      <div className="filters" role="search">
        <label className="field field--wide"><span>Find</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Project id, name or jurisdiction" /></label>
        <span className="ct">{rows.length} projects{cut ? <Link to="/projects" className="btn btn--small">Clear cut</Link> : null}</span>
      </div>
      <div className="panel panel--flush"><ProjectTable rows={rows} /></div>
    </>
  );
}

export function NewProject() {
  const { dispatch, toast } = useStore();
  const w = useStore().state.world;
  const [f, setF] = useState({ name: '', commodity: 'Au', jurisdiction: '', country: 'Canada', area: '', budget: '', geologist: 'u-twierzbicki', description: '' });
  const [err, setErr] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = 'A project needs a name.';
    if (!f.jurisdiction.trim()) er.jurisdiction = 'Enter the jurisdiction.';
    if (!f.area || Number(f.area) <= 0) er.area = 'Area must be more than zero.';
    if (!f.budget || Number(f.budget) < 0) er.budget = 'Enter a budget, or 0 for none.';
    setErr(er);
    if (Object.keys(er).length) return;
    const n = Math.max(...w.projects.map((p) => Number(p.id.slice(4)))) + 1;
    const id = `PRJ-${String(n).padStart(4, '0')}`;
    const project: Project = { id, name: f.name.trim(), commodity: f.commodity as Project['commodity'], jurisdiction: f.jurisdiction.trim(), country: f.country, stage: 'recon', status: 'active', managerId: 'u-mokonkwo', geologistId: f.geologist, areaKm2: Number(f.area), startedOn: TODAY, budget: { planned: Number(f.budget), committed: 0, spent: 0, forecast: Number(f.budget) }, lat: 0, lon: 0, description: f.description.trim(), nextGateOn: undefined, watch: false };
    dispatch({ type: 'project.create', project });
    setDone(id); toast(`Project ${id} created`, `/projects/${id}`);
  };
  if (done) return <Navigate to={`/projects/${done}`} replace />;
  return (
    <>
      <PageHead title="New project" crumbs={[{ to: '/projects', label: 'Projects' }, { label: 'New' }]} />
      <form className="panel stack" onSubmit={submit} noValidate style={{ maxWidth: 720 }}>
        <div className="grid grid--2">
          <label className={`field${err.name ? ' err' : ''}`}><span>Project name</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required aria-invalid={!!err.name} />{err.name ? <span className="error">{err.name}</span> : null}</label>
          <label className="field"><span>Commodity</span><select value={f.commodity} onChange={(e) => setF({ ...f, commodity: e.target.value })}>{COMMODITIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</select></label>
          <label className={`field${err.jurisdiction ? ' err' : ''}`}><span>Jurisdiction</span><input value={f.jurisdiction} onChange={(e) => setF({ ...f, jurisdiction: e.target.value })} placeholder="State, province or region" />{err.jurisdiction ? <span className="error">{err.jurisdiction}</span> : null}</label>
          <label className="field"><span>Country</span><select value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })}>{['Canada', 'United States', 'Australia', 'Chile', 'Finland', 'Argentina'].map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className={`field${err.area ? ' err' : ''}`}><span>Area, km²</span><input type="number" min={0} step={0.1} value={f.area} onChange={(e) => setF({ ...f, area: e.target.value })} />{err.area ? <span className="error">{err.area}</span> : null}</label>
          <label className={`field${err.budget ? ' err' : ''}`}><span>Budget {w.fiscalYear}, {w.settings.baseCurrency}</span><input type="number" min={0} step={1000} value={f.budget} onChange={(e) => setF({ ...f, budget: e.target.value })} />{err.budget ? <span className="error">{err.budget}</span> : null}</label>
          <label className="field"><span>Project geologist</span><select value={f.geologist} onChange={(e) => setF({ ...f, geologist: e.target.value })}>{w.users.filter((u) => u.active && u.roleCode === 'PGEO').map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></label>
        </div>
        <label className="field"><span>Description</span><textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Deposit style, what is known, what the first programme will test" /></label>
        <p className="faint small">New projects start at Reconnaissance with the number the auto-numbering rule assigns ({w.settings.autoNumbering.project}).</p>
        <div className="row row--end"><Link className="btn" to="/projects">Cancel</Link><button className="btn btn--primary" type="submit">Create project</button></div>
      </form>
    </>
  );
}

export function ProjectDetail() {
  const { id, tab = 'overview' } = useParams();
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const p = w.projects.find((x) => x.id === id);
  const [gateOpen, setGateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  if (!p) return <><PageHead title="Project not found" crumbs={[{ to: '/projects', label: 'Projects' }, { label: id }]} /><p className="empty">No project has the id {id}.</p></>;
  const c = COMMODITY[p.commodity];
  const tenements = w.tenements.filter((t) => t.projectId === p.id);
  const programmes = w.programmes.filter((x) => x.projectId === p.id).sort((a, b) => (a.startOn < b.startOn ? 1 : -1));
  const holes = w.holes.filter((h) => h.projectId === p.id);
  const batches = w.batches.filter((b) => b.projectId === p.id);
  const estimates = w.estimates.filter((e) => e.projectId === p.id);
  const approvals = w.approvals.filter((a) => a.projectId === p.id);
  const intercepts = w.intercepts.filter((i) => i.projectId === p.id);
  const geo = w.users.find((u) => u.id === p.geologistId);
  const mgr = w.users.find((u) => u.id === p.managerId);
  const stageIdx = STAGES.findIndex((s) => s.code === p.stage);
  const tabs = [['overview', 'Overview'], ['tenure', `Tenure`, tenements.length], ['programmes', 'Programmes', programmes.length], ['drilling', 'Drilling', holes.length], ['assays', 'Assays', batches.length], ['resource', 'Resource', estimates.length], ['budget', 'Budget'], ['approvals', 'Approvals', approvals.length], ['activity', 'Activity']] as const;
  return (
    <>
      <PageHead crumbs={[{ to: '/projects', label: 'Projects' }, { label: p.id }]} title={p.name} id={p.id}
        meta={<><span className="chip"><span className={`sw cat-${c.cat}`} aria-hidden="true" />{c.name} · {c.depositStyle}</span><span>{p.jurisdiction}, {p.country}</span><Chip status={p.status === 'closed' ? (p.outcome ?? 'closed') : p.status} /><span>{STAGE_NAME[p.stage]}</span>{p.nextGateOn ? <span>gate {date(p.nextGateOn)} ({relDays(p.nextGateOn, TODAY)})</span> : null}</>}
        actions={<>
          <button type="button" className="btn" aria-pressed={p.watch} onClick={() => { dispatch({ type: 'project.watch', id: p.id, watch: !p.watch }); toast(p.watch ? 'Removed from your watch list' : 'Added to your watch list'); }}><Star on={p.watch} />{p.watch ? 'Watching' : 'Watch'}</button>
          {can(me, 'project.write', w) && p.status !== 'closed' ? <button type="button" className="btn" onClick={() => setEditOpen(true)}>Edit</button> : null}
          {can(me, 'gate.decide', w) ? <button type="button" className="btn btn--primary" onClick={() => setGateOpen(true)}>Stage-gate decision</button> : null}
        </>} />
      <nav className="tabs" aria-label="Project sections">
        {tabs.map(([k, label, ct]) => <NavLink key={k} to={`/projects/${p.id}${k === 'overview' ? '' : '/' + k}`} aria-current={tab === k ? 'page' : undefined} end>{label}{ct !== undefined ? <span className="ct">{ct}</span> : null}</NavLink>)}
      </nav>

      {tab === 'overview' && (
        <div className="stack">
          <div className="panel">
            <div className="stamp">
              <Slot label={`Budget ${w.fiscalYear}`} value={money(p.budget.planned)} hero sub={`${pct((p.budget.spent / Math.max(1, p.budget.planned)) * 100, 1)} spent · forecast ${money(p.budget.forecast)}`} />
              <Slot label="Area under tenure" value={num(tenements.reduce((s, t) => s + t.areaKm2, 0), 1)} unit="km²" sub={count(tenements.length, 'tenement')} />
              <Slot label="Holes drilled" value={num(holes.filter((h) => !['planned', 'drilling'].includes(h.status)).length)} sub={`${fmtM(holes.reduce((s, h) => s + h.depth, 0))} total`} />
              <Slot label="Significant intercepts" value={num(intercepts.filter((i) => i.significant).length)} sub={`${c.gradeLabel} above ${c.cutoff} ${c.gradeUnit}`} />
              <Slot label="Latest estimate" value={estimates[0] ? num(estimates[0].blocks.reduce((s, b) => s + b.tonnes, 0), 1) : '—'} unit={estimates[0] ? 'Mt' : undefined} sub={estimates[0] ? `${estimates[0].id} · ${estimates[0].status}` : 'no estimate'} />
            </div>
            <Authority text={`read from ${count(tenements.length, 'tenement')}, ${count(programmes.length, 'programme')}, ${count(holes.length, 'hole')} and ${count(batches.length, 'batch', 'batches')}`} />
          </div>
          <div className="grid grid--2">
            <section className="panel" aria-labelledby="ov-about">
              <h2 id="ov-about">About</h2>
              <p style={{ fontSize: 13, marginBottom: 12 }}>{p.description}</p>
              <dl className="kv">
                <dt>Exploration manager</dt><dd>{mgr?.name}</dd>
                <dt>Project geologist</dt><dd>{geo?.active ? geo.name : <span className="chip chip--dash">vacant since {geo?.lastSignIn.slice(0, 10)}</span>}</dd>
                <dt>Started</dt><dd className="mono">{date(p.startedOn)}</dd>
                {p.closedOn ? <><dt>Closed</dt><dd className="mono">{date(p.closedOn)} · {p.outcome}</dd></> : null}
                <dt>Centroid</dt><dd className="mono">{p.lat.toFixed(2)}°, {p.lon.toFixed(2)}°</dd>
                <dt>Deposit style</dt><dd>{c.depositStyle}</dd>
                <dt>Primary assay</dt><dd>{c.gradeLabel} by {c.method}</dd>
              </dl>
            </section>
            <section className="panel" aria-labelledby="ov-stage">
              <h2 id="ov-stage">Stage history</h2>
              <ol className="steps">
                {STAGES.map((s, i) => <li key={s.code}><span className={`dot ${i < stageIdx ? 'done' : i === stageIdx ? 'now' : ''}`} aria-hidden="true" /><span><span className="n">{s.name}</span><br /><span className="who">{i < stageIdx ? 'passed' : i === stageIdx ? (p.status === 'closed' ? `closed · ${p.outcome}` : 'current stage') : 'not reached'}</span></span><span className="d">{i === stageIdx && p.nextGateOn ? date(p.nextGateOn) : ''}</span></li>)}
              </ol>
            </section>
          </div>
          <div className="grid grid--2">
            <section className="panel" aria-labelledby="ov-prg">
              <div className="ph"><h2 id="ov-prg">Programmes</h2><span className="r"><Link to={`/projects/${p.id}/programmes`}>all {programmes.length}</Link></span></div>
              {programmes.slice(0, 4).map((pr) => <div key={pr.id} className="row row--between" style={{ padding: '6px 0', borderBottom: '1px solid var(--hairline-2)', fontSize: 13 }}><Link to={`/programmes/${pr.id}`} style={{ color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--link-line)' }}>{pr.name}</Link><span className="row"><Chip status={pr.phase} /><span className="mono faint small">{date(pr.startOn)}</span></span></div>)}
            </section>
            <section className="panel" aria-labelledby="ov-open">
              <div className="ph"><h2 id="ov-open">Open items</h2></div>
              {approvals.filter((a) => a.status === 'pending').length === 0 && !batches.some((b) => b.status === 'qaqc-hold') ? <p className="faint small">Nothing open on this project.</p> : null}
              {approvals.filter((a) => a.status === 'pending').map((a) => <div key={a.id} className="row row--between" style={{ padding: '6px 0', borderBottom: '1px solid var(--hairline-2)', fontSize: 13 }}><Link to={`/approvals/${a.id}`} style={{ color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--link-line)' }}>{a.title}</Link><Chip status="pending">{a.steps[a.currentStep].name}</Chip></div>)}
              {batches.filter((b) => b.status === 'qaqc-hold').map((b) => <div key={b.id} className="row row--between" style={{ padding: '6px 0', borderBottom: '1px solid var(--hairline-2)', fontSize: 13 }}><Link to={`/assays/${b.id}`} style={{ color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--link-line)' }}>Batch {b.id}</Link><Chip status="qaqc-hold" /></div>)}
              {tenements.filter((t) => ['expiring', 'renewal-lodged'].includes(t.status)).map((t) => <div key={t.id} className="row row--between" style={{ padding: '6px 0', borderBottom: '1px solid var(--hairline-2)', fontSize: 13 }}><Link to={`/projects/${p.id}/tenure`} style={{ color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--link-line)' }}>Tenement {t.id} expires {relDays(t.expiresOn, TODAY)}</Link><Chip status={t.status} /></div>)}
            </section>
          </div>
          <Comments entityType="project" entityId={p.id} />
        </div>)}

      {tab === 'tenure' && <TenureTab p={p} tenements={tenements} />}
      {tab === 'programmes' && (
        <section className="panel panel--flush" aria-label="Programmes">
          <div className="ph"><h2>Programmes</h2><span className="r">{can(me, 'programme.write', w) ? <Link className="btn btn--small" to={`/programmes/new?project=${p.id}`}>New programme</Link> : null}</span></div>
          <ProgrammeTable rows={programmes} />
        </section>)}
      {tab === 'drilling' && (
        <div className="stack">
          <div className="panel">
            <div className="stamp">
              <Slot label="Holes" value={num(holes.length)} sub={`${holes.filter((h) => h.status === 'planned').length} planned · ${holes.filter((h) => h.status === 'drilling').length} drilling · ${holes.filter((h) => h.status === 'abandoned').length} abandoned`} />
              <Slot label="Metres drilled" value={num(holes.reduce((s, h) => s + h.depth, 0))} unit="m" />
              <Slot label="Average depth" value={num(holes.filter((h) => h.depth).reduce((s, h) => s + h.depth, 0) / Math.max(1, holes.filter((h) => h.depth).length))} unit="m" />
              <Slot label="Best intercept" long value={intercepts.slice().sort((a, b) => b.grade * b.length - a.grade * a.length)[0] ? `${intercepts.slice().sort((a, b) => b.grade * b.length - a.grade * a.length)[0].length} m @ ${grade(intercepts.slice().sort((a, b) => b.grade * b.length - a.grade * a.length)[0].grade)}` : '—'} unit={intercepts.length ? `${c.gradeUnit} ${c.gradeLabel}` : undefined} />
            </div>
          </div>
          <div className="panel panel--flush"><div className="ph"><h2>Drillholes</h2><span className="r"><Link to={`/drilling?project=${p.id}`}>open in Drilling</Link></span></div><HoleTable rows={holes} /></div>
        </div>)}
      {tab === 'assays' && <div className="panel panel--flush"><div className="ph"><h2>Sample batches</h2><span className="r"><Link to={`/assays?project=${p.id}`}>open in Assays</Link></span></div><BatchTable rows={batches} /></div>}
      {tab === 'resource' && <ResourceTab p={p} />}
      {tab === 'budget' && <BudgetTab p={p} programmes={programmes} />}
      {tab === 'approvals' && <div className="panel panel--flush"><div className="ph"><h2>Approvals on this project</h2></div><ApprovalTable rows={approvals} /></div>}
      {tab === 'activity' && <ActivityTab p={p} />}

      <GateDialog p={p} open={gateOpen} onClose={() => setGateOpen(false)} />
      <EditDialog p={p} open={editOpen} onClose={() => setEditOpen(false)} />
    </>
  );
}

function TenureTab({ p, tenements }: { p: Project; tenements: Tenement[] }) {
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const [renew, setRenew] = useState<Tenement | null>(null);
  const cols: Col<Tenement>[] = [
    { key: 'id', label: 'Tenement', sort: (t) => t.id, render: (t) => <span className="mono ink">{t.id}</span> },
    { key: 'type', label: 'Type', sort: (t) => t.type, render: (t) => t.type },
    { key: 'holder', label: 'Holder', render: (t) => t.holder, wrap: true },
    { key: 'status', label: 'Status', sort: (t) => t.status, render: (t) => <Chip status={t.status} /> },
    { key: 'granted', label: 'Granted', sort: (t) => t.grantedOn, render: (t) => <span className="mono">{date(t.grantedOn)}</span> },
    { key: 'expires', label: 'Expires', sort: (t) => t.expiresOn, render: (t) => <span className="mono">{date(t.expiresOn)} <span className="faint">{relDays(t.expiresOn, TODAY)}</span></span> },
    { key: 'area', label: 'Area', num: true, sort: (t) => t.areaKm2, render: (t) => <>{num(t.areaKm2, 1)}<span className="unit">km²</span></> },
    { key: 'commit', label: 'Annual commitment', num: true, sort: (t) => t.annualCommitment, render: (t) => money(t.annualCommitment) },
    { key: 'spent', label: 'Spent against', num: true, sort: (t) => t.spentToDate / t.annualCommitment, render: (t) => <>{money(t.spentToDate)}<span className="bar" aria-hidden="true"><i className={t.spentToDate >= t.annualCommitment ? 'blue' : ''} style={{ width: `${Math.min(100, (t.spentToDate / t.annualCommitment) * 100)}%` }} /></span></> },
    { key: 'rent', label: 'Rent due', num: true, sort: (t) => t.rentDue, render: (t) => money(t.rentDue) },
    { key: 'act', label: <span className="vh">Actions</span>, render: (t) => can(me, 'tenement.write', w) && ['current', 'expiring'].includes(t.status) ? <button type="button" className="btn btn--small" onClick={() => setRenew(t)}>Lodge renewal</button> : null },
  ];
  const submitRenewal = () => {
    if (!renew) return;
    const n = Math.max(...w.approvals.map((a) => Number(a.id.slice(8)))) + 1;
    const def = w.workflows.find((x) => x.type === 'tenement-renewal')!;
    const ap: Approval = { id: `WF-2026-${String(n).padStart(4, '0')}`, type: 'tenement-renewal', title: `Tenement renewal: ${renew.id}, ${p.name}`, projectId: p.id, subjectType: 'tenement', subjectId: renew.id, requestedById: me.id, submittedOn: state.clock.slice(0, 10), dueOn: addDaysStr(state.clock.slice(0, 10), def.steps.reduce((s, x) => s + x.sla, 0)), status: 'pending', steps: def.steps.map((s) => ({ name: s.name, roleCode: s.roleCode, actorId: w.users.find((u) => u.active && u.roleCode === s.roleCode)?.id })), currentStep: 0, summary: `Renewal of ${renew.id} (${renew.type}) expiring ${renew.expiresOn}. Expenditure ${pct((renew.spentToDate / renew.annualCommitment) * 100)} of commitment.` };
    dispatch({ type: 'approval.create', approval: ap });
    dispatch({ type: 'tenement.update', id: renew.id, patch: { status: 'renewal-lodged' } });
    toast(`Renewal ${ap.id} submitted`, `/approvals/${ap.id}`); setRenew(null);
  };
  return (
    <div className="stack">
      <div className="panel">
        <div className="stamp">
          <Slot label="Area under tenure" value={num(tenements.reduce((s, t) => s + t.areaKm2, 0), 1)} unit="km²" hero />
          <Slot label="Tenements" value={num(tenements.length)} sub={`${tenements.filter((t) => t.status === 'current').length} current`} />
          <Slot label="Annual commitment" value={money(tenements.reduce((s, t) => s + t.annualCommitment, 0))} sub={`${money(tenements.reduce((s, t) => s + t.spentToDate, 0))} spent against`} />
          <Slot label="Rent due this year" value={money(tenements.reduce((s, t) => s + t.rentDue, 0))} />
          <Slot label="Next expiry" value={tenements.length ? date(tenements.slice().sort((a, b) => (a.expiresOn < b.expiresOn ? -1 : 1))[0].expiresOn) : '—'} long sub={tenements.length ? relDays(tenements.slice().sort((a, b) => (a.expiresOn < b.expiresOn ? -1 : 1))[0].expiresOn, TODAY) : undefined} />
        </div>
      </div>
      <div className="panel panel--flush"><div className="ph"><h2>Tenements</h2></div><DataTable caption="Tenements" rows={tenements} cols={cols} rowKey={(t) => t.id} defaultSort={{ key: 'expires', dir: 'ascending' }} /></div>
      <Dialog open={!!renew} onClose={() => setRenew(null)} title="Lodge a renewal" summary={renew ? `${renew.id} expires ${date(renew.expiresOn)} (${relDays(renew.expiresOn, TODAY)}).` : ''}>
        <form onSubmit={(e) => { e.preventDefault(); submitRenewal(); }}>
          <dl className="kv kv--well"><dt>Workflow</dt><dd>Tenement renewal: expenditure check (Finance), then lodgement (Tenure)</dd><dt>Expenditure</dt><dd className="mono">{renew ? `${money(renew.spentToDate)} of ${money(renew.annualCommitment)} (${pct((renew.spentToDate / renew.annualCommitment) * 100)})` : ''}</dd></dl>
          {renew && renew.spentToDate < renew.annualCommitment ? <p className="notice notice--dash">Expenditure is below the commitment. Finance will need an exemption or a top-up before lodgement.</p> : null}
          <div className="dlg-act"><button type="button" className="btn" onClick={() => setRenew(null)}>Cancel</button><button type="submit" className="btn btn--primary">Submit for renewal</button></div>
        </form>
      </Dialog>
    </div>
  );
}

function addDaysStr(iso: string, d: number) { const x = new Date(iso + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + d); return x.toISOString().slice(0, 10); }

export function ProgrammeTable({ rows }: { rows: Programme[] }) {
  const w = useStore().state.world;
  const cols: Col<Programme>[] = [
    { key: 'id', label: 'Programme', sort: (r) => r.id, render: (r) => <Link to={`/programmes/${r.id}`}><span className="mono">{r.id}</span></Link> },
    { key: 'name', label: 'Name', sort: (r) => r.name, render: (r) => <Link to={`/programmes/${r.id}`}>{r.name}</Link>, wrap: true },
    { key: 'project', label: 'Project', sort: (r) => w.projects.find((p) => p.id === r.projectId)?.name ?? '', render: (r) => <Link to={`/projects/${r.projectId}`}>{w.projects.find((p) => p.id === r.projectId)?.name}</Link> },
    { key: 'type', label: 'Type', sort: (r) => r.type, render: (r) => r.type },
    { key: 'phase', label: 'Phase', sort: (r) => r.phase, render: (r) => <Chip status={r.phase} /> },
    { key: 'start', label: 'Start', sort: (r) => r.startOn, render: (r) => <span className="mono">{date(r.startOn)}</span> },
    { key: 'end', label: 'End', sort: (r) => r.endOn, render: (r) => <span className="mono">{date(r.endOn)}</span> },
    { key: 'metres', label: 'Metres', sr: 'Metres drilled of planned', num: true, sort: (r) => r.metresDrilled ?? -1, render: (r) => r.metresPlanned ? <>{num(r.metresDrilled ?? 0)} <span className="faint">/ {num(r.metresPlanned)}</span></> : <span className="dash">—</span> },
    { key: 'budget', label: 'Budget', num: true, sort: (r) => r.budget, render: (r) => money(r.budget) },
    { key: 'spent', label: 'Spent', num: true, sort: (r) => r.spent / r.budget, render: (r) => <>{money(r.spent)}<span className="bar" aria-hidden="true"><i className={r.spent > r.budget ? 'red' : ''} style={{ width: `${Math.min(100, (r.spent / Math.max(1, r.budget)) * 100)}%` }} /></span></> },
    { key: 'lead', label: 'Lead', sort: (r) => w.users.find((u) => u.id === r.leadId)?.name ?? '', render: (r) => w.users.find((u) => u.id === r.leadId)?.name },
    { key: 'rig', label: 'Rig', render: (r) => r.rigId ? <span className="mono">{r.rigId}</span> : <span className="dash">—</span> },
  ];
  return <DataTable caption="Programmes" rows={rows} cols={cols} rowKey={(r) => r.id} defaultSort={{ key: 'start', dir: 'descending' }} pageSize={50} />;
}

export function HoleTable({ rows, pageSize = 50 }: { rows: import('../data/types').Drillhole[]; pageSize?: number }) {
  const w = useStore().state.world;
  const cols: Col<import('../data/types').Drillhole>[] = [
    { key: 'id', label: 'Hole', sort: (h) => h.id, render: (h) => <Link to={`/drilling/${h.id}`}><span className="mono">{h.id}</span></Link> },
    { key: 'project', label: 'Project', sort: (h) => h.projectId, render: (h) => <Link to={`/projects/${h.projectId}`}>{w.projects.find((p) => p.id === h.projectId)?.name}</Link> },
    { key: 'prg', label: 'Programme', sort: (h) => h.programmeId, render: (h) => <Link to={`/programmes/${h.programmeId}`}><span className="mono">{h.programmeId}</span></Link> },
    { key: 'type', label: 'Type', sort: (h) => h.type, render: (h) => h.type },
    { key: 'status', label: 'Status', sort: (h) => h.status, render: (h) => <Chip status={h.status} /> },
    { key: 'e', label: 'Easting', num: true, sort: (h) => h.easting, render: (h) => num(h.easting) },
    { key: 'n', label: 'Northing', num: true, sort: (h) => h.northing, render: (h) => num(h.northing) },
    { key: 'rl', label: 'RL', num: true, sort: (h) => h.rl, render: (h) => num(h.rl, 1) },
    { key: 'az', label: 'Azimuth', num: true, sort: (h) => h.azimuth, render: (h) => `${num(h.azimuth)}°` },
    { key: 'dip', label: 'Dip', num: true, sort: (h) => h.dip, render: (h) => `${num(h.dip)}°` },
    { key: 'pd', label: 'Planned', sr: 'Planned depth', num: true, sort: (h) => h.plannedDepth, render: (h) => fmtM(h.plannedDepth) },
    { key: 'd', label: 'Depth', num: true, sort: (h) => h.depth, render: (h) => h.depth ? fmtM(h.depth) : <span className="dash">—</span> },
    { key: 'best', label: 'Best intercept', sort: (h) => h.bestIntercept ?? '', render: (h) => h.bestIntercept ? <span className="mono">{h.bestIntercept}</span> : <span className="dash">—</span> },
    { key: 'done', label: 'Completed', sort: (h) => h.completedOn ?? '', render: (h) => <span className="mono">{date(h.completedOn)}</span> },
  ];
  return <DataTable caption="Drillholes" rows={rows} cols={cols} rowKey={(h) => h.id} pageSize={pageSize} defaultSort={{ key: 'id', dir: 'ascending' }} />;
}

export function BatchTable({ rows }: { rows: import('../data/types').SampleBatch[] }) {
  const w = useStore().state.world;
  const cols: Col<import('../data/types').SampleBatch>[] = [
    { key: 'id', label: 'Batch', sort: (b) => b.id, render: (b) => <Link to={`/assays/${b.id}`}><span className="mono">{b.id}</span></Link> },
    { key: 'project', label: 'Project', sort: (b) => b.projectId, render: (b) => <Link to={`/projects/${b.projectId}`}>{w.projects.find((p) => p.id === b.projectId)?.name}</Link> },
    { key: 'lab', label: 'Laboratory', sort: (b) => b.labId, render: (b) => w.labs.find((l) => l.id === b.labId)?.name },
    { key: 'status', label: 'Status', sort: (b) => b.status, render: (b) => <Chip status={b.status} /> },
    { key: 'holes', label: 'Holes', render: (b) => <span className="mono small">{b.holeIds.join(', ')}</span>, wrap: true },
    { key: 'n', label: 'Samples', num: true, sort: (b) => b.sampleCount, render: (b) => num(b.sampleCount) },
    { key: 'qc', label: 'QAQC', sr: 'QAQC insertions: standards, blanks, duplicates', num: true, render: (b) => <span className="mono">{b.standards} / {b.blanks} / {b.duplicates}</span>, hint: 'Standards / blanks / duplicates' },
    { key: 'fail', label: 'Failures', num: true, sort: (b) => b.failures.length, render: (b) => b.failures.length ? <span className="mono ink">{b.failures.length}</span> : <span className="dash">0</span> },
    { key: 'sub', label: 'Dispatched', sort: (b) => b.submittedOn, render: (b) => <span className="mono">{date(b.submittedOn)}</span> },
    { key: 'rec', label: 'Received', sort: (b) => b.receivedOn ?? '', render: (b) => b.receivedOn ? <span className="mono">{date(b.receivedOn)}</span> : <span className="dash">—</span> },
    { key: 'tat', label: 'Turnaround', num: true, sort: (b) => b.receivedOn ? daysBetween(b.submittedOn, b.receivedOn) : -1, render: (b) => b.receivedOn ? `${daysBetween(b.submittedOn, b.receivedOn)} d` : <span className="dash">—</span> },
    { key: 'method', label: 'Method', render: (b) => <span className="mono small">{b.method}</span> },
  ];
  return <DataTable caption="Sample batches" rows={rows} cols={cols} rowKey={(b) => b.id} pageSize={50} defaultSort={{ key: 'sub', dir: 'descending' }} />;
}

export function ApprovalTable({ rows }: { rows: Approval[] }) {
  const w = useStore().state.world;
  const cols: Col<Approval>[] = [
    { key: 'id', label: 'Request', sort: (a) => a.id, render: (a) => <Link to={`/approvals/${a.id}`}><span className="mono">{a.id}</span></Link> },
    { key: 'title', label: 'Title', sort: (a) => a.title, render: (a) => <Link to={`/approvals/${a.id}`}>{a.title}</Link>, wrap: true },
    { key: 'type', label: 'Workflow', sort: (a) => a.type, render: (a) => w.workflows.find((x) => x.type === a.type)?.name },
    { key: 'status', label: 'Status', sort: (a) => a.status, render: (a) => <Chip status={a.status} /> },
    { key: 'step', label: 'Current step', render: (a) => a.status === 'pending' ? `${a.steps[a.currentStep].name} · ${w.roles.find((r) => r.code === a.steps[a.currentStep].roleCode)?.name}` : <span className="dash">—</span> },
    { key: 'by', label: 'Requested by', sort: (a) => a.requestedById, render: (a) => w.users.find((u) => u.id === a.requestedById)?.name },
    { key: 'amount', label: 'Amount', num: true, sort: (a) => a.amount ?? -1, render: (a) => a.amount !== undefined ? money(a.amount) : <span className="dash">—</span> },
    { key: 'sub', label: 'Submitted', sort: (a) => a.submittedOn, render: (a) => <span className="mono">{date(a.submittedOn)}</span> },
    { key: 'due', label: 'Due', sort: (a) => a.dueOn, render: (a) => <span className="mono">{date(a.dueOn)}{a.status === 'pending' && a.dueOn < TODAY ? <span className="chip chip--dash" style={{ marginLeft: 6 }}>overdue</span> : null}</span> },
  ];
  return <DataTable caption="Approvals" rows={rows} cols={cols} rowKey={(a) => a.id} defaultSort={{ key: 'due', dir: 'ascending' }} pageSize={50} />;
}

function ResourceTab({ p }: { p: Project }) {
  const w = useStore().state.world;
  const c = COMMODITY[p.commodity];
  const ests = w.estimates.filter((e) => e.projectId === p.id).sort((a, b) => (a.asOf < b.asOf ? 1 : -1));
  if (!ests.length) return <p className="empty">No resource estimate has been made for {p.name}. Estimates are created in Resources once drilling supports one.</p>;
  const latest = ests.find((e) => e.status === 'released') ?? ests[0];
  const deck = w.settings.priceDeck.find((d) => d.commodity === p.commodity)!;
  const total = latest.blocks.reduce((s, b) => s + b.contained, 0);
  return (
    <div className="stack">
      <div className="panel">
        <div className="ph"><h2>{latest.id} · {latest.status.replace('-', ' ')}</h2><span className="r">as of {date(latest.asOf)} · cut-off {latest.cutoff} {c.gradeUnit} {c.gradeLabel} · {latest.method}</span></div>
        <div className="stamp">
          <Slot label={`Contained ${c.gradeLabel}`} value={num(total)} unit={c.metalUnit} hero />
          <Slot label="Tonnes" value={num(latest.blocks.reduce((s, b) => s + b.tonnes, 0), 1)} unit="Mt" />
          <Slot label="Grade" value={grade(latest.blocks.reduce((s, b) => s + b.tonnes * b.grade, 0) / latest.blocks.reduce((s, b) => s + b.tonnes, 0))} unit={`${c.gradeUnit} ${c.gradeLabel}`} />
          <Slot label="In-situ value at deck" value={money(total * deck.value * (deck.unit.includes('/lb') ? 2204.62 : 1), { compact: true })} unit={w.settings.baseCurrency} sub={`${deck.value.toLocaleString('en-CA')} ${deck.unit}`} />
          <Slot label="Forecast P10 / P50 / P90" long value={`${num(latest.p10 / 1000)} / ${num(latest.p50 / 1000)} / ${num(latest.p90 / 1000)}`} unit={`k ${c.metalUnit}`} />
        </div>
        <Split parts={latest.blocks.map((b) => ({ label: b.category, value: b.contained, ink: b.category === 'measured', cat: b.category === 'indicated' ? 7 : undefined, hollow: b.category === 'inferred' }))} fmt={(v) => `${num(v)} ${c.metalUnit}`} />
        <Authority text={`computed by ADIT from ${latest.id}, ${w.holes.filter((h) => h.projectId === p.id && h.status === 'assayed').length} assayed holes, price deck ${deck.asOf}`} detail={<dl className="kv"><dt>Method</dt><dd>{latest.method}</dd><dt>Author</dt><dd>{w.users.find((u) => u.id === latest.authorId)?.name}</dd><dt>Reviewer</dt><dd>{w.users.find((u) => u.id === latest.reviewerId)?.name ?? '—'}</dd><dt>Notes</dt><dd>{latest.notes}</dd></dl>} />
      </div>
      <div className="panel panel--flush"><div className="ph"><h2>Estimates</h2><span className="r"><Link to={`/resources/estimates?project=${p.id}`}>open in Resources</Link></span></div>
        <DataTable caption="Estimates" rows={ests} rowKey={(e) => e.id} cols={[
          { key: 'id', label: 'Estimate', render: (e) => <Link to={`/resources/estimates/${e.id}`}><span className="mono">{e.id}</span></Link> },
          { key: 'asof', label: 'As of', render: (e) => <span className="mono">{date(e.asOf)}</span> },
          { key: 'status', label: 'Status', render: (e) => <Chip status={e.status} /> },
          { key: 't', label: 'Tonnes', num: true, render: (e) => `${num(e.blocks.reduce((s, b) => s + b.tonnes, 0), 1)} Mt` },
          { key: 'g', label: `Grade`, num: true, render: (e) => `${grade(e.blocks.reduce((s, b) => s + b.tonnes * b.grade, 0) / e.blocks.reduce((s, b) => s + b.tonnes, 0))} ${c.gradeUnit}` },
          { key: 'c', label: 'Contained', num: true, render: (e) => `${num(e.blocks.reduce((s, b) => s + b.contained, 0))} ${c.metalUnit}` },
          { key: 'cat', label: 'Categories', render: (e) => e.blocks.map((b) => b.category).join(' + ') },
          { key: 'a', label: 'Author', render: (e) => w.users.find((u) => u.id === e.authorId)?.name },
        ]} /></div>
    </div>
  );
}

function BudgetTab({ p, programmes }: { p: Project; programmes: Programme[] }) {
  const w = useStore().state.world;
  const byType = ['drilling', 'geophysics', 'geochem', 'mapping', 'metallurgy', 'baseline'].map((t, i) => ({ label: t, value: programmes.filter((x) => x.type === t).reduce((s, x) => s + x.budget, 0), cat: i }));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const spend = months.map((_, i) => { const m = `2026-${String(i + 1).padStart(2, '0')}`; return programmes.filter((x) => x.startOn <= m + '-31' && x.endOn >= m + '-01').reduce((s, x) => s + x.spent / Math.max(1, Math.round(daysBetween(x.startOn, x.endOn) / 30)), 0); });
  const planM = months.map((_, i) => { const m = `2026-${String(i + 1).padStart(2, '0')}`; return programmes.filter((x) => x.startOn <= m + '-31' && x.endOn >= m + '-01').reduce((s, x) => s + x.budget / Math.max(1, Math.round(daysBetween(x.startOn, x.endOn) / 30)), 0); });
  return (
    <div className="stack">
      <div className="panel">
        <div className="stamp">
          <Slot label="Approved budget" value={money(p.budget.planned)} hero />
          <Slot label="Committed" value={money(p.budget.committed)} sub={pct((p.budget.committed / Math.max(1, p.budget.planned)) * 100, 1)} />
          <Slot label="Spent" value={money(p.budget.spent)} sub={pct((p.budget.spent / Math.max(1, p.budget.planned)) * 100, 1)} />
          <Slot label="Forecast" value={money(p.budget.forecast)} sub={<span className={p.budget.forecast > p.budget.planned ? 'neg' : 'pos'}>{p.budget.forecast > p.budget.planned ? '+' : '−'}{money(Math.abs(p.budget.forecast - p.budget.planned))} vs budget</span>} />
          <Slot label="Programme budgets" value={money(programmes.reduce((s, x) => s + x.budget, 0))} sub={`${programmes.length} programmes, all years`} />
        </div>
        <Authority text={`read from the project ledger and ${count(programmes.length, 'programme budget')}`} />
      </div>
      <div className="grid grid--2">
        <div className="panel"><Columns title="Spend by month against plan" unit={w.settings.baseCurrency} labels={months} series={[{ name: 'Spent', cat: COMMODITY[p.commodity].cat, values: spend.map((v) => Math.round(v)) }]} plan={planM.map((v) => Math.round(v))} fmt={(v) => money(v, { compact: true })} width={560} /></div>
        <div className="panel"><Bars title="Programme budget by type" unit={w.settings.baseCurrency} rows={byType.filter((b) => b.value > 0)} fmt={(v) => money(v, { compact: true })} width={560} /></div>
      </div>
      <div className="panel panel--flush"><div className="ph"><h2>Programme ledgers</h2></div><ProgrammeTable rows={programmes} /></div>
    </div>
  );
}

function ActivityTab({ p }: { p: Project }) {
  const w = useStore().state.world;
  const ids = new Set([p.id, ...w.programmes.filter((x) => x.projectId === p.id).map((x) => x.id), ...w.approvals.filter((a) => a.projectId === p.id).map((a) => a.id), ...w.batches.filter((b) => b.projectId === p.id).map((b) => b.id), ...w.estimates.filter((e) => e.projectId === p.id).map((e) => e.id), ...w.tenements.filter((t) => t.projectId === p.id).map((t) => t.id)]);
  const rows = w.audit.filter((a) => ids.has(a.entityId));
  return (
    <div className="panel panel--flush"><div className="ph"><h2>Activity</h2><span className="r">{rows.length} entries</span></div>
      <DataTable caption="Activity" rows={rows} rowKey={(a) => a.id} pageSize={50} cols={[
        { key: 'at', label: 'When', render: (a) => <span className="mono">{a.at.slice(0, 16).replace('T', ' ')}</span> },
        { key: 'who', label: 'Who', render: (a) => w.users.find((u) => u.id === a.userId)?.name ?? a.userId },
        { key: 'action', label: 'Action', render: (a) => <span className="mono">{a.action}</span> },
        { key: 'ent', label: 'Record', render: (a) => <span className="mono">{a.entityType} {a.entityId}</span> },
        { key: 'detail', label: 'Detail', render: (a) => a.detail, wrap: true },
      ]} /></div>
  );
}

function GateDialog({ p, open, onClose }: { p: Project; open: boolean; onClose: () => void }) {
  const { dispatch, toast } = useStore();
  const idx = STAGES.findIndex((s) => s.code === p.stage);
  const next = STAGES[idx + 1];
  const [decision, setDecision] = useState<'advance' | 'hold' | 'relinquish' | 'resume'>(p.status === 'on-hold' ? 'resume' : 'advance');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (note.trim().length < 20) { setErr('Record the reasoning for the decision (at least 20 characters). It is written to the audit log.'); return; }
    dispatch({ type: 'project.gate', id: p.id, decision, toStage: decision === 'advance' ? next?.code : undefined, note: note.trim() });
    toast(`Stage-gate decision recorded for ${p.name}`); onClose(); setNote(''); setErr('');
  };
  return (
    <Dialog open={open} onClose={onClose} title={`Stage-gate decision · ${p.name}`} summary={`Currently at ${STAGE_NAME[p.stage]}${p.status === 'on-hold' ? ' (on hold)' : ''}. The decision is recorded against the project and notifies the project team.`}>
      <form onSubmit={submit} noValidate>
        <fieldset>
          <legend>Decision</legend>
          <div className="stack stack--tight">
            {p.status === 'on-hold' ? <label className="check"><input type="radio" name="gate" checked={decision === 'resume'} onChange={() => setDecision('resume')} />Resume the project at {STAGE_NAME[p.stage]}</label> : null}
            <label className="check"><input type="radio" name="gate" checked={decision === 'advance'} onChange={() => setDecision('advance')} />{next ? `Advance to ${next.name}` : 'Advance to pre-feasibility and hand over to the development group (closes exploration)'}</label>
            {p.status !== 'on-hold' ? <label className="check"><input type="radio" name="gate" checked={decision === 'hold'} onChange={() => setDecision('hold')} />Place on hold at {STAGE_NAME[p.stage]}</label> : null}
            <label className="check"><input type="radio" name="gate" checked={decision === 'relinquish'} onChange={() => setDecision('relinquish')} />Relinquish and close the project</label>
          </div>
        </fieldset>
        <label className={`field${err ? ' err' : ''}`}><span>Reasoning</span><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What the results showed and why this is the decision" aria-invalid={!!err} />{err ? <span className="error">{err}</span> : <span className="hint">Written to the audit log verbatim.</span>}</label>
        {decision === 'relinquish' ? <p className="notice notice--dash">Relinquishing closes the project, lapses its tenements at the next expiry and makes its records read-only. This cannot be undone from the application.</p> : null}
        <div className="dlg-act"><button type="button" className="btn" onClick={onClose}>Cancel</button><button type="submit" className={`btn ${decision === 'relinquish' ? 'btn--danger' : 'btn--primary'}`}>Record decision</button></div>
      </form>
    </Dialog>
  );
}

function EditDialog({ p, open, onClose }: { p: Project; open: boolean; onClose: () => void }) {
  const { state, dispatch, toast } = useStore();
  const w = state.world;
  const [f, setF] = useState({ name: p.name, description: p.description, geologistId: p.geologistId, nextGateOn: p.nextGateOn ?? '', forecast: String(p.budget.forecast) });
  const submit = (e: FormEvent) => { e.preventDefault(); dispatch({ type: 'project.update', id: p.id, patch: { name: f.name.trim() || p.name, description: f.description, geologistId: f.geologistId, nextGateOn: f.nextGateOn || undefined, budget: { ...p.budget, forecast: Number(f.forecast) || p.budget.forecast } } }); toast('Project saved'); onClose(); };
  return (
    <Dialog open={open} onClose={onClose} title={`Edit ${p.id}`}>
      <form onSubmit={submit}>
        <label className="field"><span>Name</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></label>
        <label className="field"><span>Project geologist</span><select value={f.geologistId} onChange={(e) => setF({ ...f, geologistId: e.target.value })}>{w.users.filter((u) => u.roleCode === 'PGEO').map((u) => <option key={u.id} value={u.id} disabled={!u.active}>{u.name}{u.active ? '' : ' (inactive)'}</option>)}</select></label>
        <div className="grid grid--2">
          <label className="field"><span>Next gate</span><input type="date" value={f.nextGateOn} onChange={(e) => setF({ ...f, nextGateOn: e.target.value })} /></label>
          <label className="field"><span>Forecast at year end, {w.settings.baseCurrency}</span><input type="number" step={1000} value={f.forecast} onChange={(e) => setF({ ...f, forecast: e.target.value })} /></label>
        </div>
        <label className="field"><span>Description</span><textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></label>
        <div className="dlg-act"><button type="button" className="btn" onClick={onClose}>Cancel</button><button type="submit" className="btn btn--primary">Save</button></div>
      </form>
    </Dialog>
  );
}
