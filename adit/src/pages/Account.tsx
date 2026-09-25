import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore, useMe } from '../store';
import { datetime, relDays, date } from '../data/fmt';
import { Chip, PageHead, DataTable } from '../ui/primitives';
import type { UserPrefs, Notification } from '../data/types';

export function Profile() {
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const fd = new FormData(e.currentTarget); dispatch({ type: 'user.update', id: me.id, patch: { phone: String(fd.get('phone')), location: String(fd.get('location')), timezone: String(fd.get('timezone')) } }); toast('Profile saved'); };
  return (
    <>
      <PageHead title="My profile" meta={<><span>{me.title}</span><span>{w.roles.find((r) => r.code === me.roleCode)?.name}</span><span>last sign-in {datetime(me.lastSignIn)}</span></>} />
      <form className="panel stack" style={{ maxWidth: 640 }} onSubmit={submit}>
        <div className="row" style={{ gap: 12 }}><span className="avatar" style={{ width: 40, height: 40, fontSize: 14 }} aria-hidden="true">{me.initials}</span><div><div className="ink" style={{ fontWeight: 600 }}>{me.name}</div><div className="faint small mono">{me.email}</div></div></div>
        <div className="grid grid--2">
          <label className="field"><span>Name</span><input value={me.name} disabled /><span className="hint">Managed by {w.settings.ssoProvider}.</span></label>
          <label className="field"><span>Email</span><input value={me.email} disabled /></label>
          <label className="field"><span>Phone</span><input name="phone" defaultValue={me.phone} /></label>
          <label className="field"><span>Location</span><input name="location" defaultValue={me.location} /></label>
          <label className="field"><span>Time zone</span><input name="timezone" defaultValue={me.timezone} /></label>
          <label className="field"><span>Team</span><input value={me.team} disabled /></label>
        </div>
        <div className="row row--end"><button type="submit" className="btn btn--primary">Save profile</button></div>
      </form>
    </>
  );
}

export function Preferences() {
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const prefs: Partial<UserPrefs> = { defaultSection: String(fd.get('section')), defaultProjectId: String(fd.get('project')) || null, units: fd.get('units') as UserPrefs['units'], dateFormat: fd.get('date') as UserPrefs['dateFormat'], gradeDecimals: Number(fd.get('decimals')), rowsPerPage: Number(fd.get('rows')) as UserPrefs['rowsPerPage'], compactTables: fd.get('compact') === 'on' }; dispatch({ type: 'user.prefs', id: me.id, prefs }); toast('Preferences saved'); };
  const p = me.prefs;
  return (
    <>
      <PageHead title="Preferences" meta={<span>{me.name}</span>} />
      <form className="panel stack" style={{ maxWidth: 640 }} onSubmit={submit}>
        <div className="grid grid--2">
          <label className="field"><span>Open on sign-in</span><select name="section" defaultValue={p.defaultSection}>{['portfolio', 'projects', 'programmes', 'drilling', 'assays', 'resources', 'approvals', 'optimiser', 'admin'].map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="field"><span>Default project</span><select name="project" defaultValue={p.defaultProjectId ?? ''}><option value="">None</option>{w.projects.filter((x) => x.status !== 'closed').map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
          <label className="field"><span>Units</span><select name="units" defaultValue={p.units}><option value="metric">Metric</option><option value="imperial">Imperial (display only)</option></select></label>
          <label className="field"><span>Date format</span><select name="date" defaultValue={p.dateFormat}><option value="ISO">2026-09-21</option><option value="DMY">21/09/2026</option><option value="MDY">09/21/2026</option></select></label>
          <label className="field"><span>Grade decimals</span><input type="number" name="decimals" min={0} max={4} defaultValue={p.gradeDecimals} /></label>
          <label className="field"><span>Rows per page</span><select name="rows" defaultValue={p.rowsPerPage}>{[25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
          <label className="check" style={{ gridColumn: '1 / -1' }}><input type="checkbox" name="compact" defaultChecked={p.compactTables} />Compact tables</label>
        </div>
        <div className="row row--between"><span className="faint small">Theme is the switch in the top bar and is remembered on this device.</span><button type="submit" className="btn btn--primary">Save preferences</button></div>
      </form>
    </>
  );
}

export function NotificationSettings() {
  const { dispatch, toast } = useStore();
  const me = useMe();
  const kinds: { k: Notification['kind']; label: string; desc: string }[] = [
    { k: 'approval', label: 'Approvals', desc: 'A workflow step is waiting on your role, or a request you raised was decided.' },
    { k: 'assay', label: 'Assays', desc: 'A batch is received, placed on hold, accepted or rejected on a project you work on.' },
    { k: 'tenure', label: 'Tenure', desc: 'A tenement is within 90 days of expiry or a renewal changes state.' },
    { k: 'programme', label: 'Programmes', desc: 'Crew assignments, rig moves, phase changes and gate decisions.' },
    { k: 'budget', label: 'Budget', desc: 'A programme forecast crosses the variance threshold.' },
    { k: 'mention', label: 'Mentions and comments', desc: 'Someone @-mentions you or comments on a record you own.' },
    { k: 'system', label: 'System', desc: 'Maintenance windows, releases and account notices.' },
  ];
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const notify = Object.fromEntries(kinds.map((x) => [x.k, fd.get('n-' + x.k) === 'on'])) as UserPrefs['notify']; dispatch({ type: 'user.prefs', id: me.id, prefs: { notify, emailDigest: fd.get('digest') as UserPrefs['emailDigest'] } }); toast('Notification settings saved'); };
  return (
    <>
      <PageHead title="Notification settings" meta={<span>{me.name}</span>} />
      <form className="panel stack" style={{ maxWidth: 720 }} onSubmit={submit}>
        <div className="tbl-wrap"><table className="tbl"><caption className="vh">Notification kinds</caption><thead><tr><th scope="col">Kind</th><th scope="col">When</th><th scope="col" className="num">In ADIT</th></tr></thead>
          <tbody>{kinds.map((x) => <tr key={x.k}><td className="ink">{x.label}</td><td className="wrap">{x.desc}</td><td className="num"><input type="checkbox" name={'n-' + x.k} defaultChecked={me.prefs.notify[x.k]} aria-label={`${x.label} notifications`} style={{ accentColor: 'var(--blue)' }} /></td></tr>)}</tbody></table></div>
        <label className="field" style={{ maxWidth: 280 }}><span>Email digest</span><select name="digest" defaultValue={me.prefs.emailDigest}><option value="none">None</option><option value="daily">Daily at 07:00</option><option value="weekly">Weekly, Monday</option></select></label>
        <div className="row row--end"><button type="submit" className="btn btn--primary">Save</button></div>
      </form>
    </>
  );
}

export function Security() {
  const { state } = useStore();
  const me = useMe();
  const w = state.world;
  const sessions = [{ device: 'This browser', where: me.location, at: me.lastSignIn, current: true }, { device: 'Windows · Edge', where: me.location, at: '2026-09-19T08:12:00Z', current: false }];
  return (
    <>
      <PageHead title="Security" meta={<span>{me.name}</span>} />
      <div className="stack" style={{ maxWidth: 720 }}>
        <section className="panel"><h2>Sign-in</h2><dl className="kv" style={{ marginTop: 8 }}><dt>Provider</dt><dd>{w.settings.ssoProvider}</dd><dt>Multi-factor</dt><dd>{w.settings.mfaRequired ? 'Required by the tenant' : 'Optional'}</dd><dt>Session timeout</dt><dd>{w.settings.sessionTimeoutMin} minutes idle</dd></dl><p className="faint small" style={{ marginTop: 8 }}>Password and multi-factor settings are managed in {w.settings.ssoProvider}, not in ADIT.</p></section>
        <section className="panel panel--flush"><div className="ph"><h2>Sessions</h2></div><DataTable caption="Sessions" rows={sessions} rowKey={(s) => s.device} cols={[{ key: 'd', label: 'Device', render: (s) => <span className="ink">{s.device}</span> }, { key: 'w', label: 'Location', render: (s) => s.where }, { key: 'a', label: 'Signed in', render: (s) => <span className="mono">{datetime(s.at)}</span> }, { key: 'c', label: 'Status', render: (s) => s.current ? <Chip status="active">current</Chip> : <button type="button" className="btn btn--small">Sign out</button> }]} /></section>
      </div>
    </>
  );
}

export function AllNotifications() {
  const { state, dispatch } = useStore();
  const me = useMe();
  const rows = state.world.notifications.filter((n) => n.userId === me.id);
  return (
    <>
      <PageHead title="Notifications" meta={<><span>{rows.length} total</span><span>{rows.filter((n) => !n.read).length} unread</span></>} actions={<><button type="button" className="btn" onClick={() => dispatch({ type: 'notification.readAll' })} disabled={!rows.some((n) => !n.read)}>Mark all read</button><Link className="btn" to="/account/notifications">Settings</Link></>} />
      <div className="panel panel--flush"><DataTable caption="Notifications" rows={rows} rowKey={(n) => n.id} pageSize={50} cols={[
        { key: 'r', label: 'Read', render: (n) => n.read ? <span className="dash">read</span> : <Chip status="pending">unread</Chip> },
        { key: 'k', label: 'Kind', sort: (n) => n.kind, render: (n) => n.kind },
        { key: 't', label: 'Title', render: (n) => <Link to={n.href} onClick={() => dispatch({ type: 'notification.read', id: n.id })}>{n.title}</Link>, wrap: true },
        { key: 'b', label: 'Detail', render: (n) => n.body, wrap: true },
        { key: 'at', label: 'When', sort: (n) => n.createdAt, render: (n) => <span className="mono">{date(n.createdAt)} <span className="faint">{relDays(n.createdAt, state.clock.slice(0, 10))}</span></span> },
      ]} defaultSort={{ key: 'at', dir: 'descending' }} /></div>
    </>
  );
}

export function SearchPage() {
  const [sp] = useSearchParams();
  const w = useStore().state.world;
  const q = (sp.get('q') ?? '').trim().toLowerCase();
  const hit = (s: string) => s.toLowerCase().includes(q);
  const results = q.length < 2 ? [] : [
    ...w.projects.filter((p) => hit(p.id) || hit(p.name) || hit(p.jurisdiction)).map((p) => ({ kind: 'project', id: p.id, label: p.name, sub: `${p.jurisdiction} · ${p.stage}`, href: `/projects/${p.id}` })),
    ...w.programmes.filter((p) => hit(p.id) || hit(p.name)).map((p) => ({ kind: 'programme', id: p.id, label: p.name, sub: p.phase, href: `/programmes/${p.id}` })),
    ...w.holes.filter((h) => hit(h.id)).slice(0, 50).map((h) => ({ kind: 'hole', id: h.id, label: `${h.type} · ${h.depth} m`, sub: h.status, href: `/drilling/${h.id}` })),
    ...w.batches.filter((b) => hit(b.id) || hit(b.dispatchNo)).map((b) => ({ kind: 'batch', id: b.id, label: `${b.sampleCount} samples`, sub: b.status, href: `/assays/${b.id}` })),
    ...w.approvals.filter((a) => hit(a.id) || hit(a.title)).map((a) => ({ kind: 'approval', id: a.id, label: a.title, sub: a.status, href: `/approvals/${a.id}` })),
    ...w.estimates.filter((e) => hit(e.id)).map((e) => ({ kind: 'estimate', id: e.id, label: w.projects.find((p) => p.id === e.projectId)?.name ?? '', sub: e.status, href: `/resources/estimates/${e.id}` })),
    ...w.tenements.filter((t) => hit(t.id)).map((t) => ({ kind: 'tenement', id: t.id, label: w.projects.find((p) => p.id === t.projectId)?.name ?? '', sub: t.status, href: `/projects/${t.projectId}/tenure` })),
    ...w.users.filter((u) => hit(u.name) || hit(u.email)).map((u) => ({ kind: 'user', id: u.id, label: u.name, sub: u.title, href: `/admin/users` })),
    ...(q.length >= 5 ? w.samples.filter((s) => s.id.includes(q)).slice(0, 20).map((s) => ({ kind: 'sample', id: s.id, label: `${s.holeId} ${s.from}–${s.to} m`, sub: s.type, href: `/drilling/${s.holeId}` })) : []),
  ];
  return (
    <>
      <PageHead title={`Search`} meta={<><span>“{sp.get('q')}”</span><span>{results.length} results</span></>} />
      {q.length < 2 ? <p className="empty">Type at least two characters in the search box.</p> : results.length === 0 ? <p className="empty">Nothing matches “{sp.get('q')}”. Ids are matched on any part; names on any word.</p> : (
        <div className="panel panel--flush"><DataTable caption="Search results" rows={results} rowKey={(r) => r.kind + r.id} cols={[
          { key: 'k', label: 'Kind', sort: (r) => r.kind, render: (r) => <span className="chip">{r.kind}</span> },
          { key: 'id', label: 'Id', sort: (r) => r.id, render: (r) => <Link to={r.href}><span className="mono">{r.id}</span></Link> },
          { key: 'l', label: 'Name', render: (r) => <Link to={r.href}>{r.label}</Link>, wrap: true },
          { key: 's', label: 'Status', render: (r) => r.sub },
        ]} /></div>)}
    </>
  );
}

export function NotFound() {
  return <><PageHead title="Page not found" /><p className="empty">There is nothing at this address. Use the sections along the top, or <Link to="/portfolio">go to the Portfolio</Link>.</p></>;
}
