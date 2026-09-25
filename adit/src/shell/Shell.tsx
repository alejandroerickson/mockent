import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore, useMe } from '../store';
import { l2For } from './l2';
import { Bell, Help, Search, Sun, Moon, Chevron, External } from '../ui/icons';
import { Toasts, useOutside, Foot } from '../ui/primitives';
import { relDays } from '../data/fmt';

const L1 = [
  { to: '/portfolio', label: 'Portfolio' }, { to: '/projects', label: 'Projects' }, { to: '/programmes', label: 'Programmes' }, { to: '/drilling', label: 'Drilling' },
  { to: '/assays', label: 'Assays' }, { to: '/resources', label: 'Resources' }, { to: '/approvals', label: 'Approvals' }, { to: '/optimiser', label: 'Optimiser' }, { to: '/admin', label: 'Admin' },
];

export function Shell() {
  const { state, dispatch } = useStore();
  const me = useMe();
  const loc = useLocation();
  const nav = useNavigate();
  const section = loc.pathname.split('/')[1] || 'portfolio';
  const groups = useMemo(() => l2For(section, state.world, me, loc.search), [section, state.world, me, loc.search]);
  const [tray, setTray] = useState<null | 'notifications' | 'user'>(null);
  const [q, setQ] = useState('');
  const rightRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setTray(null), []);
  useOutside(rightRef, close, tray !== null);
  useEffect(() => { setTray(null); }, [loc.pathname, loc.search]);
  useEffect(() => { document.title = `${titleFor(loc.pathname)} — ADIT`; }, [loc.pathname]);
  const unread = state.world.notifications.filter((n) => n.userId === me.id && !n.read);
  const mine = state.world.notifications.filter((n) => n.userId === me.id).slice(0, 12);
  const pendingForMe = state.world.approvals.filter((a) => a.status === 'pending' && a.steps[a.currentStep].roleCode === me.roleCode).length;

  const search = (e: React.FormEvent) => { e.preventDefault(); if (q.trim()) { nav(`/search?q=${encodeURIComponent(q.trim())}`); setQ(''); } };

  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <header className="topbar" role="banner">
        <Link className="brand" to="/portfolio" aria-label="ADIT home">ADIT <span className="mark">EMS 7.4</span></Link>
        <span className="env" title="Demonstration tenant · synthetic data">DEMO</span>
        <nav className="l1" aria-label="Sections">
          {L1.map((l) => <NavLink key={l.to} to={l.to} className={undefined} aria-current={section === l.to.slice(1) ? 'page' : undefined} end={false}>{l.label}{l.to === '/approvals' && pendingForMe ? <span className="vh"> ({pendingForMe} awaiting you)</span> : null}</NavLink>)}
        </nav>
        <div className="topbar-right" ref={rightRef}>
          <form className="tb-search" role="search" onSubmit={search}>
            <Search />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ids, names, holes" aria-label="Search the tenant" autoComplete="off" />
          </form>
          <button type="button" className="tb-btn" aria-label={`Notifications, ${unread.length} unread`} aria-expanded={tray === 'notifications'} aria-controls="notif-tray" onClick={() => setTray(tray === 'notifications' ? null : 'notifications')}>
            <Bell />{unread.length ? <span className="count" aria-hidden="true">{unread.length}</span> : null}
          </button>
          <a className="tb-btn" href="#/manual" target="_blank" rel="noopener" aria-label="User Manual (opens in a new tab)" title="User Manual"><Help /></a>
          <button type="button" className="tb-btn" aria-label={`Signed in as ${me.name}. Account menu`} aria-expanded={tray === 'user'} aria-controls="user-menu" onClick={() => setTray(tray === 'user' ? null : 'user')}>
            <span className="avatar" aria-hidden="true">{me.initials}</span><Chevron />
          </button>
          <button type="button" className="tb-btn" aria-label={state.theme === 'dark' ? 'Switch to the light theme' : 'Switch to the dark theme'} onClick={() => dispatch({ type: 'theme.set', theme: state.theme === 'dark' ? 'light' : 'dark' })}>{state.theme === 'dark' ? <Sun /> : <Moon />}</button>
          {tray === 'notifications' && (
            <div className="tray" id="notif-tray" role="dialog" aria-label="Notifications">
              <div className="tray-h"><h2>Notifications</h2><button type="button" className="btn btn--small btn--quiet" onClick={() => dispatch({ type: 'notification.readAll' })} disabled={!unread.length}>Mark all read</button></div>
              <ul>
                {mine.length === 0 ? <li><span className="faint small" style={{ display: 'block', padding: 12 }}>Nothing for you yet.</span></li> : mine.map((n) => (
                  <li key={n.id} className={n.read ? undefined : 'unread'}>
                    <Link to={n.href} onClick={() => dispatch({ type: 'notification.read', id: n.id })}>
                      <span className="t">{!n.read ? <span className="dot" aria-hidden="true" /> : null}{n.title}</span>
                      <span className="b">{n.body}</span>
                      <span className="m">{n.kind} · {relDays(n.createdAt, state.clock.slice(0, 10))}</span>
                    </Link>
                  </li>))}
              </ul>
              <div className="tray-f"><Link to="/account/notifications">Notification settings</Link><Link to="/notifications">All notifications</Link></div>
            </div>)}
          {tray === 'user' && (
            <div className="menu" id="user-menu" role="dialog" aria-label="Account">
              <div className="who"><div className="n">{me.name}</div><div className="r">{me.title} · {state.world.roles.find((r) => r.code === me.roleCode)?.name}</div></div>
              <Link to="/account">My profile</Link>
              <Link to="/account/preferences">Preferences</Link>
              <Link to="/account/notifications">Notification settings</Link>
              <a href="#/manual" target="_blank" rel="noopener">User Manual <External /></a>
              <div className="sec">Switch user</div>
              {state.world.users.filter((u) => u.active).map((u) => <button key={u.id} type="button" aria-current={u.id === me.id ? 'true' : undefined} onClick={() => { dispatch({ type: 'user.switch', id: u.id }); setTray(null); }}><span className="avatar" aria-hidden="true">{u.initials}</span>{u.name}<span className="r2">{u.roleCode}</span></button>)}
            </div>)}
        </div>
      </header>
      <div className="shell">
        <details className="l2-wrap" open={typeof window === 'undefined' || window.innerWidth > 800}>
          <summary className="l2-sum">In this section <span className="ct">{groups.reduce((s, g) => s + g.items.length, 0)}</span></summary>
          <nav className="l2" aria-label="In this section">
            {groups.map((g) => (
              <div key={g.label}>
                <div className="sec">{g.label}</div>
                {g.items.map((it) => {
                  const [path, qs] = it.to.split('?');
                  const on = it.exact !== undefined ? it.exact && loc.pathname === path : qs ? loc.pathname === path && loc.search === '?' + qs : loc.pathname === path || loc.pathname.startsWith(path + '/');
                  return <Link key={it.to} to={it.to} aria-current={on ? 'page' : undefined}>{it.label}{it.chip ? <span className="chip">{it.chip}</span> : null}{it.count !== undefined ? <span className="ct">{it.count}</span> : null}</Link>;
                })}
              </div>))}
          </nav>
        </details>
        <main id="content" className="content" tabIndex={-1}>
          <Outlet />
          <Foot />
        </main>
      </div>
      <Toasts />
    </>
  );
}

function titleFor(path: string): string {
  const s = path.split('/')[1] || 'portfolio';
  const t: Record<string, string> = { portfolio: 'Portfolio', projects: 'Projects', programmes: 'Programmes', drilling: 'Drilling', assays: 'Assays', resources: 'Resources', approvals: 'Approvals', optimiser: 'Optimiser', admin: 'Administration', account: 'My account', search: 'Search', notifications: 'Notifications' };
  return t[s] ?? 'ADIT';
}
