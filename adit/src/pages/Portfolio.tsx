import { Link, useParams } from 'react-router-dom';
import { useStore, useMe, TODAY } from '../store';
import { STAGES, COMMODITY, COMMODITIES } from '../data/world';
import { money, num, pct, date, relDays } from '../data/fmt';
import { Chip, PageHead, Slot, Authority, DataTable, type Col } from '../ui/primitives';
import { Columns, Bars, Lines, Scatter, Split } from '../ui/charts';
import { daysBetween } from '../data/rng';
import type { Project } from '../data/types';

export function Portfolio() {
  const { shape } = useParams();
  const { state } = useStore();
  const w = state.world;
  const me = useMe();
  const active = w.projects.filter((p) => p.status !== 'closed');
  const meta = <><span>{w.fiscalYear}</span><span>as of {date(state.clock)}</span><span>{active.length} active projects</span><span>{w.projects.filter((p) => p.status === 'closed').length} closed</span></>;

  if (shape === 'analytics') return <Analytics />;
  if (shape === 'budget') return <Budget />;
  if (shape === 'commodity' || shape === 'jurisdiction') return <Grouped by={shape} />;

  // ---- attention ledger
  const overdue = w.approvals.filter((a) => a.status === 'pending' && a.dueOn < TODAY);
  const dueSoon = w.approvals.filter((a) => a.status === 'pending' && a.dueOn >= TODAY && daysBetween(TODAY, a.dueOn) <= 7);
  const expiring = w.tenements.filter((t) => ['expiring', 'renewal-lodged'].includes(t.status) && daysBetween(TODAY, t.expiresOn) <= 90).sort((a, b) => (a.expiresOn < b.expiresOn ? -1 : 1));
  const holds = w.batches.filter((b) => b.status === 'qaqc-hold');
  const over = w.programmes.filter((p) => ['in-progress', 'demobilising'].includes(p.phase) && p.spent > p.budget * (1 + w.settings.varianceThresholdPct / 100) * 0.9);
  const gates = active.filter((p) => p.nextGateOn && daysBetween(TODAY, p.nextGateOn) <= 45);
  const vacancies = active.filter((p) => !w.users.find((u) => u.id === p.geologistId)?.active);

  return (
    <>
      <PageHead title={`Portfolio · ${w.settings.tenantName}`} meta={meta} actions={<><Link className="btn" to="/projects">Projects register</Link><Link className="btn" to="/approvals">Approvals{pendingCount(w, me.roleCode)}</Link></>} />
      <section aria-labelledby="board-h" className="stack">
        <h2 id="board-h" className="vh">Projects by stage</h2>
        <div className="board" role="list" aria-label="Projects by stage">
          {STAGES.map((s) => {
            const ps = active.filter((p) => p.stage === s.code);
            const committed = ps.reduce((x, p) => x + p.budget.committed, 0);
            const forecast = ps.reduce((x, p) => x + p.budget.forecast, 0);
            return (
              <div className="col" key={s.code} role="listitem">
                <Link className="col-h" to={`/projects?stage=${s.code}`} aria-label={`${s.name}: ${ps.length} projects, ${money(committed)} committed`}>
                  <span className="n">{s.name}<span className="ct">{ps.length}</span></span>
                  <span className="m"><span><span className="sans">committed</span><span>{money(committed, { compact: true })}</span></span><span><span className="sans">forecast</span><span>{money(forecast, { compact: true })}</span></span></span>
                </Link>
                {ps.length === 0 ? <div className="none">No projects</div> : ps.map((p) => <Ticket key={p.id} p={p} />)}
              </div>);
          })}
        </div>
        <ul className="legend" aria-label="Commodities">{COMMODITIES.map((c) => <li key={c.code}><span className={`sw cat-${c.cat}`} aria-hidden="true" />{c.name}</li>)}</ul>
      </section>

      <section className="panel" aria-labelledby="attn-h" style={{ marginTop: 24 }}>
        <div className="ph"><h2 id="attn-h">Needs attention</h2><span className="r">{overdue.length + dueSoon.length + expiring.length + holds.length + over.length + gates.length + vacancies.length} items</span></div>
        <div className="ledger">
          {overdue.map((a) => <Row key={a.id} k="Approval overdue" w={<Link to={`/approvals/${a.id}`}>{a.title}</Link>} d={`due ${relDays(a.dueOn, TODAY)}`} a={<Chip status="pending">{a.steps[a.currentStep].name}</Chip>} />)}
          {dueSoon.map((a) => <Row key={a.id} k="Approval due" w={<Link to={`/approvals/${a.id}`}>{a.title}</Link>} d={`due ${relDays(a.dueOn, TODAY)}`} a={<Chip status="pending">{a.steps[a.currentStep].name}</Chip>} />)}
          {expiring.map((t) => { const p = w.projects.find((x) => x.id === t.projectId)!; return <Row key={t.id} k="Tenure expiring" w={<Link to={`/projects/${p.id}/tenure`}>{t.id} · {p.name}</Link>} d={`expires ${relDays(t.expiresOn, TODAY)}`} a={<Chip status={t.status} />} />; })}
          {holds.map((b) => { const p = w.projects.find((x) => x.id === b.projectId)!; return <Row key={b.id} k="QAQC hold" w={<Link to={`/assays/${b.id}`}>{b.id} · {p.name}</Link>} d={`${b.failures.length} failure${b.failures.length === 1 ? '' : 's'}`} a={<Chip status="qaqc-hold" />} />; })}
          {over.map((pr) => { const p = w.projects.find((x) => x.id === pr.projectId)!; return <Row key={pr.id} k="Over budget" w={<Link to={`/programmes/${pr.id}`}>{pr.name} · {p.name}</Link>} d={`${pct((pr.spent / pr.budget) * 100)} spent`} a={<Chip status="in-progress" />} />; })}
          {gates.map((p) => <Row key={p.id} k="Gate due" w={<Link to={`/projects/${p.id}`}>{p.name}</Link>} d={`${relDays(p.nextGateOn!, TODAY)}`} a={<Chip>{STAGES.find((s) => s.code === p.stage)?.short}</Chip>} />)}
          {vacancies.map((p) => <Row key={p.id} k="Vacancy" w={<Link to={`/projects/${p.id}`}>{p.name}: project geologist</Link>} d="since 2026-06-30" a={<Chip status="on-hold">unfilled</Chip>} />)}
        </div>
      </section>

      <section className="panel panel--flush" aria-labelledby="reg-h" style={{ marginTop: 16 }}>
        <div className="ph"><h2 id="reg-h">Active projects</h2><span className="r"><Link to="/projects" className="btn btn--small">Full register</Link></span></div>
        <ProjectTable rows={active} compact />
      </section>
    </>
  );
}

function pendingCount(w: ReturnType<typeof useStore>['state']['world'], role: string) {
  const n = w.approvals.filter((a) => a.status === 'pending' && a.steps[a.currentStep].roleCode === role).length;
  return n ? <span className="mono muted" style={{ marginLeft: 6 }}>{n}</span> : null;
}
function Row({ k, w, d, a }: { k: string; w: React.ReactNode; d: string; a: React.ReactNode }) { return <><span className="k">{k}</span><span className="w">{w}</span><span className="d">{d}</span><span className="a">{a}</span></>; }

function Ticket({ p }: { p: Project }) {
  const w = useStore().state.world;
  const c = COMMODITY[p.commodity];
  const prgs = w.programmes.filter((x) => x.projectId === p.id);
  const metres = prgs.filter((x) => x.startOn >= '2026-01-01').reduce((s, x) => s + (x.metresDrilled ?? 0), 0);
  const fig = p.stage === 'drilling' ? { v: num(metres), u: 'm drilled' } : { v: money(p.budget.spent, { compact: true }), u: 'spent' };
  return (
    <Link className={`tk${p.status === 'on-hold' ? ' hold' : ''}`} to={`/projects/${p.id}`} aria-label={`${p.name}, ${c.name}, ${p.jurisdiction}`}>
      <span className="id">{p.id}<span className="chip" style={{ height: 18, lineHeight: '16px', padding: '0 7px' }}><span className={`sw cat-${c.cat}`} aria-hidden="true" />{c.code}</span></span>
      <span className="nm">{p.name}</span>
      <span className="fig"><span>{fig.v}</span><span className="u">{fig.u}</span></span>
      <span className="sub"><span>{p.jurisdiction}</span>{p.status === 'on-hold' ? <span>on hold</span> : p.nextGateOn ? <span className="gate">gate {date(p.nextGateOn).slice(0, 7)}</span> : null}</span>
    </Link>
  );
}

const CC: Record<string, string> = { Canada: 'CA', 'United States': 'US', Australia: 'AU', Chile: 'CL', Finland: 'FI', Argentina: 'AR' };
export function ProjectTable({ rows, pageSize, compact }: { rows: Project[]; pageSize?: number; compact?: boolean }) {
  const w = useStore().state.world;
  const maxVar = Math.max(1, ...rows.map((p) => Math.abs(p.budget.forecast - p.budget.planned)));
  const cols: Col<Project>[] = [
    { key: 'id', label: 'Project', sort: (p) => p.id, render: (p) => <Link to={`/projects/${p.id}`}><span className="mono">{p.id}</span></Link> },
    { key: 'name', label: 'Name', sort: (p) => p.name, render: (p) => <Link to={`/projects/${p.id}`}>{p.name}</Link> },
    { key: 'commodity', label: 'Commodity', sort: (p) => p.commodity, render: (p) => <span className="chip"><span className={`sw cat-${COMMODITY[p.commodity].cat}`} aria-hidden="true" />{COMMODITY[p.commodity].name}</span> },
    { key: 'jur', label: 'Jurisdiction', sort: (p) => p.jurisdiction, render: (p) => `${p.jurisdiction}, ${CC[p.country] ?? p.country}` },
    { key: 'stage', label: 'Stage', sort: (p) => STAGES.findIndex((s) => s.code === p.stage), render: (p) => STAGES.find((s) => s.code === p.stage)?.name },
    { key: 'status', label: 'Status', sort: (p) => p.status, render: (p) => <Chip status={p.status === 'closed' ? (p.outcome ?? 'closed') : p.status} /> },
    { key: 'geo', label: 'Geologist', sr: 'Project geologist', sort: (p) => w.users.find((u) => u.id === p.geologistId)?.name ?? '', render: (p) => { const u = w.users.find((x) => x.id === p.geologistId); return u?.active ? u.name : <span className="chip chip--dash">vacant</span>; } },
    ...(compact ? [] : [{ key: 'area', label: 'Area', sr: 'Area, square kilometres', num: true, sort: (p: Project) => p.areaKm2, render: (p: Project) => <>{num(p.areaKm2, 1)}<span className="unit">km²</span></> }]),
    { key: 'planned', label: 'Budget', sr: 'Budget, planned', num: true, sort: (p) => p.budget.planned, render: (p) => money(p.budget.planned) },
    { key: 'spent', label: 'Spent', num: true, sort: (p) => p.budget.spent, render: (p) => <>{money(p.budget.spent)}<span className="bar" aria-hidden="true"><i style={{ width: `${Math.min(100, (p.budget.spent / Math.max(1, p.budget.planned)) * 100)}%` }} /></span></> },
    { key: 'fcst', label: 'Forecast vs budget', num: true, sort: (p) => p.budget.forecast - p.budget.planned, render: (p) => { const v = p.budget.forecast - p.budget.planned; return p.budget.planned ? <><span className={`mono ${v > 0 ? 'neg' : 'pos'}`}>{v > 0 ? '+' : '−'}{money(Math.abs(v))}</span><span className="dbar" aria-hidden="true"><i className={v > 0 ? 'red' : 'blue'} style={{ width: `${(Math.abs(v) / maxVar) * 50}%` }} /></span></> : <span className="dash">—</span>; } },
    { key: 'gate', label: 'Next gate', sort: (p) => p.nextGateOn ?? '9', render: (p) => p.nextGateOn ? <span className="mono">{date(p.nextGateOn)}</span> : <span className="dash">—</span> },
  ];
  return <DataTable rows={rows} cols={cols} rowKey={(p) => p.id} caption="Projects register" pageSize={pageSize} defaultSort={{ key: 'stage', dir: 'descending' }} compact={compact} />;
}

function Grouped({ by }: { by: 'commodity' | 'jurisdiction' }) {
  const { state } = useStore();
  const w = state.world;
  const active = w.projects.filter((p) => p.status !== 'closed');
  const keys = by === 'commodity' ? COMMODITIES.map((c) => c.code) : Array.from(new Set(active.map((p) => p.jurisdiction))).sort();
  const groups = keys.map((k) => ({ key: k, label: by === 'commodity' ? COMMODITY[k as keyof typeof COMMODITY].name : k, ps: active.filter((p) => (by === 'commodity' ? p.commodity === k : p.jurisdiction === k)) }));
  return (
    <>
      <PageHead title={`Portfolio · by ${by}`} meta={<><span>{w.fiscalYear}</span><span>{active.length} active projects</span></>} />
      <div className="stack">
        <div className="panel">
          <Bars title={`Budget by ${by}`} unit={w.settings.baseCurrency} rows={groups.map((g) => ({ label: g.label, value: g.ps.reduce((s, p) => s + p.budget.planned, 0), cat: by === 'commodity' ? COMMODITY[g.key as keyof typeof COMMODITY].cat : 7, href: by === 'commodity' ? `/projects?commodity=${g.key}` : undefined }))} fmt={(v) => money(v, { compact: true })} />
        </div>
        {groups.map((g) => (
          <section key={g.key} className="panel panel--flush" aria-labelledby={`g-${g.key}`}>
            <div className="ph"><h2 id={`g-${g.key}`}>{g.label}</h2><span className="r">{g.ps.length} projects · {money(g.ps.reduce((s, p) => s + p.budget.planned, 0))} budget · {money(g.ps.reduce((s, p) => s + p.budget.spent, 0))} spent</span></div>
            <ProjectTable rows={g.ps} />
          </section>))}
      </div>
    </>
  );
}

function monthsOf2026() { return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']; }

function Analytics() {
  const { state } = useStore();
  const w = state.world;
  const months = monthsOf2026();
  // metres drilled per month across the portfolio, from hole completion dates
  const metres = months.map((_, i) => w.holes.filter((h) => h.completedOn && h.completedOn.startsWith(`2026-${String(i + 1).padStart(2, '0')}`)).reduce((s, h) => s + h.depth, 0));
  const plan = months.map((_, i) => { const m = `2026-${String(i + 1).padStart(2, '0')}`; return w.programmes.filter((p) => p.type === 'drilling' && p.metresPlanned && p.startOn <= m + '-31' && p.endOn >= m + '-01').reduce((s, p) => s + (p.metresPlanned! / Math.max(1, Math.round(daysBetween(p.startOn, p.endOn) / 30))), 0); });
  const byCommodity = COMMODITIES.map((c) => ({ name: c.name, cat: c.cat, values: months.map((_, i) => w.holes.filter((h) => w.projects.find((p) => p.id === h.projectId)?.commodity === c.code && h.completedOn?.startsWith(`2026-${String(i + 1).padStart(2, '0')}`)).reduce((s, h) => s + h.depth, 0)) }));
  const received = w.batches.filter((b) => b.receivedOn);
  const tat = received.map((b) => daysBetween(b.submittedOn, b.receivedOn!));
  const avgTat = tat.length ? tat.reduce((a, b) => a + b, 0) / tat.length : 0;
  const qc = { standards: w.batches.reduce((s, b) => s + b.standards, 0), blanks: w.batches.reduce((s, b) => s + b.blanks, 0), duplicates: w.batches.reduce((s, b) => s + b.duplicates, 0), failures: w.batches.reduce((s, b) => s + b.failures.length, 0) };
  const passRate = 100 - (qc.failures / Math.max(1, qc.standards + qc.blanks + qc.duplicates)) * 100;
  const pts = w.projects.filter((p) => p.status !== 'closed' && p.budget.planned).map((p) => ({ x: p.budget.spent, y: w.intercepts.filter((i) => i.projectId === p.id && i.significant).length, label: p.name, cat: COMMODITY[p.commodity].cat, href: `/projects/${p.id}`, r: 4 + Math.sqrt(p.areaKm2) / 2 }));
  return (
    <>
      <PageHead title="Portfolio · analytics" meta={<><span>{w.fiscalYear}</span><span>as of {date(state.clock)}</span></>} />
      <div className="stack">
        <div className="panel">
          <div className="stamp">
            <Slot label="Metres drilled, FY to date" value={num(metres.reduce((a, b) => a + b, 0))} unit="m" hero sub={`${num(plan.reduce((a, b) => a + b, 0))} m planned`} />
            <Slot label="Holes completed" value={num(w.holes.filter((h) => h.completedOn && h.completedOn >= '2026-01-01').length)} sub={`${w.holes.filter((h) => h.status === 'drilling').length} drilling now`} />
            <Slot label="Significant intercepts" value={num(w.intercepts.filter((i) => i.significant).length)} sub="above 1.5× cut-off" />
            <Slot label="Assay turnaround" value={num(avgTat, 1)} unit="days" sub={`${received.length} batches received`} />
            <Slot label="QAQC pass rate" value={num(passRate, 1)} unit="%" sub={`${qc.failures} failures in ${num(qc.standards + qc.blanks + qc.duplicates)} checks`} />
            <Slot label="Batches at the lab" value={num(w.batches.filter((b) => ['submitted', 'in-prep', 'analysing'].includes(b.status)).length)} sub={`${num(w.batches.filter((b) => ['submitted', 'in-prep', 'analysing'].includes(b.status)).reduce((s, b) => s + b.sampleCount, 0))} samples`} />
          </div>
          <Authority text={`computed by ADIT from ${num(w.holes.length)} drillholes, ${num(w.batches.length)} batches and ${num(w.samples.length)} samples`} detail={<dl className="kv"><dt>Metres</dt><dd>Sum of drilled depth by completion month, calendar 2026.</dd><dt>Plan</dt><dd>Programme metres spread evenly over the programme's months.</dd><dt>Turnaround</dt><dd>Days from dispatch to results received, received batches only.</dd><dt>Pass rate</dt><dd>1 − failures ÷ (standards + blanks + duplicates).</dd></dl>} />
        </div>
        <div className="grid grid--2">
          <div className="panel"><Columns title="Metres drilled by month" unit="m" labels={months} series={byCommodity} stacked plan={plan} fmt={(v) => num(v)} /></div>
          <div className="panel"><Scatter title="Spend against significant intercepts" xLabel={`Spent, ${w.settings.baseCurrency}`} yLabel="Significant intercepts" points={pts} fx={(v) => money(v, { compact: true })} fy={(v) => num(v)} legend={COMMODITIES.map((c) => ({ label: c.name, cat: c.cat }))} /></div>
          <div className="panel"><Lines title="Assay batches submitted and received" labels={months} series={[{ name: 'Submitted', cat: 6, values: months.map((_, i) => w.batches.filter((b) => b.submittedOn.startsWith(`2026-${String(i + 1).padStart(2, '0')}`)).length) }, { name: 'Received', cat: 1, values: months.map((_, i) => w.batches.filter((b) => b.receivedOn?.startsWith(`2026-${String(i + 1).padStart(2, '0')}`)).length) }]} fmt={(v) => num(v)} /></div>
          <div className="panel">
            <div className="chart-t"><span>QAQC checks, FY to date</span></div>
            <Split parts={[{ label: 'Standards', value: qc.standards, cat: 6 }, { label: 'Blanks', value: qc.blanks, cat: 7 }, { label: 'Field duplicates', value: qc.duplicates, cat: 2 }]} />
            <div className="chart-t" style={{ marginTop: 16 }}><span>Failures by kind</span></div>
            <Split parts={(['standard', 'blank', 'duplicate'] as const).map((k, i) => ({ label: k, value: w.batches.reduce((s, b) => s + b.failures.filter((f) => f.kind === k).length, 0), cat: [6, 7, 2][i] }))} />
          </div>
        </div>
      </div>
    </>
  );
}

function Budget() {
  const { state } = useStore();
  const w = state.world;
  const active = w.projects.filter((p) => p.status !== 'closed');
  const tot = active.reduce((s, p) => ({ planned: s.planned + p.budget.planned, committed: s.committed + p.budget.committed, spent: s.spent + p.budget.spent, forecast: s.forecast + p.budget.forecast }), { planned: 0, committed: 0, spent: 0, forecast: 0 });
  const byCat = w.costCodes.reduce((m, c) => { m[c.category] = (m[c.category] ?? 0) + 1; return m; }, {} as Record<string, number>);
  const prgSpend = w.programmes.filter((p) => p.startOn >= '2026-01-01' || p.endOn >= '2026-01-01');
  const spendByType = ['drilling', 'geophysics', 'geochem', 'mapping', 'metallurgy', 'baseline'].map((t, i) => ({ label: t, value: prgSpend.filter((p) => p.type === t).reduce((s, p) => s + p.spent, 0), cat: i }));
  return (
    <>
      <PageHead title="Portfolio · budget" meta={<><span>{w.fiscalYear}</span><span>{w.settings.baseCurrency}</span><span>{active.length} active projects</span></>} actions={<Link className="btn" to="/approvals?view=pending&type=budget-variance">Variance requests</Link>} />
      <div className="stack">
        <div className="panel">
          <div className="stamp">
            <Slot label="Approved budget" value={money(tot.planned)} hero />
            <Slot label="Committed" value={money(tot.committed)} sub={pct((tot.committed / tot.planned) * 100, 1) + ' of budget'} />
            <Slot label="Spent to date" value={money(tot.spent)} sub={pct((tot.spent / tot.planned) * 100, 1) + ' of budget'} />
            <Slot label="Forecast at year end" value={money(tot.forecast)} sub={<span className={tot.forecast > tot.planned ? 'neg' : 'pos'}>{tot.forecast > tot.planned ? '+' : '−'}{money(Math.abs(tot.forecast - tot.planned))} vs budget</span>} />
            <Slot label="Variance requests pending" value={num(w.approvals.filter((a) => a.type === 'budget-variance' && a.status === 'pending').length)} sub={money(w.approvals.filter((a) => a.type === 'budget-variance' && a.status === 'pending').reduce((s, a) => s + (a.amount ?? 0), 0)) + ' requested'} />
          </div>
          <Authority text={`computed by ADIT from ${active.length} project budgets and ${prgSpend.length} programme ledgers`} detail={<dl className="kv"><dt>Committed</dt><dd>Spent plus open purchase orders and contract commitments.</dd><dt>Forecast</dt><dd>Project manager's forecast at year end, updated with each variance request.</dd></dl>} />
        </div>
        <div className="grid grid--2">
          <div className="panel"><Bars title="Programme spend by type" unit={w.settings.baseCurrency} rows={spendByType} fmt={(v) => money(v, { compact: true })} /></div>
          <div className="panel"><Bars title="Cost codes by category" unit="codes" rows={Object.entries(byCat).map(([k, v]) => ({ label: k, value: v }))} cat={7} /></div>
        </div>
        <section className="panel panel--flush" aria-labelledby="bud-tbl">
          <div className="ph"><h2 id="bud-tbl">Budget by project</h2></div>
          <DataTable caption="Budget by project" rows={active} rowKey={(p) => p.id} defaultSort={{ key: 'planned', dir: 'descending' }} cols={[
            { key: 'id', label: 'Project', sort: (p) => p.id, render: (p) => <Link to={`/projects/${p.id}/budget`}><span className="mono">{p.id}</span></Link> },
            { key: 'name', label: 'Name', sort: (p) => p.name, render: (p) => p.name },
            { key: 'planned', label: 'Budget', num: true, sort: (p) => p.budget.planned, render: (p) => money(p.budget.planned) },
            { key: 'committed', label: 'Committed', num: true, sort: (p) => p.budget.committed, render: (p) => money(p.budget.committed) },
            { key: 'spent', label: 'Spent', num: true, sort: (p) => p.budget.spent, render: (p) => money(p.budget.spent) },
            { key: 'spentpct', label: '% spent', num: true, sort: (p) => p.budget.spent / Math.max(1, p.budget.planned), render: (p) => pct((p.budget.spent / Math.max(1, p.budget.planned)) * 100, 1) },
            { key: 'forecast', label: 'Forecast', num: true, sort: (p) => p.budget.forecast, render: (p) => money(p.budget.forecast) },
            { key: 'var', label: 'Variance', num: true, sort: (p) => p.budget.forecast - p.budget.planned, render: (p) => <span className={`mono ${p.budget.forecast > p.budget.planned ? 'neg' : 'pos'}`}>{p.budget.forecast > p.budget.planned ? '+' : '−'}{money(Math.abs(p.budget.forecast - p.budget.planned))}</span> },
          ] as Col<Project>[]} foot={<tr><td>Total</td><td /><td className="num">{money(tot.planned)}</td><td className="num">{money(tot.committed)}</td><td className="num">{money(tot.spent)}</td><td className="num">{pct((tot.spent / tot.planned) * 100, 1)}</td><td className="num">{money(tot.forecast)}</td><td className="num">{tot.forecast > tot.planned ? '+' : '−'}{money(Math.abs(tot.forecast - tot.planned))}</td></tr>} />
        </section>
      </div>
    </>
  );
}
