// Application state: the seeded tenant plus every change a user makes in this browser.
// Changes persist in localStorage (samples excluded: they are regenerated from the seed).
import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { buildWorld, TODAY, USERS } from './data/world';
import type { World, Rig, Approval, Comment, Notification, AuditEntry, SystemSettings, UserPrefs, User, Programme, Project, OptimiserScenario, SampleBatch, Tenement, ResourceEstimate, Drillhole, CrewAssignment, LogisticsItem, Stage, Outcome } from './data/types';

const STORAGE_KEY = 'adit.tenant.v1';
const SESSION_KEY = 'adit.session.v1';

export interface Toast { id: number; text: string; href?: string }
export interface State {
  world: World;
  currentUserId: string;
  theme: 'dark' | 'light';
  toasts: Toast[];
  clock: string; // the tenant's "now", advanced by actions so the audit order stays sane
}

type Action =
  | { type: 'approval.decide'; id: string; decision: 'approved' | 'rejected' | 'returned'; note?: string }
  | { type: 'approval.withdraw'; id: string }
  | { type: 'approval.create'; approval: Approval }
  | { type: 'comment.add'; entityType: string; entityId: string; body: string }
  | { type: 'notification.read'; id: string }
  | { type: 'notification.readAll' }
  | { type: 'user.switch'; id: string }
  | { type: 'user.prefs'; id: string; prefs: Partial<UserPrefs> }
  | { type: 'user.update'; id: string; patch: Partial<User> }
  | { type: 'user.add'; user: User }
  | { type: 'settings.update'; patch: Partial<SystemSettings> }
  | { type: 'theme.set'; theme: 'dark' | 'light' }
  | { type: 'toast.push'; toast: Toast }
  | { type: 'toast.dismiss'; id: number }
  | { type: 'project.watch'; id: string; watch: boolean }
  | { type: 'project.update'; id: string; patch: Partial<Project> }
  | { type: 'project.create'; project: Project }
  | { type: 'project.gate'; id: string; decision: 'advance' | 'hold' | 'relinquish' | 'resume'; toStage?: Stage; outcome?: Outcome; note: string }
  | { type: 'programme.update'; id: string; patch: Partial<Programme> }
  | { type: 'programme.create'; programme: Programme }
  | { type: 'programme.crew'; id: string; crew: CrewAssignment[] }
  | { type: 'programme.logistics'; id: string; item: LogisticsItem }
  | { type: 'hole.update'; id: string; patch: Partial<Drillhole> }
  | { type: 'batch.update'; id: string; patch: Partial<SampleBatch> }
  | { type: 'batch.create'; batch: SampleBatch }
  | { type: 'rigs.set'; rigs: Rig[] }
  | { type: 'tenement.update'; id: string; patch: Partial<Tenement> }
  | { type: 'estimate.update'; id: string; patch: Partial<ResourceEstimate> }
  | { type: 'estimate.create'; estimate: ResourceEstimate }
  | { type: 'scenario.save'; scenario: OptimiserScenario }
  | { type: 'scenario.delete'; id: string }
  | { type: 'target.lock'; id: string; locked: boolean }
  | { type: 'tenant.reset' };

let toastSeq = 1;
let idSeq = 1000;
const nextId = (prefix: string) => `${prefix}-${(idSeq++).toString(36)}`;

function tick(clock: string): string {
  const d = new Date(clock);
  d.setUTCMinutes(d.getUTCMinutes() + 1 + Math.floor(Math.random() * 3));
  return d.toISOString().slice(0, 19) + 'Z';
}

function audit(s: State, action: string, entityType: string, entityId: string, detail: string): AuditEntry {
  return { id: nextId('a'), at: s.clock, userId: s.currentUserId, action, entityType, entityId, detail };
}
function notif(s: State, userId: string, kind: Notification['kind'], title: string, body: string, href: string): Notification {
  return { id: nextId('n'), userId, kind, title, body, href, createdAt: s.clock, read: false };
}

export function reduce(s: State, a: Action): State {
  const w = s.world;
  const clock = tick(s.clock);
  const me = s.currentUserId;
  switch (a.type) {
    case 'approval.decide': {
      const ap = w.approvals.find((x) => x.id === a.id);
      if (!ap || ap.status !== 'pending') return s;
      const steps = ap.steps.map((st) => ({ ...st }));
      const st = steps[ap.currentStep];
      st.decision = a.decision; st.on = clock.slice(0, 10); st.actorId = me; st.note = a.note;
      let status: Approval['status'] = 'pending';
      let currentStep = ap.currentStep;
      if (a.decision === 'rejected') status = 'rejected';
      else if (a.decision === 'returned') status = 'returned';
      else if (ap.currentStep >= steps.length - 1) status = 'approved';
      else currentStep = ap.currentStep + 1;
      const next = { ...ap, steps, status, currentStep };
      const notes: Notification[] = [];
      if (status === 'pending') {
        const nextActor = w.users.find((u) => u.active && u.roleCode === steps[currentStep].roleCode);
        if (nextActor) notes.push(notif(s, nextActor.id, 'approval', `Awaiting your ${steps[currentStep].name.toLowerCase()}`, ap.title, `/approvals/${ap.id}`));
      } else if (ap.requestedById !== me) {
        notes.push(notif(s, ap.requestedById, 'approval', `${ap.title}: ${status}`, a.note ? `${st.name}: ${a.note}` : `${st.name} by ${w.users.find((u) => u.id === me)?.name}`, `/approvals/${ap.id}`));
      }
      let programmes = w.programmes;
      if (status === 'approved' && ap.subjectType === 'programme' && ap.type === 'programme') programmes = w.programmes.map((p) => (p.id === ap.subjectId && ['costed', 'scoped', 'draft'].includes(p.phase) ? { ...p, phase: 'approved' as const } : p));
      let estimates = w.estimates;
      if (status === 'approved' && ap.type === 'resource-release') estimates = w.estimates.map((e) => (e.id === ap.subjectId ? { ...e, status: 'released' as const } : e));
      let tenements = w.tenements;
      if (status === 'approved' && ap.type === 'tenement-renewal') tenements = w.tenements.map((t) => (t.id === ap.subjectId ? { ...t, status: 'renewal-lodged' as const } : t));
      return { ...s, clock, world: { ...w, approvals: w.approvals.map((x) => (x.id === a.id ? next : x)), programmes, estimates, tenements, notifications: [...notes, ...w.notifications], audit: [audit(s, `approval.${a.decision}`, 'approval', ap.id, `${st.name}: ${a.decision}${a.note ? ' — ' + a.note : ''}`), ...w.audit] } };
    }
    case 'approval.withdraw': {
      const ap = w.approvals.find((x) => x.id === a.id);
      if (!ap) return s;
      return { ...s, clock, world: { ...w, approvals: w.approvals.map((x) => (x.id === a.id ? { ...x, status: 'withdrawn' } : x)), audit: [audit(s, 'approval.withdrawn', 'approval', ap.id, ap.title), ...w.audit] } };
    }
    case 'approval.create': {
      const first = a.approval.steps[0];
      const actor = w.users.find((u) => u.active && u.roleCode === first.roleCode);
      const notes = actor ? [notif(s, actor.id, 'approval', `Awaiting your ${first.name.toLowerCase()}`, a.approval.title, `/approvals/${a.approval.id}`)] : [];
      return { ...s, clock, world: { ...w, approvals: [a.approval, ...w.approvals], notifications: [...notes, ...w.notifications], audit: [audit(s, 'approval.submitted', 'approval', a.approval.id, a.approval.title), ...w.audit] } };
    }
    case 'comment.add': {
      const c: Comment = { id: nextId('c'), entityType: a.entityType, entityId: a.entityId, authorId: me, body: a.body, createdAt: clock };
      // notify the record's owner where there is one
      const notes: Notification[] = [];
      const author = w.users.find((u) => u.id === me)?.name ?? 'Someone';
      const mentioned = w.users.filter((u) => u.id !== me && a.body.includes('@' + u.name.split(' ')[0]));
      for (const u of mentioned) notes.push(notif(s, u.id, 'mention', `${author} mentioned you`, a.body.slice(0, 120), `/${a.entityType === 'project' ? 'projects' : a.entityType === 'approval' ? 'approvals' : a.entityType === 'programme' ? 'programmes' : a.entityType === 'batch' ? 'assays' : a.entityType + 's'}/${a.entityId}`));
      if (a.entityType === 'project') { const p = w.projects.find((x) => x.id === a.entityId); for (const uid of new Set([p?.managerId, p?.geologistId])) if (uid && uid !== me && !mentioned.some((u) => u.id === uid)) notes.push(notif(s, uid, 'mention', `${author} commented on ${p?.name}`, a.body.slice(0, 120), `/projects/${a.entityId}`)); }
      if (a.entityType === 'approval') { const ap = w.approvals.find((x) => x.id === a.entityId); if (ap && ap.requestedById !== me) notes.push(notif(s, ap.requestedById, 'mention', `${author} commented on ${ap.id}`, a.body.slice(0, 120), `/approvals/${a.entityId}`)); }
      return { ...s, clock, world: { ...w, comments: [...w.comments, c], notifications: [...notes, ...w.notifications], audit: [audit(s, 'comment.added', a.entityType, a.entityId, a.body.slice(0, 60)), ...w.audit] } };
    }
    case 'notification.read': return { ...s, world: { ...w, notifications: w.notifications.map((n) => (n.id === a.id ? { ...n, read: true } : n)) } };
    case 'notification.readAll': return { ...s, world: { ...w, notifications: w.notifications.map((n) => (n.userId === me ? { ...n, read: true } : n)) } };
    case 'user.switch': return { ...s, clock, currentUserId: a.id, world: { ...w, users: w.users.map((u) => (u.id === a.id ? { ...u, lastSignIn: clock } : u)), audit: [{ ...audit(s, 'session.signin', 'user', a.id, 'Signed in'), userId: a.id }, ...w.audit] } };
    case 'user.prefs': return { ...s, clock, world: { ...w, users: w.users.map((u) => (u.id === a.id ? { ...u, prefs: { ...u.prefs, ...a.prefs } } : u)), audit: [audit(s, 'user.prefs', 'user', a.id, Object.keys(a.prefs).join(', ')), ...w.audit] } };
    case 'user.update': return { ...s, clock, world: { ...w, users: w.users.map((u) => (u.id === a.id ? { ...u, ...a.patch } : u)), audit: [audit(s, 'user.updated', 'user', a.id, Object.keys(a.patch).join(', ')), ...w.audit] } };
    case 'user.add': return { ...s, clock, world: { ...w, users: [...w.users, a.user], audit: [audit(s, 'user.created', 'user', a.user.id, a.user.name), ...w.audit] } };
    case 'settings.update': return { ...s, clock, world: { ...w, settings: { ...w.settings, ...a.patch }, audit: [audit(s, 'settings.updated', 'settings', 'system', Object.keys(a.patch).join(', ')), ...w.audit] } };
    case 'theme.set': return { ...s, theme: a.theme };
    case 'toast.push': return { ...s, toasts: [...s.toasts, a.toast] };
    case 'toast.dismiss': return { ...s, toasts: s.toasts.filter((t) => t.id !== a.id) };
    case 'project.watch': return { ...s, clock, world: { ...w, projects: w.projects.map((p) => (p.id === a.id ? { ...p, watch: a.watch } : p)), audit: [audit(s, a.watch ? 'project.watch' : 'project.unwatch', 'project', a.id, a.watch ? 'Added to watch list' : 'Removed from watch list'), ...w.audit] } };
    case 'project.update': return { ...s, clock, world: { ...w, projects: w.projects.map((p) => (p.id === a.id ? { ...p, ...a.patch } : p)), audit: [audit(s, 'project.updated', 'project', a.id, Object.keys(a.patch).join(', ')), ...w.audit] } };
    case 'project.create': return { ...s, clock, world: { ...w, projects: [a.project, ...w.projects], audit: [audit(s, 'project.created', 'project', a.project.id, a.project.name), ...w.audit] } };
    case 'project.gate': {
      const p = w.projects.find((x) => x.id === a.id);
      if (!p) return s;
      let patch: Partial<Project> = {};
      if (a.decision === 'advance' && a.toStage) patch = { stage: a.toStage, status: 'active', nextGateOn: undefined };
      if (a.decision === 'hold') patch = { status: 'on-hold' };
      if (a.decision === 'resume') patch = { status: 'active' };
      if (a.decision === 'relinquish') patch = { status: 'closed', outcome: a.outcome ?? 'relinquished', closedOn: clock.slice(0, 10) };
      if (a.decision === 'advance' && !a.toStage) patch = { status: 'closed', outcome: 'advanced', closedOn: clock.slice(0, 10) };
      const notes = [p.geologistId, p.managerId].filter((u) => u !== me).map((u) => notif(s, u, 'programme', `Stage-gate decision recorded: ${p.name}`, `${a.decision}${a.toStage ? ' to ' + a.toStage : ''}. ${a.note}`, `/projects/${p.id}`));
      return { ...s, clock, world: { ...w, projects: w.projects.map((x) => (x.id === a.id ? { ...x, ...patch } : x)), notifications: [...notes, ...w.notifications], audit: [audit(s, `gate.${a.decision}`, 'project', a.id, a.note), ...w.audit] } };
    }
    case 'programme.update': return { ...s, clock, world: { ...w, programmes: w.programmes.map((p) => (p.id === a.id ? { ...p, ...a.patch } : p)), audit: [audit(s, 'programme.updated', 'programme', a.id, Object.keys(a.patch).join(', ')), ...w.audit] } };
    case 'programme.create': return { ...s, clock, world: { ...w, programmes: [a.programme, ...w.programmes], audit: [audit(s, 'programme.created', 'programme', a.programme.id, a.programme.name), ...w.audit] } };
    case 'programme.crew': {
      const prg = w.programmes.find((p) => p.id === a.id);
      const added = a.crew.filter((c) => !prg?.crew.some((x) => x.personId === c.personId && x.from === c.from));
      const notes = added.filter((c) => w.users.some((u) => u.id === c.personId && u.id !== me)).map((c) => notif(s, c.personId, 'programme', `Assigned to ${prg?.name}`, `${c.role}, ${c.from} to ${c.to}`, `/programmes/${a.id}`));
      return { ...s, clock, world: { ...w, programmes: w.programmes.map((p) => (p.id === a.id ? { ...p, crew: a.crew } : p)), notifications: [...notes, ...w.notifications], audit: [audit(s, 'programme.crew', 'programme', a.id, `${a.crew.length} assignments`), ...w.audit] } };
    }
    case 'programme.logistics': return { ...s, clock, world: { ...w, programmes: w.programmes.map((p) => (p.id === a.id ? { ...p, logistics: p.logistics.some((l) => l.id === a.item.id) ? p.logistics.map((l) => (l.id === a.item.id ? a.item : l)) : [...p.logistics, a.item] } : p)), audit: [audit(s, 'logistics.saved', 'programme', a.id, `${a.item.kind}: ${a.item.description}`), ...w.audit] } };
    case 'hole.update': return { ...s, clock, world: { ...w, holes: w.holes.map((h) => (h.id === a.id ? { ...h, ...a.patch } : h)), audit: [audit(s, 'hole.updated', 'hole', a.id, Object.keys(a.patch).join(', ')), ...w.audit] } };
    case 'batch.update': {
      const b = w.batches.find((x) => x.id === a.id);
      const notes: Notification[] = [];
      if (b && a.patch.status && a.patch.status !== b.status) {
        const p = w.projects.find((x) => x.id === b.projectId);
        for (const uid of new Set([p?.geologistId, 'u-praghunathan'])) if (uid && uid !== me) notes.push(notif(s, uid, 'assay', `Batch ${b.id} ${a.patch.status}`, `${p?.name}: ${b.sampleCount} samples`, `/assays/${b.id}`));
      }
      return { ...s, clock, world: { ...w, batches: w.batches.map((x) => (x.id === a.id ? { ...x, ...a.patch } : x)), notifications: [...notes, ...w.notifications], audit: [audit(s, 'batch.updated', 'batch', a.id, Object.entries(a.patch).map(([k, v]) => `${k}: ${String(v)}`).join(', ')), ...w.audit] } };
    }
    case 'batch.create': return { ...s, clock, world: { ...w, batches: [a.batch, ...w.batches], audit: [audit(s, 'batch.submitted', 'batch', a.batch.id, `${a.batch.sampleCount} samples, ${a.batch.holeIds.length} holes`), ...w.audit] } };
    case 'rigs.set': return { ...s, clock, world: { ...w, rigs: a.rigs, audit: [audit(s, 'rig.updated', 'rig', a.rigs.map((r) => r.id).join(','), 'Rig register updated'), ...w.audit] } };
    case 'tenement.update': return { ...s, clock, world: { ...w, tenements: w.tenements.map((t) => (t.id === a.id ? { ...t, ...a.patch } : t)), audit: [audit(s, 'tenement.updated', 'tenement', a.id, Object.keys(a.patch).join(', ')), ...w.audit] } };
    case 'estimate.update': return { ...s, clock, world: { ...w, estimates: w.estimates.map((e) => (e.id === a.id ? { ...e, ...a.patch } : e)), audit: [audit(s, 'estimate.updated', 'estimate', a.id, Object.keys(a.patch).join(', ')), ...w.audit] } };
    case 'estimate.create': return { ...s, clock, world: { ...w, estimates: [a.estimate, ...w.estimates], audit: [audit(s, 'estimate.saved', 'estimate', a.estimate.id, 'draft'), ...w.audit] } };
    case 'scenario.save': return { ...s, clock, world: { ...w, scenarios: [a.scenario, ...w.scenarios.filter((x) => x.id !== a.scenario.id)], audit: [audit(s, 'optimiser.run', 'scenario', a.scenario.id, a.scenario.name), ...w.audit] } };
    case 'scenario.delete': return { ...s, clock, world: { ...w, scenarios: w.scenarios.filter((x) => x.id !== a.id) } };
    case 'target.lock': return { ...s, world: { ...w, targets: w.targets.map((t) => (t.id === a.id ? { ...t, locked: a.locked } : t)) } };
    case 'tenant.reset': return { ...s, clock: tick(buildWorld().asOf), world: buildWorld(), toasts: [] };
  }
}

const PERSISTED: (keyof World)[] = ['projects', 'tenements', 'programmes', 'holes', 'batches', 'estimates', 'approvals', 'comments', 'notifications', 'audit', 'users', 'settings', 'targets', 'scenarios', 'rigs', 'camps'];

function load(): State {
  const world = buildWorld();
  let currentUserId = USERS[0].id;
  let theme: 'dark' | 'light' = 'dark';
  let clock = world.asOf;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved.version === 1) { for (const k of PERSISTED) if (saved.world[k]) (world as unknown as Record<string, unknown>)[k] = saved.world[k]; clock = saved.clock ?? clock; }
    }
    const sess = JSON.parse(localStorage.getItem(SESSION_KEY) ?? '{}');
    if (sess.currentUserId && world.users.some((u) => u.id === sess.currentUserId)) currentUserId = sess.currentUserId;
    if (sess.theme === 'light') theme = 'light';
  } catch { /* fresh tenant */ }
  return { world, currentUserId, theme, toasts: [], clock };
}

function save(s: State) {
  try {
    const world: Partial<World> = {};
    for (const k of PERSISTED) (world as Record<string, unknown>)[k] = s.world[k];
    // audit and notifications are capped so the store never grows without bound
    world.audit = s.world.audit.slice(0, 2000);
    world.notifications = s.world.notifications.slice(0, 500);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, world, clock: s.clock }));
    localStorage.setItem(SESSION_KEY, JSON.stringify({ currentUserId: s.currentUserId, theme: s.theme }));
  } catch { /* storage unavailable */ }
}

interface Ctx { state: State; dispatch: (a: Action) => void; toast: (text: string, href?: string) => void }
const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduce, undefined, load);
  useEffect(() => { save(state); }, [state.world, state.currentUserId, state.theme]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!window.location.hash.startsWith('#/manual')) document.documentElement.dataset.theme = state.theme; }, [state.theme]);
  const ctx = useMemo<Ctx>(() => ({
    state,
    dispatch,
    toast: (text, href) => { const id = toastSeq++; dispatch({ type: 'toast.push', toast: { id, text, href } }); setTimeout(() => dispatch({ type: 'toast.dismiss', id }), 6000); },
  }), [state]);
  return <StoreContext.Provider value={ctx}>{children}</StoreContext.Provider>;
}

export function useStore(): Ctx {
  const c = useContext(StoreContext);
  if (!c) throw new Error('useStore outside StoreProvider');
  return c;
}
export function useWorld(): World { return useStore().state.world; }
export function useMe(): User { const { state } = useStore(); return state.world.users.find((u) => u.id === state.currentUserId) ?? state.world.users[0]; }
export function can(user: User, perm: string, world: World): boolean { return world.roles.find((r) => r.code === user.roleCode)?.permissions.includes(perm) ?? false; }
export { TODAY };
