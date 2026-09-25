import { useState, type FormEvent } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useStore, useMe, TODAY } from '../store';
import { money, date, relDays, count } from '../data/fmt';
import { Chip, PageHead, Slot, DataTable, Dialog, Comments, type Col } from '../ui/primitives';
import { daysBetween } from '../data/rng';
import type { Approval } from '../data/types';
import { ApprovalTable } from './Projects';

export function Approvals() {
  const [sp] = useSearchParams();
  const { state } = useStore();
  const me = useMe();
  const w = state.world;
  const view = sp.get('view') ?? 'me', type = sp.get('type');
  let rows = w.approvals;
  if (view === 'me') rows = rows.filter((a) => a.status === 'pending' && a.steps[a.currentStep].roleCode === me.roleCode);
  else if (view === 'pending') rows = rows.filter((a) => a.status === 'pending');
  else if (view === 'mine') rows = rows.filter((a) => a.requestedById === me.id);
  else if (view === 'decided') rows = rows.filter((a) => a.status !== 'pending');
  if (type) rows = rows.filter((a) => a.type === type);
  const title = view === 'me' ? 'Awaiting me' : view === 'pending' ? 'All pending' : view === 'mine' ? 'Raised by me' : 'Decided';
  const overdue = rows.filter((a) => a.status === 'pending' && a.dueOn < TODAY).length;
  return (
    <>
      <PageHead title={`Approvals · ${title}`} meta={<><span>{rows.length} requests</span>{overdue ? <span>{overdue} overdue</span> : null}{type ? <span>{w.workflows.find((x) => x.type === type)?.name}</span> : null}<span>signed in as {me.name}, {w.roles.find((r) => r.code === me.roleCode)?.name}</span></>} />
      {view === 'me' && rows.length > 0 ? (
        <div className="tickets" style={{ marginBottom: 16 }}>
          {rows.slice().sort((a, b) => (a.dueOn < b.dueOn ? -1 : 1)).slice(0, 4).map((a, i) => (
            <Link key={a.id} className={`ticket${i === 0 ? ' ticket--lead' : ''}`} to={`/approvals/${a.id}`}>
              <span className="t">{a.title}</span>
              <span className="c">{a.amount !== undefined ? <>{money(a.amount)}<span className="unit">{w.settings.baseCurrency}</span></> : <span style={{ fontSize: 16 }}>{w.workflows.find((x) => x.type === a.type)?.name}</span>}</span>
              <span className="sc">{a.steps[a.currentStep].name} · due {date(a.dueOn)}{a.dueOn < TODAY ? ' · overdue' : ''}</span>
              <span className="row" style={{ marginTop: 'auto' }}><span className="chip chip--dash">{w.projects.find((p) => p.id === a.projectId)?.name}</span></span>
            </Link>))}
        </div>) : null}
      <div className="panel panel--flush"><ApprovalTable rows={rows} /></div>
    </>
  );
}

export function ApprovalDetail() {
  const { id } = useParams();
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const a = w.approvals.find((x) => x.id === id);
  const [act, setAct] = useState<'approved' | 'rejected' | 'returned' | null>(null);
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  if (!a) return <><PageHead title="Request not found" crumbs={[{ to: '/approvals', label: 'Approvals' }, { label: id }]} /><p className="empty">No approval request has the id {id}.</p></>;
  const p = w.projects.find((x) => x.id === a.projectId)!;
  const wf = w.workflows.find((x) => x.type === a.type)!;
  const step = a.steps[a.currentStep];
  const isMine = a.status === 'pending' && step.roleCode === me.roleCode;
  const subjectLink = a.subjectType === 'programme' ? `/programmes/${a.subjectId}` : a.subjectType === 'project' ? `/projects/${a.subjectId}` : a.subjectType === 'tenement' ? `/projects/${a.projectId}/tenure` : a.subjectType === 'estimate' ? `/resources/estimates/${a.subjectId}` : `/programmes?project=${a.projectId}`;
  const programme = a.subjectType === 'programme' ? w.programmes.find((x) => x.id === a.subjectId) : undefined;
  const decide = (e: FormEvent) => {
    e.preventDefault();
    if (!act) return;
    if (act !== 'approved' && note.trim().length < 10) { setErr('Give the requester a reason (at least 10 characters).'); return; }
    dispatch({ type: 'approval.decide', id: a.id, decision: act, note: note.trim() || undefined });
    toast(`${a.id}: ${step.name} ${act}`); setAct(null); setNote(''); setErr('');
  };
  return (
    <>
      <PageHead crumbs={[{ to: '/approvals', label: 'Approvals' }, { label: a.id }]} title={a.title} id={a.id}
        meta={<><Chip status={a.status} /><span>{wf.name}</span><Link to={`/projects/${p.id}`} style={{ color: 'var(--muted)' }}>{p.name}</Link><span>submitted {date(a.submittedOn)} by {w.users.find((u) => u.id === a.requestedById)?.name}</span></>}
        actions={isMine ? <>
          <button type="button" className="btn btn--primary" onClick={() => setAct('approved')}>Approve</button>
          <button type="button" className="btn" onClick={() => setAct('returned')}>Return</button>
          <button type="button" className="btn btn--danger" onClick={() => setAct('rejected')}>Reject</button>
        </> : a.status === 'pending' && a.requestedById === me.id ? <button type="button" className="btn" onClick={() => { dispatch({ type: 'approval.withdraw', id: a.id }); toast(`${a.id} withdrawn`); }}>Withdraw</button> : null} />
      {a.status === 'pending' && !isMine ? <p className="notice" style={{ marginBottom: 16 }}>Waiting on <b>{step.name}</b> by the {w.roles.find((r) => r.code === step.roleCode)?.name}{step.actorId ? ` (${w.users.find((u) => u.id === step.actorId)?.name})` : ''}. Due {date(a.dueOn)}, {relDays(a.dueOn, TODAY)}.</p> : null}
      {a.status === 'pending' && isMine && a.dueOn < TODAY ? <p className="notice notice--dash" style={{ marginBottom: 16 }}>This step was due {date(a.dueOn)} and is {count(daysBetween(a.dueOn, TODAY), 'day')} overdue.</p> : null}
      <div className="stack">
        <div className="grid grid--2">
          <section className="panel" aria-labelledby="req-h">
            <h2 id="req-h">Request</h2>
            <p style={{ fontSize: 13, margin: '8px 0 12px' }}>{a.summary}</p>
            <dl className="kv">
              <dt>Subject</dt><dd><Link to={subjectLink} className="objchip"><span className="k">{a.subjectType}</span>{a.subjectId}</Link></dd>
              {a.amount !== undefined ? <><dt>Amount</dt><dd className="mono">{money(a.amount)} {w.settings.baseCurrency}</dd></> : null}
              <dt>Requested by</dt><dd>{w.users.find((u) => u.id === a.requestedById)?.name}</dd>
              <dt>Submitted</dt><dd className="mono">{date(a.submittedOn)}</dd>
              <dt>Due</dt><dd className="mono">{date(a.dueOn)}</dd>
              <dt>Workflow</dt><dd>{wf.description}</dd>
            </dl>
            {programme ? <div className="stamp" style={{ marginTop: 16 }}><Slot label="Programme budget" value={money(programme.budget)} /><Slot label="Spent to date" value={money(programme.spent)} /><Slot label="Dates" long value={<><span className="nb">{date(programme.startOn)} →</span> <span className="nb">{date(programme.endOn)}</span></>} /><Slot label="Phase" long value={programme.phase} /></div> : null}
          </section>
          <section className="panel" aria-labelledby="steps-h">
            <h2 id="steps-h">Workflow steps</h2>
            <ol className="steps">{a.steps.map((s, i) => <li key={i}><span className={`dot ${s.decision === 'approved' ? 'done' : s.decision ? 'no' : i === a.currentStep && a.status === 'pending' ? 'now' : ''}`} aria-hidden="true" /><span><span className="n">{s.name}</span><br /><span className="who">{w.roles.find((r) => r.code === s.roleCode)?.name}{s.actorId ? ` · ${w.users.find((u) => u.id === s.actorId)?.name}` : ''} · SLA {wf.steps[i]?.sla} d{s.note ? <> · <span className="note">{s.note}</span></> : null}</span></span><span className="d">{s.decision ? `${s.decision} ${date(s.on)}` : i === a.currentStep && a.status === 'pending' ? 'current' : ''}</span></li>)}</ol>
          </section>
        </div>
        <Comments entityType="approval" entityId={a.id} />
        <section className="panel panel--flush"><div className="ph"><h2>Other requests on {p.name}</h2></div>
          <DataTable caption="Related requests" rows={w.approvals.filter((x) => x.projectId === p.id && x.id !== a.id)} rowKey={(x) => x.id} cols={[
            { key: 'id', label: 'Request', render: (x) => <Link to={`/approvals/${x.id}`}><span className="mono">{x.id}</span></Link> },
            { key: 't', label: 'Title', render: (x) => x.title, wrap: true },
            { key: 's', label: 'Status', render: (x) => <Chip status={x.status} /> },
            { key: 'd', label: 'Submitted', render: (x) => <span className="mono">{date(x.submittedOn)}</span> },
          ] as Col<Approval>[]} /></section>
      </div>
      <Dialog open={!!act} onClose={() => setAct(null)} title={act === 'approved' ? `Approve: ${step.name}` : act === 'returned' ? 'Return to the requester' : `Reject ${a.id}`} summary={act === 'approved' ? (a.currentStep === a.steps.length - 1 ? 'This is the final step. The request will be approved and its subject updated.' : `The request moves to ${a.steps[a.currentStep + 1].name} (${w.roles.find((r) => r.code === a.steps[a.currentStep + 1].roleCode)?.name}).`) : act === 'returned' ? 'The requester can revise and resubmit. Nothing else changes.' : 'Rejection ends the workflow. The requester is notified with your reason.'}>
        <form onSubmit={decide} noValidate>
          <label className={`field${err ? ' err' : ''}`}><span>{act === 'approved' ? 'Note (optional)' : 'Reason'}</span><textarea value={note} onChange={(e) => setNote(e.target.value)} aria-invalid={!!err} placeholder={act === 'approved' ? 'Conditions, if any' : 'What needs to change'} />{err ? <span className="error">{err}</span> : null}</label>
          {act === 'approved' && a.type === 'budget-variance' ? <p className="notice">Approving raises the programme's approved budget by {money(a.amount)}.</p> : null}
          <div className="dlg-act"><button type="button" className="btn" onClick={() => setAct(null)}>Cancel</button><button type="submit" className={`btn ${act === 'rejected' ? 'btn--danger' : 'btn--primary'}`}>{act === 'approved' ? 'Approve' : act === 'returned' ? 'Return' : 'Reject'}</button></div>
        </form>
      </Dialog>
    </>
  );
}
