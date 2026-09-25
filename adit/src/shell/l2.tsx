// The "in this section" column. Each L1 section lists its shapes and cuts here.
import type { World, User } from '../data/types';
import { STAGES, COMMODITIES } from '../data/world';

export interface L2Item { to: string; label: string; count?: number | string; chip?: string; exact?: boolean }
export interface L2Group { label: string; items: L2Item[] }

export function l2For(section: string, world: World, me: User, search: string): L2Group[] {
  const q = new URLSearchParams(search);
  const active = world.projects.filter((p) => p.status !== 'closed');
  switch (section) {
    case 'portfolio':
      return [
        { label: 'Shape', items: [{ to: '/portfolio', label: 'By stage', exact: true }, { to: '/portfolio/commodity', label: 'By commodity' }, { to: '/portfolio/jurisdiction', label: 'By jurisdiction' }, { to: '/portfolio/analytics', label: 'Analytics' }, { to: '/portfolio/budget', label: 'Budget' }] },
        { label: 'Watching', items: world.projects.filter((p) => p.watch).map((p) => ({ to: `/projects/${p.id}`, label: p.name, count: p.id.slice(4) })) },
      ];
    case 'projects':
      return [
        { label: 'Projects', items: [{ to: '/projects', label: 'All active', count: active.length, exact: !q.get('status') && !q.get('commodity') && !q.get('stage') }, { to: '/projects?status=on-hold', label: 'On hold', count: world.projects.filter((p) => p.status === 'on-hold').length }, { to: '/projects?status=closed', label: 'Closed', count: world.projects.filter((p) => p.status === 'closed').length }] },
        { label: 'By commodity', items: COMMODITIES.map((c) => ({ to: `/projects?commodity=${c.code}`, label: c.name, count: active.filter((p) => p.commodity === c.code).length })) },
        { label: 'By stage', items: STAGES.map((s) => ({ to: `/projects?stage=${s.code}`, label: s.name, count: active.filter((p) => p.stage === s.code).length })) },
      ];
    case 'programmes':
      return [
        { label: 'Programmes', items: [{ to: '/programmes', label: 'In the field', count: world.programmes.filter((p) => ['mobilising', 'in-progress', 'demobilising'].includes(p.phase)).length, exact: !q.get('phase') && !q.get('type') }, { to: '/programmes?phase=planning', label: 'In planning', count: world.programmes.filter((p) => ['draft', 'scoped', 'costed', 'approved'].includes(p.phase)).length }, { to: '/programmes?phase=complete', label: 'Complete', count: world.programmes.filter((p) => p.phase === 'complete').length }, { to: '/programmes?phase=all', label: 'All programmes', count: world.programmes.length }] },
        { label: 'Resources', items: [{ to: '/programmes/schedule', label: 'Schedule' }, { to: '/programmes/rigs', label: 'Rigs', count: world.rigs.length }, { to: '/programmes/camps', label: 'Camps', count: world.camps.length }, { to: '/programmes/crew', label: 'Crew rotations' }] },
      ];
    case 'drilling':
      return [
        { label: 'Drillholes', items: [{ to: '/drilling', label: 'All holes', count: world.holes.length, exact: !q.get('status') }, { to: '/drilling?status=drilling', label: 'Drilling now', count: world.holes.filter((h) => h.status === 'drilling').length }, { to: '/drilling?status=planned', label: 'Planned', count: world.holes.filter((h) => h.status === 'planned').length }, { to: '/drilling?status=logged', label: 'Awaiting sampling', count: world.holes.filter((h) => h.status === 'logged').length }, { to: '/drilling?status=abandoned', label: 'Abandoned', count: world.holes.filter((h) => h.status === 'abandoned').length }] },
        { label: 'Results', items: [{ to: '/drilling/intercepts', label: 'Significant intercepts', count: world.intercepts.filter((i) => i.significant).length }] },
      ];
    case 'assays':
      return [
        { label: 'Batches', items: [{ to: '/assays', label: 'All batches', count: world.batches.length, exact: !q.get('status') }, { to: '/assays?status=lab', label: 'At the laboratory', count: world.batches.filter((b) => ['submitted', 'in-prep', 'analysing'].includes(b.status)).length }, { to: '/assays?status=received', label: 'Received, unreviewed', count: world.batches.filter((b) => b.status === 'received').length }, { to: '/assays?status=qaqc-hold', label: 'QAQC hold', count: world.batches.filter((b) => b.status === 'qaqc-hold').length }, { to: '/assays?status=accepted', label: 'Accepted', count: world.batches.filter((b) => b.status === 'accepted').length }] },
        { label: 'Quality', items: [{ to: '/assays/qaqc', label: 'QAQC summary' }, { to: '/assays/samples', label: 'Sample register', count: world.samples.length.toLocaleString('en-CA') }] },
      ];
    case 'resources':
      return [
        { label: 'Estimates', items: [{ to: '/resources', label: 'Portfolio resources', exact: true }, { to: '/resources/estimates', label: 'All estimates', count: world.estimates.length }, { to: '/resources/estimates?status=review', label: 'In review', count: world.estimates.filter((e) => ['internal-review', 'qp-review', 'draft'].includes(e.status)).length }] },
        { label: 'Valuation', items: [{ to: '/resources/valuation', label: 'In-situ value' }, { to: '/resources/forecast', label: 'Forecast' }, { to: '/resources/price-deck', label: 'Price deck' }] },
      ];
    case 'approvals': {
      const mine = world.approvals.filter((a) => a.status === 'pending' && a.steps[a.currentStep].roleCode === me.roleCode);
      return [
        { label: 'Queue', items: [{ to: '/approvals', label: 'Awaiting me', count: mine.length, exact: !q.get('view') }, { to: '/approvals?view=pending', label: 'All pending', count: world.approvals.filter((a) => a.status === 'pending').length }, { to: '/approvals?view=mine', label: 'Raised by me', count: world.approvals.filter((a) => a.requestedById === me.id).length }, { to: '/approvals?view=decided', label: 'Decided', count: world.approvals.filter((a) => a.status !== 'pending').length }] },
        { label: 'By type', items: world.workflows.map((w) => ({ to: `/approvals?view=pending&type=${w.type}`, label: w.name, count: world.approvals.filter((a) => a.status === 'pending' && a.type === w.type).length })) },
      ];
    }
    case 'optimiser':
      return [
        { label: 'Optimiser', items: [{ to: '/optimiser', label: 'Programme optimiser', exact: true }, { to: '/optimiser/targets', label: 'Candidate targets', count: world.targets.length }, { to: '/optimiser/scenarios', label: 'Saved scenarios', count: world.scenarios.length }] },
      ];
    case 'admin':
      return [
        { label: 'System', items: [{ to: '/admin', label: 'System settings', exact: true }, { to: '/admin/price-deck', label: 'Price deck and cut-offs' }, { to: '/admin/qaqc', label: 'QAQC tolerances' }, { to: '/admin/workflows', label: 'Workflows', count: world.workflows.length }, { to: '/admin/reference', label: 'Reference data' }] },
        { label: 'Access', items: [{ to: '/admin/users', label: 'Users', count: world.users.length }, { to: '/admin/roles', label: 'Roles and permissions', count: world.roles.length }, { to: '/admin/audit', label: 'Audit log', count: world.audit.length.toLocaleString('en-CA') }] },
      ];
    case 'account':
      return [{ label: 'My account', items: [{ to: '/account', label: 'Profile', exact: true }, { to: '/account/preferences', label: 'Preferences' }, { to: '/account/notifications', label: 'Notification settings' }, { to: '/account/security', label: 'Security' }] }];
    default: return [];
  }
}
