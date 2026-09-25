import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useStore, useMe, can } from '../store';
import { num, datetime } from '../data/fmt';
import { Chip, PageHead, DataTable, Dialog, type Col } from '../ui/primitives';
import type { User, Role, AuditEntry, WorkflowDef, SystemSettings } from '../data/types';

function Guard({ children }: { children: React.ReactNode }) {
  const me = useMe(); const w = useStore().state.world;
  if (!can(me, 'admin.read', w)) return <><PageHead title="Administration" /><p className="empty">Your role ({w.roles.find((r) => r.code === me.roleCode)?.name}) does not include administration. Ask a system administrator.</p></>;
  return <>{children}</>;
}

export function SystemSettingsPage() {
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const s = w.settings;
  const [resetOpen, setResetOpen] = useState(false);
  const rw = can(me, 'admin.write', w);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const patch: Partial<SystemSettings> = { tenantName: String(fd.get('tenantName')), fiscalYearStart: String(fd.get('fy')), baseCurrency: fd.get('currency') as SystemSettings['baseCurrency'], numberLocale: String(fd.get('locale')), sessionTimeoutMin: Number(fd.get('timeout')), passwordMinLength: Number(fd.get('pwlen')), mfaRequired: fd.get('mfa') === 'on', ssoProvider: fd.get('sso') as SystemSettings['ssoProvider'], auditRetentionDays: Number(fd.get('retention')), attachmentMaxMb: Number(fd.get('attach')), varianceThresholdPct: Number(fd.get('variance')), gateApproverRole: String(fd.get('gateRole')) };
    dispatch({ type: 'settings.update', patch }); toast('System settings saved');
  };
  return (
    <Guard>
      <PageHead title="System settings" meta={<><span>tenant {s.tenantCode}</span><span>ADIT 7.4.2</span></>} actions={rw ? <button type="button" className="btn btn--danger" onClick={() => setResetOpen(true)}>Reset demonstration tenant</button> : null} />
      <form className="stack" onSubmit={submit}>
        <section className="panel"><h2>Tenant</h2>
          <div className="grid grid--3" style={{ marginTop: 10 }}>
            <label className="field"><span>Tenant name</span><input name="tenantName" defaultValue={s.tenantName} disabled={!rw} /></label>
            <label className="field"><span>Fiscal year starts (MM-DD)</span><input name="fy" defaultValue={s.fiscalYearStart} pattern="\d\d-\d\d" disabled={!rw} /></label>
            <label className="field"><span>Base currency</span><select name="currency" defaultValue={s.baseCurrency} disabled={!rw}>{['USD', 'CAD', 'AUD'].map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className="field"><span>Number locale</span><select name="locale" defaultValue={s.numberLocale} disabled={!rw}>{['en-CA', 'en-US', 'en-AU', 'en-GB', 'es-CL', 'fi-FI'].map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className="field"><span>Variance threshold, %</span><input type="number" name="variance" min={0} max={50} defaultValue={s.varianceThresholdPct} disabled={!rw} /><span className="hint">Forecast overruns above this raise a budget-variance request.</span></label>
            <label className="field"><span>Stage-gate approver role</span><select name="gateRole" defaultValue={s.gateApproverRole} disabled={!rw}>{w.roles.map((r) => <option key={r.code} value={r.code}>{r.name}</option>)}</select></label>
          </div>
        </section>
        <section className="panel"><h2>Security</h2>
          <div className="grid grid--3" style={{ marginTop: 10 }}>
            <label className="field"><span>Session timeout, minutes</span><input type="number" name="timeout" min={5} max={480} defaultValue={s.sessionTimeoutMin} disabled={!rw} /></label>
            <label className="field"><span>Minimum password length</span><input type="number" name="pwlen" min={8} max={64} defaultValue={s.passwordMinLength} disabled={!rw} /></label>
            <label className="field"><span>Single sign-on provider</span><select name="sso" defaultValue={s.ssoProvider} disabled={!rw}>{['none', 'Entra ID', 'Okta'].map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className="check" style={{ alignSelf: 'end', paddingBottom: 8 }}><input type="checkbox" name="mfa" defaultChecked={s.mfaRequired} disabled={!rw} />Require multi-factor authentication</label>
            <label className="field"><span>Audit retention, days</span><input type="number" name="retention" min={90} defaultValue={s.auditRetentionDays} disabled={!rw} /></label>
            <label className="field"><span>Attachment limit, MB</span><input type="number" name="attach" min={1} defaultValue={s.attachmentMaxMb} disabled={!rw} /></label>
          </div>
        </section>
        <section className="panel"><h2>Auto-numbering</h2>
          <dl className="kv" style={{ marginTop: 10 }}>{Object.entries(s.autoNumbering).map(([k, v]) => <div key={k} style={{ display: 'contents' }}><dt>{k}</dt><dd className="mono">{v}</dd></div>)}</dl>
          <p className="faint small" style={{ marginTop: 8 }}>Numbering rules are set at implementation and changed by Brannock Geosystems support.</p>
        </section>
        {rw ? <div className="row row--end"><button type="submit" className="btn btn--primary">Save settings</button></div> : <p className="notice notice--dash">Read-only: your role can view settings but not change them.</p>}
      </form>
      <Dialog open={resetOpen} onClose={() => setResetOpen(false)} title="Reset the demonstration tenant" summary="Every change made in this browser is discarded and the tenant returns to its seeded state. Users, settings, approvals, comments and scenarios are all reset.">
        <form onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'tenant.reset' }); toast('Tenant reset to its seed'); setResetOpen(false); }}>
          <label className="check"><input type="checkbox" required />I understand this cannot be undone.</label>
          <div className="dlg-act"><button type="button" className="btn" onClick={() => setResetOpen(false)}>Cancel</button><button type="submit" className="btn btn--danger">Reset tenant</button></div>
        </form>
      </Dialog>
    </Guard>
  );
}

export function PriceDeckAdmin() {
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const rw = can(me, 'admin.write', w);
  return (
    <Guard>
      <PageHead title="Price deck and cut-offs" meta={<span>deck {w.settings.priceDeck[0].asOf} · {w.settings.priceDeck[0].source}</span>} actions={<Link className="btn" to="/resources/price-deck">View in Resources</Link>} />
      <form className="panel stack" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); dispatch({ type: 'settings.update', patch: { cutoffs: Object.fromEntries(w.commodities.map((c) => [c.code, Number(fd.get('cut-' + c.code)) || w.settings.cutoffs[c.code]])) as SystemSettings['cutoffs'], priceDeck: w.settings.priceDeck.map((d) => ({ ...d, value: Number(fd.get('price-' + d.commodity)) || d.value, asOf: state.clock.slice(0, 10) })) } }); toast('Price deck and cut-offs saved'); }}>
        <div className="tbl-wrap"><table className="tbl"><caption className="vh">Price deck and cut-offs</caption><thead><tr><th scope="col">Commodity</th><th scope="col" className="num">Price</th><th scope="col">Unit</th><th scope="col" className="num">Default cut-off</th><th scope="col">Grade unit</th><th scope="col">Assay method</th></tr></thead>
          <tbody>{w.commodities.map((c) => { const d = w.settings.priceDeck.find((x) => x.commodity === c.code)!; return <tr key={c.code}><td><span className="chip"><span className={`sw cat-${c.cat}`} aria-hidden="true" />{c.name}</span></td><td className="num"><input className="input mono" style={{ width: 120, textAlign: 'right' }} type="number" name={`price-${c.code}`} step={d.unit.includes('/lb') ? 0.01 : 1} defaultValue={d.value} disabled={!rw} aria-label={`${c.name} price`} /></td><td>{d.unit}</td><td className="num"><input className="input mono" style={{ width: 100, textAlign: 'right' }} type="number" name={`cut-${c.code}`} step={0.01} defaultValue={w.settings.cutoffs[c.code]} disabled={!rw} aria-label={`${c.name} cut-off`} /></td><td>{c.gradeUnit} {c.gradeLabel}</td><td className="mono small">{c.method}</td></tr>; })}</tbody></table></div>
        {rw ? <div className="row row--end"><button type="submit" className="btn btn--primary">Save</button></div> : null}
      </form>
    </Guard>
  );
}

export function QaqcAdmin() {
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const rw = can(me, 'admin.write', w);
  const q = w.settings.qaqc;
  return (
    <Guard>
      <PageHead title="QAQC tolerances" meta={<span>applied on results import to every batch</span>} />
      <form className="panel stack" style={{ maxWidth: 640 }} onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); dispatch({ type: 'settings.update', patch: { qaqc: { standardSigma: Number(fd.get('sigma')), blankMaxMultiple: Number(fd.get('blank')), duplicateHardPct: Number(fd.get('dup')), minInsertionRate: Number(fd.get('ins')) } } }); toast('QAQC tolerances saved'); }}>
        <label className="field"><span>Certified reference material tolerance, σ</span><input type="number" name="sigma" min={1} max={5} step={0.5} defaultValue={q.standardSigma} disabled={!rw} /><span className="hint">A standard outside ± this many standard deviations of its certified value fails.</span></label>
        <label className="field"><span>Blank threshold, × detection limit</span><input type="number" name="blank" min={1} max={20} defaultValue={q.blankMaxMultiple} disabled={!rw} /><span className="hint">A coarse blank above this multiple of the method detection limit fails.</span></label>
        <label className="field"><span>Field duplicate HARD limit, %</span><input type="number" name="dup" min={5} max={50} defaultValue={q.duplicateHardPct} disabled={!rw} /><span className="hint">Half absolute relative difference above this, for pairs above cut-off, fails.</span></label>
        <label className="field"><span>Minimum insertion rate, %</span><input type="number" name="ins" min={1} max={20} defaultValue={q.minInsertionRate} disabled={!rw} /><span className="hint">Batches below this rate of control samples are flagged on import.</span></label>
        {rw ? <div className="row row--end"><button type="submit" className="btn btn--primary">Save tolerances</button></div> : null}
      </form>
    </Guard>
  );
}

export function Workflows() {
  const w = useStore().state.world;
  const [open, setOpen] = useState<WorkflowDef | null>(null);
  return (
    <Guard>
      <PageHead title="Workflows" meta={<span>{w.workflows.length} approval workflows</span>} />
      <div className="panel panel--flush"><DataTable caption="Workflows" rows={w.workflows} rowKey={(x) => x.type} cols={[
        { key: 'name', label: 'Workflow', render: (x) => <button type="button" className="th-btn" style={{ color: 'var(--ink)', textTransform: 'none', font: 'inherit', borderBottom: '1px solid var(--link-line)' }} onClick={() => setOpen(x)}>{x.name}</button> },
        { key: 'type', label: 'Type code', render: (x) => <span className="mono">{x.type}</span> },
        { key: 'desc', label: 'Applies to', render: (x) => x.description, wrap: true },
        { key: 'steps', label: 'Steps', render: (x) => x.steps.map((s) => `${s.name} (${s.roleCode})`).join(' → '), wrap: true },
        { key: 'sla', label: 'Total SLA', num: true, render: (x) => `${x.steps.reduce((s, y) => s + y.sla, 0)} d` },
        { key: 'open', label: 'Pending', num: true, render: (x) => num(w.approvals.filter((a) => a.type === x.type && a.status === 'pending').length) },
      ] as Col<WorkflowDef>[]} /></div>
      <Dialog open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''} summary={open?.description}>
        {open ? <><ol className="steps">{open.steps.map((s, i) => <li key={i}><span className="dot" aria-hidden="true" /><span><span className="n">{s.name}</span><br /><span className="who">{w.roles.find((r) => r.code === s.roleCode)?.name}</span></span><span className="d">SLA {s.sla} d</span></li>)}</ol><p className="faint small" style={{ marginTop: 12 }}>Workflow definitions are changed by Brannock Geosystems support under a change request.</p></> : null}
      </Dialog>
    </Guard>
  );
}

export function ReferenceData() {
  const w = useStore().state.world;
  return (
    <Guard>
      <PageHead title="Reference data" meta={<span>{w.labs.length} laboratories · {w.costCodes.length} cost codes · {w.commodities.length} commodities</span>} />
      <div className="stack">
        <section className="panel panel--flush"><div className="ph"><h2>Laboratories</h2></div><DataTable caption="Laboratories" rows={w.labs} rowKey={(l) => l.id} cols={[{ key: 'id', label: 'Code', render: (l) => <span className="mono">{l.id}</span> }, { key: 'n', label: 'Name', render: (l) => l.name }, { key: 'loc', label: 'Location', render: (l) => l.location }, { key: 'acc', label: 'Accreditation', render: (l) => l.accreditation }, { key: 't', label: 'Quoted turnaround', num: true, render: (l) => `${l.turnaroundDays} d` }, { key: 'a', label: 'Status', render: (l) => <Chip status={l.active ? 'active' : 'inactive'} /> }]} /></section>
        <section className="panel panel--flush"><div className="ph"><h2>Cost codes</h2></div><DataTable caption="Cost codes" rows={w.costCodes} rowKey={(c) => c.code} cols={[{ key: 'c', label: 'Code', render: (c) => <span className="mono">{c.code}</span> }, { key: 'n', label: 'Name', render: (c) => c.name }, { key: 'cat', label: 'Category', render: (c) => c.category }]} /></section>
        <section className="panel panel--flush"><div className="ph"><h2>Commodities</h2></div><DataTable caption="Commodities" rows={w.commodities} rowKey={(c) => c.code} cols={[{ key: 'c', label: 'Code', render: (c) => <span className="chip"><span className={`sw cat-${c.cat}`} aria-hidden="true" />{c.code}</span> }, { key: 'n', label: 'Name', render: (c) => c.name }, { key: 's', label: 'Deposit style', render: (c) => c.depositStyle }, { key: 'g', label: 'Grade', render: (c) => `${c.gradeLabel} in ${c.gradeUnit}` }, { key: 'm', label: 'Metal unit', render: (c) => c.metalUnit }, { key: 'h', label: 'Hole types', render: (c) => c.holeTypes.join(', ') }, { key: 'a', label: 'Assay method', render: (c) => <span className="mono small">{c.method}</span> }]} /></section>
      </div>
    </Guard>
  );
}

export function Users() {
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const rw = can(me, 'user.manage', w);
  const [edit, setEdit] = useState<User | 'new' | null>(null);
  const cols: Col<User>[] = [
    { key: 'name', label: 'Name', sort: (u) => u.name, render: (u) => <span className="row"><span className="avatar" aria-hidden="true">{u.initials}</span><span className="ink">{u.name}</span></span> },
    { key: 'role', label: 'Role', sort: (u) => u.roleCode, render: (u) => w.roles.find((r) => r.code === u.roleCode)?.name },
    { key: 'title', label: 'Title', render: (u) => u.title },
    { key: 'email', label: 'Email', render: (u) => <span className="mono small">{u.email}</span> },
    { key: 'team', label: 'Team', sort: (u) => u.team, render: (u) => u.team },
    { key: 'loc', label: 'Location', render: (u) => `${u.location} · ${u.timezone}` },
    { key: 'status', label: 'Status', sort: (u) => (u.active ? 1 : 0), render: (u) => <Chip status={u.active ? 'active' : 'inactive'} /> },
    { key: 'last', label: 'Last sign-in', sort: (u) => u.lastSignIn, render: (u) => <span className="mono">{datetime(u.lastSignIn)}</span> },
    { key: 'act', label: <span className="vh">Actions</span>, render: (u) => rw ? <button type="button" className="btn btn--small" onClick={() => setEdit(u)}>Edit</button> : null },
  ];
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name')).trim();
    const patch = { name, initials: name.split(/\s+/).map((x) => x[0]).slice(0, 2).join('').toUpperCase(), roleCode: String(fd.get('role')), title: String(fd.get('title')), email: String(fd.get('email')), team: String(fd.get('team')), location: String(fd.get('location')), timezone: String(fd.get('timezone')), active: fd.get('active') === 'on' };
    if (edit === 'new') { const id = 'u-' + name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 14); dispatch({ type: 'user.add', user: { id, ...patch, phone: '', lastSignIn: state.clock, prefs: w.users[0].prefs } }); toast(`${name} added`); }
    else if (edit) { dispatch({ type: 'user.update', id: edit.id, patch }); toast(`${name} saved`); }
    setEdit(null);
  };
  const u = edit === 'new' ? null : edit;
  return (
    <Guard>
      <PageHead title="Users" meta={<><span>{w.users.length} accounts</span><span>{w.users.filter((x) => x.active).length} active</span><span>SSO {w.settings.ssoProvider}</span></>} actions={rw ? <button type="button" className="btn btn--primary" onClick={() => setEdit('new')}>Add user</button> : null} />
      <div className="panel panel--flush"><DataTable caption="Users" rows={w.users} cols={cols} rowKey={(x) => x.id} defaultSort={{ key: 'name', dir: 'ascending' }} /></div>
      <Dialog open={!!edit} onClose={() => setEdit(null)} title={u ? `Edit ${u.name}` : 'Add a user'}>
        <form onSubmit={submit}>
          <div className="grid grid--2">
            <label className="field"><span>Full name</span><input name="name" defaultValue={u?.name} required /></label>
            <label className="field"><span>Role</span><select name="role" defaultValue={u?.roleCode ?? 'PGEO'}>{w.roles.map((r) => <option key={r.code} value={r.code}>{r.name}</option>)}</select></label>
            <label className="field"><span>Title</span><input name="title" defaultValue={u?.title} /></label>
            <label className="field"><span>Email</span><input type="email" name="email" defaultValue={u?.email} required /></label>
            <label className="field"><span>Team</span><input name="team" defaultValue={u?.team ?? 'Exploration'} /></label>
            <label className="field"><span>Location</span><input name="location" defaultValue={u?.location} /></label>
            <label className="field"><span>Time zone</span><input name="timezone" defaultValue={u?.timezone ?? 'America/Vancouver'} /></label>
            <label className="check" style={{ alignSelf: 'end', paddingBottom: 8 }}><input type="checkbox" name="active" defaultChecked={u ? u.active : true} />Active</label>
          </div>
          <div className="dlg-act">{u && u.id !== me.id ? <span className="left faint small">Deactivated users keep their history; their pending steps reassign to the role.</span> : null}<button type="button" className="btn" onClick={() => setEdit(null)}>Cancel</button><button type="submit" className="btn btn--primary">Save</button></div>
        </form>
      </Dialog>
    </Guard>
  );
}

export function Roles() {
  const w = useStore().state.world;
  const perms = Array.from(new Set(w.roles.flatMap((r) => r.permissions))).sort();
  return (
    <Guard>
      <PageHead title="Roles and permissions" meta={<span>{w.roles.length} roles · {perms.length} permissions</span>} />
      <div className="panel panel--flush"><div className="tbl-wrap"><table className="tbl tbl--compact"><caption className="vh">Permission matrix</caption>
        <thead><tr><th scope="col">Permission</th>{w.roles.map((r) => <th key={r.code} scope="col" className="num" title={r.name}>{r.code}<br /><span className="faint" style={{ fontWeight: 400, textTransform: 'none' }}>{num(w.users.filter((u) => u.roleCode === r.code).length)} users</span></th>)}</tr></thead>
        <tbody>{perms.map((p) => <tr key={p}><td className="mono">{p}</td>{w.roles.map((r) => <td key={r.code} className="num">{r.permissions.includes(p) ? <span className="ink" aria-label="granted">●</span> : <span className="dash" aria-label="not granted">—</span>}</td>)}</tr>)}</tbody></table></div></div>
      <div className="grid grid--auto" style={{ marginTop: 16 }}>{w.roles.map((r: Role) => <div className="panel" key={r.code}><h3>{r.name} <span className="mono faint">{r.code}</span></h3><p className="faint small" style={{ marginTop: 6 }}>{r.permissions.length} permissions · {w.users.filter((u) => u.roleCode === r.code).map((u) => u.name).join(', ') || 'no users'}</p></div>)}</div>
    </Guard>
  );
}

export function AuditLog() {
  const w = useStore().state.world;
  const [q, setQ] = useState('');
  const [user, setUser] = useState('');
  const rows = w.audit.filter((a) => (!user || a.userId === user) && (!q || `${a.action} ${a.entityType} ${a.entityId} ${a.detail}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <Guard>
      <PageHead title="Audit log" meta={<><span>{num(rows.length)} of {num(w.audit.length)} entries</span><span>retained {w.settings.auditRetentionDays} days</span></>} />
      <div className="filters" role="search">
        <label className="field field--wide"><span>Find</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Action, record id or detail" /></label>
        <label className="field"><span>User</span><select value={user} onChange={(e) => setUser(e.target.value)}><option value="">Everyone</option>{w.users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></label>
      </div>
      <div className="panel panel--flush"><DataTable caption="Audit log" rows={rows} rowKey={(a) => a.id} pageSize={100} compact cols={[
        { key: 'at', label: 'When (UTC)', sort: (a) => a.at, render: (a) => <span className="mono">{a.at.slice(0, 19).replace('T', ' ')}</span> },
        { key: 'who', label: 'User', sort: (a) => a.userId, render: (a) => w.users.find((u) => u.id === a.userId)?.name ?? a.userId },
        { key: 'action', label: 'Action', sort: (a) => a.action, render: (a) => <span className="mono">{a.action}</span> },
        { key: 'ent', label: 'Record', sort: (a) => a.entityId, render: (a) => <span className="mono">{a.entityType} · {a.entityId}</span> },
        { key: 'detail', label: 'Detail', render: (a) => a.detail, wrap: true },
      ] as Col<AuditEntry>[]} defaultSort={{ key: 'at', dir: 'descending' }} /></div>
    </Guard>
  );
}

