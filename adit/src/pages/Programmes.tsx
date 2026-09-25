import { useState, type FormEvent } from 'react';
import { Link, useParams, useSearchParams, NavLink, Navigate } from 'react-router-dom';
import { useStore, useMe, can, TODAY } from '../store';
import { FIELD_STAFF, COMMODITY } from '../data/world';
import { money, num, pct, date, relDays, metres as fmtM, count } from '../data/fmt';
import { Chip, PageHead, Slot, Authority, DataTable, Dialog, Comments, type Col } from '../ui/primitives';
import { daysBetween, addDays } from '../data/rng';
import type { Programme, CrewAssignment, LogisticsItem, Rig, Camp, Approval } from '../data/types';
import { ProgrammeTable, HoleTable } from './Projects';

const PHASES: Programme['phase'][] = ['draft', 'scoped', 'costed', 'approved', 'mobilising', 'in-progress', 'demobilising', 'complete', 'cancelled'];
const TYPES: Programme['type'][] = ['drilling', 'geophysics', 'geochem', 'mapping', 'metallurgy', 'baseline'];
export const PERSON = (id: string, users: { id: string; name: string }[]) => users.find((u) => u.id === id)?.name ?? FIELD_STAFF.find((f) => f.id === id)?.name ?? id;

export function Programmes() {
  const [sp] = useSearchParams();
  const { state } = useStore();
  const w = state.world;
  const phase = sp.get('phase'), type = sp.get('type'), project = sp.get('project');
  let rows = w.programmes;
  if (!phase) rows = rows.filter((p) => ['mobilising', 'in-progress', 'demobilising'].includes(p.phase));
  else if (phase === 'planning') rows = rows.filter((p) => ['draft', 'scoped', 'costed', 'approved'].includes(p.phase));
  else if (phase !== 'all') rows = rows.filter((p) => p.phase === phase);
  if (type) rows = rows.filter((p) => p.type === type);
  if (project) rows = rows.filter((p) => p.projectId === project);
  const cutName = !phase ? 'in the field' : phase === 'planning' ? 'in planning' : phase === 'all' ? 'all' : phase;
  return (
    <>
      <PageHead title="Programmes" meta={<><span>{rows.length} programmes · {cutName}</span>{project ? <span>project {project}</span> : null}</>} actions={<Link className="btn btn--primary" to="/programmes/new">New programme</Link>} />
      <div className="filters">
        <fieldset><legend>Type</legend><div className="pills">{TYPES.map((t) => <label key={t}><input type="radio" name="type" checked={type === t} onChange={() => { }} onClick={() => { window.location.hash = `#/programmes?${new URLSearchParams({ ...(phase ? { phase } : {}), ...(type === t ? {} : { type: t }) }).toString()}`; }} />{t}</label>)}</div></fieldset>
        <span className="ct">{rows.length} programmes · {money(rows.reduce((s, p) => s + p.budget, 0))} budget{type || project ? <Link className="btn btn--small" to={phase ? `/programmes?phase=${phase}` : '/programmes'}>Clear</Link> : null}</span>
      </div>
      <div className="panel panel--flush"><ProgrammeTable rows={rows} /></div>
    </>
  );
}

export function Schedule() {
  const w = useStore().state.world;
  const from = '2026-01-01', to = '2027-06-30';
  const span = daysBetween(from, to);
  const rows = w.programmes.filter((p) => p.endOn >= from && p.startOn <= to && p.phase !== 'cancelled').sort((a, b) => (a.startOn < b.startOn ? -1 : 1));
  const months: string[] = [];
  for (let d = new Date(from + 'T00:00:00Z'); d.toISOString().slice(0, 10) <= to; d.setUTCMonth(d.getUTCMonth() + 1)) months.push(d.toISOString().slice(0, 7));
  return (
    <>
      <PageHead title="Programme schedule" meta={<><span>{date(from)} to {date(to)}</span><span>{rows.length} programmes</span></>} />
      <div className="panel" style={{ overflowX: 'auto' }}>
        <div className="gantt" role="table" aria-label="Programme schedule" style={{ minWidth: 900 }}>
          <div className="r hd" role="row"><span role="columnheader">Programme</span><span role="columnheader" className="months">{months.map((m) => <span key={m}>{m.slice(2).replace('-', '/')}</span>)}</span></div>
          {rows.map((p) => {
            const l = (Math.max(0, daysBetween(from, p.startOn)) / span) * 100, r = (Math.min(span, daysBetween(from, p.endOn)) / span) * 100;
            const on = ['mobilising', 'in-progress', 'demobilising'].includes(p.phase);
            const plan = ['draft', 'scoped', 'costed', 'approved'].includes(p.phase);
            return <div className="r" role="row" key={p.id}><span className="n" role="cell"><Link to={`/programmes/${p.id}`}>{p.name}</Link> <span className="faint">· {w.projects.find((x) => x.id === p.projectId)?.name}</span></span><span className="bar-w" role="cell" aria-label={`${date(p.startOn)} to ${date(p.endOn)}, ${p.phase}`}><i className={on ? 'on' : plan ? 'plan' : ''} style={{ left: `${l}%`, width: `${Math.max(0.5, r - l)}%` }} title={`${p.phase}: ${date(p.startOn)} – ${date(p.endOn)}`} /><span className="today" style={{ left: `${(daysBetween(from, TODAY) / span) * 100}%` }} aria-hidden="true" /></span></div>;
          })}
        </div>
        <ul className="legend"><li><span className="sw" style={{ background: 'var(--ink)' }} aria-hidden="true" />In the field</li><li><span className="sw" style={{ background: 'var(--muted)' }} aria-hidden="true" />Complete</li><li><span className="sw hollow" style={{ borderRadius: 2 }} aria-hidden="true" />Planned</li><li><span className="sw" style={{ border: '1px dashed var(--blue)', width: 0, height: 11 }} aria-hidden="true" />Today</li></ul>
      </div>
    </>
  );
}

export function Rigs() {
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const [edit, setEdit] = useState<Rig | null>(null);
  const cols: Col<Rig>[] = [
    { key: 'id', label: 'Rig', sort: (r) => r.id, render: (r) => <span className="mono ink">{r.id}</span> },
    { key: 'name', label: 'Name', sort: (r) => r.name, render: (r) => r.name },
    { key: 'contractor', label: 'Contractor', sort: (r) => r.contractor, render: (r) => r.contractor },
    { key: 'type', label: 'Type', sort: (r) => r.type, render: (r) => r.type },
    { key: 'cap', label: 'Capacity', num: true, sort: (r) => r.capacityM, render: (r) => fmtM(r.capacityM) },
    { key: 'rate', label: 'Day rate', num: true, sort: (r) => r.dayRate, render: (r) => money(r.dayRate) },
    { key: 'status', label: 'Status', sort: (r) => r.status, render: (r) => <Chip status={r.status} /> },
    { key: 'prg', label: 'Programme', render: (r) => { const p = w.programmes.find((x) => x.rigId === r.id && ['approved', 'mobilising', 'in-progress', 'demobilising'].includes(x.phase)); return p ? <Link to={`/programmes/${p.id}`}>{p.name}</Link> : <span className="dash">—</span>; } },
    { key: 'loc', label: 'Location', render: (r) => r.location },
    { key: 'act', label: <span className="vh">Actions</span>, render: (r) => can(me, 'logistics.write', w) ? <button type="button" className="btn btn--small" onClick={() => setEdit(r)}>Update</button> : null },
  ];
  return (
    <>
      <PageHead title="Rigs" meta={<><span>{w.rigs.length} rigs</span><span>{w.rigs.filter((r) => r.status === 'assigned').length} assigned · {w.rigs.filter((r) => r.status === 'available').length} available</span></>} />
      <div className="panel panel--flush"><DataTable caption="Rigs" rows={w.rigs} cols={cols} rowKey={(r) => r.id} /></div>
      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit ? `Update ${edit.id}` : ''}>
        {edit ? <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const rigs = w.rigs.map((r) => (r.id === edit.id ? { ...r, status: fd.get('status') as Rig['status'], location: String(fd.get('location')) } : r)); dispatch({ type: 'rigs.set', rigs }); toast(`${edit.id} updated`); setEdit(null); }}>
          <label className="field"><span>Status</span><select name="status" defaultValue={edit.status}>{['available', 'assigned', 'maintenance', 'demobilised'].map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="field"><span>Location</span><input name="location" defaultValue={edit.location} /></label>
          <div className="dlg-act"><button type="button" className="btn" onClick={() => setEdit(null)}>Cancel</button><button type="submit" className="btn btn--primary">Save</button></div>
        </form> : null}
      </Dialog>
    </>
  );
}

export function Camps() {
  const w = useStore().state.world;
  const cols: Col<Camp>[] = [
    { key: 'id', label: 'Camp', sort: (c) => c.id, render: (c) => <span className="mono ink">{c.id}</span> },
    { key: 'name', label: 'Name', render: (c) => c.name },
    { key: 'project', label: 'Project', render: (c) => <Link to={`/projects/${c.projectId}`}>{w.projects.find((p) => p.id === c.projectId)?.name}</Link> },
    { key: 'status', label: 'Status', render: (c) => <Chip status={c.status} /> },
    { key: 'beds', label: 'Beds', num: true, render: (c) => num(c.beds) },
    { key: 'occ', label: 'Occupied', num: true, render: (c) => <>{num(c.occupied)}<span className="bar" aria-hidden="true"><i style={{ width: `${c.beds ? (c.occupied / c.beds) * 100 : 0}%` }} /></span></> },
    { key: 'medic', label: 'Medic', render: (c) => c.medic ? 'on site' : <span className="chip chip--dash">none</span> },
    { key: 'access', label: 'Access', render: (c) => c.access, wrap: true },
  ];
  return (
    <>
      <PageHead title="Camps" meta={<span>{w.camps.length} camps · {w.camps.reduce((s, c) => s + c.occupied, 0)} of {w.camps.reduce((s, c) => s + c.beds, 0)} beds occupied</span>} />
      <div className="panel panel--flush"><DataTable caption="Camps" rows={w.camps} cols={cols} rowKey={(c) => c.id} /></div>
    </>
  );
}

export function CrewRotations() {
  const w = useStore().state.world;
  const rows = w.programmes.filter((p) => ['mobilising', 'in-progress', 'demobilising', 'approved'].includes(p.phase)).flatMap((p) => p.crew.map((c) => ({ ...c, programme: p })));
  const soon = rows.filter((r) => r.to >= TODAY && daysBetween(TODAY, r.to) <= 10);
  return (
    <>
      <PageHead title="Crew rotations" meta={<><span>{rows.length} assignments on {new Set(rows.map((r) => r.programme.id)).size} programmes</span><span>{soon.length} rotations end within 10 days</span></>} />
      <div className="panel panel--flush"><DataTable caption="Crew rotations" rows={rows} rowKey={(r) => `${r.programme.id}-${r.personId}-${r.from}`} pageSize={50} defaultSort={{ key: 'to', dir: 'ascending' }} cols={[
        { key: 'who', label: 'Person', sort: (r) => PERSON(r.personId, w.users), render: (r) => PERSON(r.personId, w.users) },
        { key: 'role', label: 'Role', sort: (r) => r.role, render: (r) => r.role },
        { key: 'prg', label: 'Programme', sort: (r) => r.programme.name, render: (r) => <Link to={`/programmes/${r.programme.id}`}>{r.programme.name}</Link>, wrap: true },
        { key: 'project', label: 'Project', render: (r) => w.projects.find((p) => p.id === r.programme.projectId)?.name },
        { key: 'from', label: 'From', sort: (r) => r.from, render: (r) => <span className="mono">{date(r.from)}</span> },
        { key: 'to', label: 'To', sort: (r) => r.to, render: (r) => <span className="mono">{date(r.to)} <span className="faint">{relDays(r.to, TODAY)}</span></span> },
        { key: 'state', label: 'State', render: (r) => <Chip status={r.to < TODAY ? 'complete' : r.from > TODAY ? 'planned' : 'in-progress'}>{r.to < TODAY ? 'ended' : r.from > TODAY ? 'upcoming' : 'on site'}</Chip> },
      ]} /></div>
    </>
  );
}

export function NewProgramme() {
  const [sp] = useSearchParams();
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const [f, setF] = useState({ projectId: sp.get('project') ?? w.projects.filter((p) => p.status === 'active')[0].id, type: 'drilling', name: '', objective: '', startOn: addDays(TODAY, 60), endOn: addDays(TODAY, 120), budget: '', metres: '', holes: '', rigId: '' });
  const [err, setErr] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = 'Name the programme.';
    if (!f.objective.trim()) er.objective = 'State the objective; it goes on the approval.';
    if (f.endOn <= f.startOn) er.endOn = 'End must be after start.';
    if (!f.budget || Number(f.budget) <= 0) er.budget = 'Enter a budget above zero.';
    if (f.type === 'drilling' && (!f.metres || Number(f.metres) <= 0)) er.metres = 'A drilling programme needs planned metres.';
    setErr(er); if (Object.keys(er).length) return;
    const year = f.startOn.slice(0, 4);
    const n = Math.max(0, ...w.programmes.filter((p) => p.id.startsWith(`PRG-${year}`)).map((p) => Number(p.id.slice(9)))) + 1;
    const id = `PRG-${year}-${String(n).padStart(3, '0')}`;
    const prg: Programme = { id, projectId: f.projectId, type: f.type as Programme['type'], name: f.name.trim(), phase: 'draft', startOn: f.startOn, endOn: f.endOn, budget: Number(f.budget), spent: 0, metresPlanned: f.type === 'drilling' ? Number(f.metres) : undefined, holesPlanned: f.type === 'drilling' && f.holes ? Number(f.holes) : undefined, rigId: f.rigId || undefined, campId: w.camps.find((c) => c.projectId === f.projectId)?.id, crew: [], logistics: [], objective: f.objective.trim(), leadId: me.id };
    dispatch({ type: 'programme.create', programme: prg });
    toast(`Programme ${id} created as a draft`, `/programmes/${id}`); setDone(id);
  };
  if (done) return <Navigate to={`/programmes/${done}`} replace />;
  return (
    <>
      <PageHead title="New programme" crumbs={[{ to: '/programmes', label: 'Programmes' }, { label: 'New' }]} />
      <form className="panel stack" onSubmit={submit} noValidate style={{ maxWidth: 760 }}>
        <div className="grid grid--2">
          <label className="field"><span>Project</span><select value={f.projectId} onChange={(e) => setF({ ...f, projectId: e.target.value })}>{w.projects.filter((p) => p.status !== 'closed').map((p) => <option key={p.id} value={p.id}>{p.id} · {p.name}</option>)}</select></label>
          <label className="field"><span>Type</span><select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label className={`field${err.name ? ' err' : ''}`} style={{ gridColumn: '1 / -1' }}><span>Name</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Phase, method and target, e.g. Phase 2 RC, southern blocks" />{err.name ? <span className="error">{err.name}</span> : null}</label>
          <label className={`field${err.objective ? ' err' : ''}`} style={{ gridColumn: '1 / -1' }}><span>Objective</span><textarea value={f.objective} onChange={(e) => setF({ ...f, objective: e.target.value })} />{err.objective ? <span className="error">{err.objective}</span> : null}</label>
          <label className="field"><span>Start</span><input type="date" value={f.startOn} onChange={(e) => setF({ ...f, startOn: e.target.value })} /></label>
          <label className={`field${err.endOn ? ' err' : ''}`}><span>End</span><input type="date" value={f.endOn} onChange={(e) => setF({ ...f, endOn: e.target.value })} />{err.endOn ? <span className="error">{err.endOn}</span> : null}</label>
          <label className={`field${err.budget ? ' err' : ''}`}><span>Budget, {w.settings.baseCurrency}</span><input type="number" min={0} step={1000} value={f.budget} onChange={(e) => setF({ ...f, budget: e.target.value })} />{err.budget ? <span className="error">{err.budget}</span> : null}</label>
          {f.type === 'drilling' ? <>
            <label className={`field${err.metres ? ' err' : ''}`}><span>Planned metres</span><input type="number" min={0} value={f.metres} onChange={(e) => setF({ ...f, metres: e.target.value })} />{err.metres ? <span className="error">{err.metres}</span> : null}</label>
            <label className="field"><span>Planned holes</span><input type="number" min={0} value={f.holes} onChange={(e) => setF({ ...f, holes: e.target.value })} /></label>
            <label className="field"><span>Rig</span><select value={f.rigId} onChange={(e) => setF({ ...f, rigId: e.target.value })}><option value="">Not yet assigned</option>{w.rigs.map((r) => <option key={r.id} value={r.id} disabled={r.status === 'demobilised'}>{r.id} · {r.name} ({r.status})</option>)}</select></label>
          </> : null}
        </div>
        <p className="faint small">Programmes start as drafts. Scope, cost and submit for approval from the programme page; the approval workflow is Technical review → Budget check → Manager approval.</p>
        <div className="row row--end"><Link className="btn" to="/programmes">Cancel</Link><button className="btn btn--primary" type="submit">Create draft</button></div>
      </form>
    </>
  );
}

export function ProgrammeDetail() {
  const { id, tab = 'overview' } = useParams();
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const prg = w.programmes.find((x) => x.id === id);
  const [crewOpen, setCrewOpen] = useState(false);
  const [logOpen, setLogOpen] = useState<LogisticsItem | 'new' | null>(null);
  const [phaseOpen, setPhaseOpen] = useState(false);
  if (!prg) return <><PageHead title="Programme not found" crumbs={[{ to: '/programmes', label: 'Programmes' }, { label: id }]} /><p className="empty">No programme has the id {id}.</p></>;
  const p = w.projects.find((x) => x.id === prg.projectId)!;
  const holes = w.holes.filter((h) => h.programmeId === prg.id);
  const approval = w.approvals.find((a) => a.id === prg.approvalId);
  const rig = w.rigs.find((r) => r.id === prg.rigId);
  const camp = w.camps.find((c) => c.id === prg.campId);
  const days = daysBetween(prg.startOn, prg.endOn);
  const elapsed = Math.max(0, Math.min(days, daysBetween(prg.startOn, TODAY)));
  const tabs = [['overview', 'Overview'], ['crew', 'Crew', prg.crew.length], ['logistics', 'Logistics', prg.logistics.length], ['holes', 'Drillholes', holes.length], ['approval', 'Approval']] as const;
  const nextPhase: Record<Programme['phase'], Programme['phase'] | null> = { draft: 'scoped', scoped: 'costed', costed: null, approved: 'mobilising', mobilising: 'in-progress', 'in-progress': 'demobilising', demobilising: 'complete', complete: null, cancelled: null };
  const submitForApproval = () => {
    const n = Math.max(...w.approvals.map((a) => Number(a.id.slice(8)))) + 1;
    const def = w.workflows.find((x) => x.type === 'programme')!;
    const ap: Approval = { id: `WF-2026-${String(n).padStart(4, '0')}`, type: 'programme', title: `Programme approval: ${prg.name}`, projectId: p.id, subjectType: 'programme', subjectId: prg.id, requestedById: me.id, submittedOn: state.clock.slice(0, 10), dueOn: addDays(state.clock.slice(0, 10), def.steps.reduce((s, x) => s + x.sla, 0)), status: 'pending', amount: prg.budget, steps: def.steps.map((s) => ({ name: s.name, roleCode: s.roleCode, actorId: w.users.find((u) => u.active && u.roleCode === s.roleCode)?.id })), currentStep: 0, summary: `${prg.objective} Budget ${money(prg.budget)} ${w.settings.baseCurrency}.` };
    dispatch({ type: 'approval.create', approval: ap });
    dispatch({ type: 'programme.update', id: prg.id, patch: { approvalId: ap.id } });
    toast(`${ap.id} submitted for approval`, `/approvals/${ap.id}`);
  };
  return (
    <>
      <PageHead crumbs={[{ to: '/programmes', label: 'Programmes' }, { label: prg.id }]} title={prg.name} id={prg.id}
        meta={<><Link to={`/projects/${p.id}`} style={{ color: 'var(--muted)' }}>{p.name}</Link><span className="chip"><span className={`sw cat-${COMMODITY[p.commodity].cat}`} aria-hidden="true" />{p.commodity}</span><Chip status={prg.phase} /><span>{prg.type}</span><span className="nb">{date(prg.startOn)} → {date(prg.endOn)}</span></>}
        actions={<>
          {can(me, 'programme.write', w) && prg.phase === 'costed' && !approval ? <button type="button" className="btn btn--primary" onClick={submitForApproval}>Submit for approval</button> : null}
          {can(me, 'programme.write', w) && nextPhase[prg.phase] ? <button type="button" className="btn" onClick={() => setPhaseOpen(true)}>Move to {nextPhase[prg.phase]}</button> : null}
          {can(me, 'crew.assign', w) || can(me, 'programme.write', w) ? <button type="button" className="btn" onClick={() => setCrewOpen(true)}>Assign crew</button> : null}
        </>} />
      <nav className="tabs" aria-label="Programme sections">{tabs.map(([k, label, ct]) => <NavLink key={k} to={`/programmes/${prg.id}${k === 'overview' ? '' : '/' + k}`} aria-current={tab === k ? 'page' : undefined} end>{label}{ct !== undefined ? <span className="ct">{ct}</span> : null}</NavLink>)}</nav>

      {tab === 'overview' && (
        <div className="stack">
          <div className="panel">
            <div className="stamp">
              <Slot label="Budget" value={money(prg.budget)} hero sub={<span className={prg.spent > prg.budget ? 'neg' : undefined}>{money(prg.spent)} spent · {pct((prg.spent / prg.budget) * 100, 1)}</span>} />
              {prg.metresPlanned ? <Slot label="Metres" value={num(prg.metresDrilled ?? 0)} unit={`of ${num(prg.metresPlanned)} m`} sub={`${holes.filter((h) => !['planned', 'drilling'].includes(h.status)).length} of ${prg.holesPlanned ?? holes.length} holes`} /> : null}
              <Slot label="Duration" value={num(days)} unit="days" sub={`${elapsed} elapsed`} />
              <Slot label="Crew on site" value={num(prg.crew.filter((c) => c.from <= TODAY && c.to >= TODAY).length)} sub={`${prg.crew.length} assignments`} />
              <Slot label="Logistics" value={money(prg.logistics.reduce((s, l) => s + l.cost, 0))} sub={`${prg.logistics.length} items · ${prg.logistics.filter((l) => l.status === 'requested').length} requested`} />
            </div>
            <Authority text={`read from the programme ledger, ${count(holes.length, 'hole')} and ${count(prg.logistics.length, 'logistics item')}`} />
          </div>
          <div className="grid grid--2">
            <section className="panel"><h2>Objective</h2><p style={{ fontSize: 13, marginBottom: 12 }}>{prg.objective}</p>
              <dl className="kv"><dt>Lead</dt><dd>{PERSON(prg.leadId, w.users)}</dd><dt>Rig</dt><dd>{rig ? <Link to="/programmes/rigs">{rig.id} · {rig.name}</Link> : '—'}</dd><dt>Camp</dt><dd>{camp ? <Link to="/programmes/camps">{camp.name}</Link> : '—'}</dd><dt>Approval</dt><dd>{approval ? <Link to={`/approvals/${approval.id}`}>{approval.id} · {approval.status}</Link> : prg.phase === 'costed' ? 'not yet submitted' : '—'}</dd></dl></section>
            <section className="panel"><h2>Phase</h2>
              <ol className="steps">{PHASES.filter((ph) => ph !== 'cancelled').map((ph, i) => { const cur = PHASES.indexOf(prg.phase); return <li key={ph}><span className={`dot ${i < cur ? 'done' : i === cur ? 'now' : ''}`} aria-hidden="true" /><span className="n">{ph}</span><span className="d">{i === cur ? 'current' : ''}</span></li>; })}</ol>
            </section>
          </div>
          <Comments entityType="programme" entityId={prg.id} />
        </div>)}

      {tab === 'crew' && (
        <div className="panel panel--flush"><div className="ph"><h2>Crew assignments</h2><span className="r"><button type="button" className="btn btn--small" onClick={() => setCrewOpen(true)}>Assign crew</button></span></div>
          <DataTable caption="Crew" rows={prg.crew} rowKey={(c) => `${c.personId}-${c.from}`} empty="No crew assigned yet." defaultSort={{ key: 'from', dir: 'ascending' }} cols={[
            { key: 'who', label: 'Person', sort: (c) => PERSON(c.personId, w.users), render: (c) => PERSON(c.personId, w.users) },
            { key: 'role', label: 'Role', sort: (c) => c.role, render: (c) => c.role },
            { key: 'from', label: 'From', sort: (c) => c.from, render: (c) => <span className="mono">{date(c.from)}</span> },
            { key: 'to', label: 'To', sort: (c) => c.to, render: (c) => <span className="mono">{date(c.to)}</span> },
            { key: 'days', label: 'Days', num: true, render: (c) => num(daysBetween(c.from, c.to)) },
            { key: 'state', label: 'State', render: (c) => <Chip status={c.to < TODAY ? 'complete' : c.from > TODAY ? 'planned' : 'in-progress'}>{c.to < TODAY ? 'ended' : c.from > TODAY ? 'upcoming' : 'on site'}</Chip> },
            { key: 'act', label: <span className="vh">Actions</span>, render: (c) => <button type="button" className="btn btn--small" onClick={() => { dispatch({ type: 'programme.crew', id: prg.id, crew: prg.crew.filter((x) => x !== c) }); toast('Assignment removed'); }}>Remove</button> },
          ] as Col<CrewAssignment>[]} /></div>)}

      {tab === 'logistics' && (
        <div className="panel panel--flush"><div className="ph"><h2>Logistics</h2><span className="r">{money(prg.logistics.reduce((s, l) => s + l.cost, 0))} · <button type="button" className="btn btn--small" onClick={() => setLogOpen('new')}>Add item</button></span></div>
          <DataTable caption="Logistics" rows={prg.logistics} rowKey={(l) => l.id} empty="No logistics items yet." defaultSort={{ key: 'on', dir: 'ascending' }} cols={[
            { key: 'id', label: 'Item', render: (l) => <span className="mono">{l.id}</span> },
            { key: 'kind', label: 'Kind', sort: (l) => l.kind, render: (l) => l.kind },
            { key: 'desc', label: 'Description', render: (l) => l.description, wrap: true },
            { key: 'sup', label: 'Supplier', sort: (l) => l.supplier, render: (l) => l.supplier },
            { key: 'on', label: 'Scheduled', sort: (l) => l.scheduledOn, render: (l) => <span className="mono">{date(l.scheduledOn)}</span> },
            { key: 'cost', label: 'Cost', num: true, sort: (l) => l.cost, render: (l) => l.cost ? money(l.cost) : <span className="dash">—</span> },
            { key: 'status', label: 'Status', sort: (l) => l.status, render: (l) => <Chip status={l.status} /> },
            { key: 'act', label: <span className="vh">Actions</span>, render: (l) => <button type="button" className="btn btn--small" onClick={() => setLogOpen(l)}>Edit</button> },
          ] as Col<LogisticsItem>[]} /></div>)}

      {tab === 'holes' && <div className="panel panel--flush"><div className="ph"><h2>Drillholes</h2></div><HoleTable rows={holes} /></div>}
      {tab === 'approval' && (approval ? <ApprovalSummary a={approval} /> : <p className="empty">This programme has not been submitted for approval.{prg.phase === 'costed' ? ' Use Submit for approval above.' : ''}</p>)}

      <CrewDialog prg={prg} open={crewOpen} onClose={() => setCrewOpen(false)} />
      <LogisticsDialog prg={prg} item={logOpen} onClose={() => setLogOpen(null)} />
      <Dialog open={phaseOpen} onClose={() => setPhaseOpen(false)} title={`Move ${prg.id} to ${nextPhase[prg.phase]}`} summary={prg.phase === 'costed' ? 'A costed programme needs approval before mobilising.' : `From ${prg.phase} to ${nextPhase[prg.phase]}.`}>
        <form onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'programme.update', id: prg.id, patch: { phase: nextPhase[prg.phase]! } }); toast(`${prg.id} is now ${nextPhase[prg.phase]}`); setPhaseOpen(false); }}>
          {nextPhase[prg.phase] === 'complete' ? <p className="notice notice--dash">Completing a programme closes its ledger. Late invoices go to the project ledger instead.</p> : null}
          <div className="dlg-act"><button type="button" className="btn" onClick={() => setPhaseOpen(false)}>Cancel</button><button type="submit" className="btn btn--primary">Confirm</button></div>
        </form>
      </Dialog>
    </>
  );
}

export function ApprovalSummary({ a }: { a: Approval }) {
  const w = useStore().state.world;
  return (
    <section className="panel" aria-label="Approval">
      <div className="ph"><h2><Link to={`/approvals/${a.id}`}>{a.id}</Link> · {w.workflows.find((x) => x.type === a.type)?.name}</h2><span className="r"><Chip status={a.status} /></span></div>
      <p style={{ fontSize: 13, marginBottom: 12 }}>{a.summary}</p>
      <ol className="steps">{a.steps.map((s, i) => <li key={i}><span className={`dot ${s.decision === 'approved' ? 'done' : s.decision ? 'no' : i === a.currentStep && a.status === 'pending' ? 'now' : ''}`} aria-hidden="true" /><span><span className="n">{s.name}</span><br /><span className="who">{w.roles.find((r) => r.code === s.roleCode)?.name}{s.actorId ? ` · ${w.users.find((u) => u.id === s.actorId)?.name}` : ''}{s.note ? <> · <span className="note">{s.note}</span></> : null}</span></span><span className="d">{s.decision ? `${s.decision} ${date(s.on)}` : i === a.currentStep && a.status === 'pending' ? `due ${date(a.dueOn)}` : ''}</span></li>)}</ol>
    </section>
  );
}

function CrewDialog({ prg, open, onClose }: { prg: Programme; open: boolean; onClose: () => void }) {
  const { state, dispatch, toast } = useStore();
  const w = state.world;
  const [f, setF] = useState({ personId: FIELD_STAFF[0].id, role: FIELD_STAFF[0].role, from: prg.startOn > TODAY ? prg.startOn : TODAY, to: addDays(prg.startOn > TODAY ? prg.startOn : TODAY, 14) });
  const [err, setErr] = useState('');
  const people = [...w.users.filter((u) => u.active).map((u) => ({ id: u.id, name: u.name, role: u.title })), ...FIELD_STAFF];
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (f.to <= f.from) { setErr('The rotation must end after it starts.'); return; }
    const clash = w.programmes.filter((p) => p.id !== prg.id && ['mobilising', 'in-progress', 'approved'].includes(p.phase)).find((p) => p.crew.some((c) => c.personId === f.personId && c.from < f.to && c.to > f.from));
    if (clash) { setErr(`${people.find((x) => x.id === f.personId)?.name} is already assigned to ${clash.name} in that period.`); return; }
    dispatch({ type: 'programme.crew', id: prg.id, crew: [...prg.crew, { personId: f.personId, role: f.role, from: f.from, to: f.to }] });
    toast('Crew assigned'); setErr(''); onClose();
  };
  return (
    <Dialog open={open} onClose={onClose} title={`Assign crew · ${prg.name}`} summary={`${prg.crew.length} assignments so far. ${prg.campId ? `Camp ${w.camps.find((c) => c.id === prg.campId)?.name}: ${w.camps.find((c) => c.id === prg.campId)?.occupied} of ${w.camps.find((c) => c.id === prg.campId)?.beds} beds occupied.` : ''}`}>
      <form onSubmit={submit} noValidate>
        <label className="field"><span>Person</span><select value={f.personId} onChange={(e) => { const p = people.find((x) => x.id === e.target.value)!; setF({ ...f, personId: p.id, role: p.role }); }}>{people.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.role}</option>)}</select></label>
        <label className="field"><span>Role on this programme</span><input value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} /></label>
        <div className="grid grid--2">
          <label className="field"><span>Rotation start</span><input type="date" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></label>
          <label className="field"><span>Rotation end</span><input type="date" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></label>
        </div>
        {err ? <p className="notice notice--dash" role="alert">{err}</p> : null}
        <div className="dlg-act"><button type="button" className="btn" onClick={onClose}>Cancel</button><button type="submit" className="btn btn--primary">Assign</button></div>
      </form>
    </Dialog>
  );
}

function LogisticsDialog({ prg, item, onClose }: { prg: Programme; item: LogisticsItem | 'new' | null; onClose: () => void }) {
  const { dispatch, toast } = useStore();
  const isNew = item === 'new';
  const base: LogisticsItem = isNew || !item ? { id: `LG-${String(Math.floor(Math.random() * 9000) + 1000)}`, kind: 'charter', description: '', supplier: '', scheduledOn: TODAY, cost: 0, status: 'requested' } : item;
  return (
    <Dialog open={!!item} onClose={onClose} title={isNew ? 'Add a logistics item' : `Edit ${base.id}`}>
      <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const it: LogisticsItem = { ...base, kind: fd.get('kind') as LogisticsItem['kind'], description: String(fd.get('description')), supplier: String(fd.get('supplier')), scheduledOn: String(fd.get('on')), cost: Number(fd.get('cost')), status: fd.get('status') as LogisticsItem['status'] }; if (!it.description.trim()) return; dispatch({ type: 'programme.logistics', id: prg.id, item: it }); toast(isNew ? 'Logistics item added' : 'Logistics item saved'); onClose(); }}>
        <div className="grid grid--2">
          <label className="field"><span>Kind</span><select name="kind" defaultValue={base.kind}>{['charter', 'camp', 'fuel', 'permit', 'equipment', 'medical', 'freight'].map((k) => <option key={k}>{k}</option>)}</select></label>
          <label className="field"><span>Status</span><select name="status" defaultValue={base.status}>{['requested', 'booked', 'confirmed', 'delivered', 'cancelled'].map((k) => <option key={k}>{k}</option>)}</select></label>
        </div>
        <label className="field"><span>Description</span><input name="description" defaultValue={base.description} required /></label>
        <label className="field"><span>Supplier</span><input name="supplier" defaultValue={base.supplier} /></label>
        <div className="grid grid--2">
          <label className="field"><span>Scheduled</span><input type="date" name="on" defaultValue={base.scheduledOn} /></label>
          <label className="field"><span>Cost</span><input type="number" name="cost" min={0} step={100} defaultValue={base.cost} /></label>
        </div>
        <div className="dlg-act"><button type="button" className="btn" onClick={onClose}>Cancel</button><button type="submit" className="btn btn--primary">Save</button></div>
      </form>
    </Dialog>
  );
}
