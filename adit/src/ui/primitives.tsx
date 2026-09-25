import { useEffect, useMemo, useRef, useState, type ReactNode, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Sort, Close } from './icons';
import { useStore } from '../store';

// ---------- status chips: neutral, told apart by fill, dash and weight ----------
const SOFT = new Set(['approved', 'released', 'complete', 'accepted', 'current', 'active', 'delivered', 'confirmed', 'assayed', 'closed', 'available', 'open']);
const DASH = new Set(['pending', 'draft', 'planned', 'requested', 'submitted', 'application', 'expiring', 'qaqc-hold', 'on-hold', 'returned', 'maintenance', 'winterised', 'in-prep', 'analysing']);
const STRONG = new Set(['rejected', 'lapsed', 'abandoned', 'cancelled', 'withdrawn', 'superseded', 'demobilised']);
export function Chip({ status, children, title }: { status?: string; children?: ReactNode; title?: string }) {
  const s = status ?? '';
  const cls = ['chip', SOFT.has(s) ? 'chip--soft' : '', DASH.has(s) ? 'chip--dash' : '', STRONG.has(s) ? 'chip--strong' : ''].join(' ').trim();
  return <span className={cls} title={title} data-status={status || undefined}>{children ?? s.replace(/-/g, ' ')}</span>;
}
export function CatSwatch({ cat }: { cat: number }) { return <span className={`sw cat-${cat}`} aria-hidden="true" />; }

// ---------- money / figures ----------
export function Signed({ n, fmt, word }: { n: number; fmt: (x: number) => string; word?: [string, string] }) {
  const cls = n > 0 ? 'pos' : n < 0 ? 'neg' : '';
  return <span className={`mono ${cls}`}>{n > 0 ? '+' : n < 0 ? '−' : ''}{fmt(Math.abs(n))}{word && n !== 0 ? <span className="unit" style={{ opacity: 0.85 }}>{n > 0 ? word[0] : word[1]}</span> : null}</span>;
}

// ---------- sortable, paged table ----------
export interface Col<T> { key: string; label: ReactNode; sr?: string; num?: boolean; sort?: (r: T) => string | number | null | undefined; render: (r: T) => ReactNode; wrap?: boolean; sticky?: boolean; hint?: string }
export function DataTable<T>({ rows, cols, rowKey, caption, pageSize, empty = 'No records match.', defaultSort, compact, selectedKey, foot, id }: { rows: T[]; cols: Col<T>[]; rowKey: (r: T) => string; caption: string; pageSize?: number; empty?: string; defaultSort?: { key: string; dir: 'ascending' | 'descending' }; compact?: boolean; selectedKey?: string; foot?: ReactNode; id?: string }) {
  const [sort, setSort] = useState<{ key: string; dir: 'ascending' | 'descending' } | null>(defaultSort ?? null);
  const [page, setPage] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const c = cols.find((x) => x.key === sort.key);
    if (!c?.sort) return rows;
    const s = c.sort;
    return rows.slice().sort((a, b) => { const va = s(a) ?? '', vb = s(b) ?? ''; const r = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb)); return sort.dir === 'ascending' ? r : -r; });
  }, [rows, sort, cols]);
  const ps = pageSize ?? Infinity;
  const pages = Math.max(1, Math.ceil(sorted.length / ps));
  const cur = Math.min(page, pages - 1);
  const view = Number.isFinite(ps) ? sorted.slice(cur * ps, cur * ps + ps) : sorted;
  useEffect(() => { setPage(0); }, [rows.length]);
  useEffect(() => { const el = wrapRef.current; if (!el) return; const f = () => setOverflow(Math.max(0, el.scrollWidth - el.clientWidth)); f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect(); }, [rows.length, cols.length]);
  const toggle = (k: string) => setSort((s) => (s?.key === k ? { key: k, dir: s.dir === 'ascending' ? 'descending' : 'ascending' } : { key: k, dir: 'ascending' }));
  return (
    <div>
      <div className="tbl-wrap" ref={wrapRef}>
        <table className={`tbl${compact ? ' tbl--compact' : ''}`} id={id}>
          <caption className="vh">{caption}</caption>
          <thead><tr>{cols.map((c) => (
            <th key={c.key} scope="col" className={c.num ? 'num' : undefined} aria-sort={sort?.key === c.key ? sort.dir : c.sort ? 'none' : undefined} title={c.hint}>
              {c.sort ? <button type="button" className="th-btn" onClick={() => toggle(c.key)} aria-label={`Sort by ${c.sr ?? (typeof c.label === 'string' ? c.label : c.key)}`}>{c.label}<Sort dir={sort?.key === c.key ? sort.dir : null} /></button> : c.label}
            </th>))}</tr></thead>
          <tbody>
            {view.length === 0 ? <tr><td colSpan={cols.length} className="dash" style={{ textAlign: 'center', padding: 20 }}>{empty}</td></tr> : view.map((r) => { const k = rowKey(r); return (
              <tr key={k} aria-selected={selectedKey === k ? 'true' : undefined} data-key={k}>
                {cols.map((c) => <td key={c.key} className={[c.num ? 'num' : '', c.wrap ? 'wrap' : ''].join(' ').trim() || undefined}>{c.render(r)}</td>)}
              </tr>); })}
          </tbody>
          {foot ? <tfoot>{foot}</tfoot> : null}
        </table>
      </div>
      {(overflow > 0 || Number.isFinite(ps)) && (
        <div className="tbl-foot">
          <span>{sorted.length.toLocaleString('en-CA')} row{sorted.length === 1 ? '' : 's'}{Number.isFinite(ps) && sorted.length > ps ? ` · showing ${cur * ps + 1}–${Math.min(sorted.length, cur * ps + ps)}` : ''}</span>
          {Number.isFinite(ps) && pages > 1 && (
            <nav className="pager" aria-label={`${caption} pages`}>
              <button type="button" className="btn btn--small" onClick={() => setPage(0)} disabled={cur === 0}>First</button>
              <button type="button" className="btn btn--small" onClick={() => setPage(cur - 1)} disabled={cur === 0}>Previous</button>
              <span className="mono" aria-current="page">{cur + 1} / {pages}</span>
              <button type="button" className="btn btn--small" onClick={() => setPage(cur + 1)} disabled={cur >= pages - 1}>Next</button>
              <button type="button" className="btn btn--small" onClick={() => setPage(pages - 1)} disabled={cur >= pages - 1}>Last</button>
            </nav>)}
        </div>)}
    </div>
  );
}

// ---------- dialog ----------
export function Dialog({ open, onClose, title, summary, children, wide, label }: { open: boolean; onClose: () => void; title: string; summary?: ReactNode; children: ReactNode; wide?: boolean; label?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = ref.current; if (!d) return; if (open && !d.open) d.showModal(); if (!open && d.open) d.close(); }, [open]);
  return (
    <dialog ref={ref} className={`dlg${wide ? ' dlg--wide' : ''}`} onClose={onClose} onCancel={(e) => { e.preventDefault(); onClose(); }} aria-label={label ?? title} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div onClick={(e) => e.stopPropagation()}>
        <div className="row row--between" style={{ alignItems: 'flex-start' }}>
          <h2>{title}</h2>
          <button type="button" className="btn btn--quiet btn--small" onClick={onClose} aria-label="Close dialog"><Close /></button>
        </div>
        {summary ? <p className="sum">{summary}</p> : null}
        {open ? children : null}
      </div>
    </dialog>
  );
}

// ---------- toasts ----------
export function Toasts() {
  const { state, dispatch } = useStore();
  if (!state.toasts.length) return null;
  return (
    <div className="toasts" role="status" aria-live="polite">
      {state.toasts.map((t) => (
        <div className="toast" key={t.id}>
          <span>{t.text}</span>
          {t.href ? <Link to={t.href}>Open</Link> : null}
          <button type="button" onClick={() => dispatch({ type: 'toast.dismiss', id: t.id })} aria-label="Dismiss"><Close /></button>
        </div>))}
    </div>
  );
}

// ---------- comments ----------
export function Comments({ entityType, entityId }: { entityType: string; entityId: string }) {
  const { state, dispatch, toast } = useStore();
  const [body, setBody] = useState('');
  const list = state.world.comments.filter((c) => c.entityType === entityType && c.entityId === entityId).sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  const submit = (e: FormEvent) => { e.preventDefault(); const t = body.trim(); if (!t) return; dispatch({ type: 'comment.add', entityType, entityId, body: t }); setBody(''); toast('Comment added'); };
  return (
    <section className="panel" aria-labelledby={`comments-${entityId}`}>
      <div className="ph"><h2 id={`comments-${entityId}`}>Comments</h2><span className="r">{list.length}</span></div>
      {list.length === 0 ? <p className="faint small">No comments on this record.</p> : (
        <ul className="comments">
          {list.map((c) => { const u = state.world.users.find((x) => x.id === c.authorId); return (
            <li key={c.id}>
              <span className="avatar" aria-hidden="true">{u?.initials ?? '?'}</span>
              <div>
                <div className="who"><b>{u?.name ?? c.authorId}</b><span>{u?.title}</span><time dateTime={c.createdAt}>{c.createdAt.slice(0, 16).replace('T', ' ')}</time></div>
                <p>{c.body}</p>
              </div>
            </li>); })}
        </ul>)}
      <form className="comment-form" onSubmit={submit}>
        <label className="field"><span>Add a comment</span><textarea value={body} onChange={(e) => setBody(e.target.value)} rows={2} placeholder="Type @ and a first name to notify a colleague" /></label>
        <button type="submit" className="btn" disabled={!body.trim()}>Post comment</button>
      </form>
    </section>
  );
}

// ---------- page head ----------
export function PageHead({ title, id, meta, actions, crumbs }: { title: ReactNode; id?: string; meta?: ReactNode; actions?: ReactNode; crumbs?: { to?: string; label: ReactNode }[] }) {
  return (
    <>
      {crumbs ? <nav className="crumbs" aria-label="Breadcrumb">{crumbs.map((c, i) => <span key={i} style={{ display: 'contents' }}>{i > 0 ? <span aria-hidden="true">/</span> : null}{c.to ? <Link to={c.to}>{c.label}</Link> : <span className="id">{c.label}</span>}</span>)}</nav> : null}
      <div className="head">
        <div><h1>{title}{id ? <span className="id">{id}</span> : null}</h1>{meta ? <div className="meta">{meta}</div> : null}</div>
        {actions ? <div className="actions">{actions}</div> : null}
      </div>
    </>
  );
}

export function Slot({ label, value, unit, sub, hero, long, cls }: { label: string; value: ReactNode; unit?: string; sub?: ReactNode; hero?: boolean; long?: boolean; cls?: string }) {
  return <div className={`slot${hero ? ' slot--hero' : ''}`}><span className="l">{label}</span><span className={`f${hero ? ' hero' : ''}${long ? ' long' : ''} ${cls ?? ''}`}>{value}{unit ? <span className="unit">{unit}</span> : null}</span>{sub ? <span className="s">{sub}</span> : null}</div>;
}

export function Authority({ text, detail }: { text: string; detail?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="authority" style={{ width: '100%', cursor: detail ? 'pointer' : 'default', textAlign: 'left' }} onClick={() => detail && setOpen(!open)} aria-expanded={detail ? open : undefined}>
        <span>{text}</span>{detail ? <span className="hint">{open ? 'hide method' : 'show method'}</span> : null}
      </button>
      {open && detail ? <div className="kv--well" style={{ borderTop: 0, borderRadius: '0 0 3px 3px', fontSize: 12 }}>{detail}</div> : null}
    </>
  );
}

export function Foot() {
  const { state } = useStore();
  return (
    <footer className="foot">
      <span>ADIT 7.4.2 · Brannock Geosystems · {state.world.settings.tenantName}</span>
      <span>Support: support@brannockgeo.example · +1 800 555 0199 · <a href="#/manual" target="_blank" rel="noopener">User Manual</a></span>
    </footer>
  );
}

export function useOutside(ref: React.RefObject<HTMLElement | null>, onOut: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onOut(); };
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onOut(); };
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [ref, onOut, active]);
}
