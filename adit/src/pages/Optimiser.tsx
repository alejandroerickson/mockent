import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, useMe, can } from '../store';
import { COMMODITY, COMMODITIES } from '../data/world';
import { money, num, pct, date, datetime } from '../data/fmt';
import { Chip, PageHead, Slot, Authority, DataTable, Dialog, type Col } from '../ui/primitives';
import { Bars, Scatter } from '../ui/charts';
import { optimise } from '../optimiser';
import type { OptimiserTarget, OptimiserScenario } from '../data/types';

export function Optimiser() {
  const { state, dispatch, toast } = useStore();
  const me = useMe();
  const w = state.world;
  const [budget, setBudget] = useState(4500000);
  const [rigDays, setRigDays] = useState(240);
  const [objective, setObjective] = useState<'ev' | 'metres' | 'psuccess'>('ev');
  const [minPer, setMinPer] = useState(0);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState('');
  const commodityOf = (t: OptimiserTarget) => w.projects.find((p) => p.id === t.projectId)!.commodity;
  const targets = w.targets.filter((t) => !excluded.includes(t.id));
  const result = useMemo(() => optimise({ targets, budget, rigDays, objective, minPerCommodity: minPer, commodityOf }), [targets, budget, rigDays, objective, minPer]); // eslint-disable-line react-hooks/exhaustive-deps
  const sel = new Set(result.selected);
  const save = () => {
    const sc: OptimiserScenario = { id: `SC-${Date.now().toString(36).toUpperCase()}`, name: name.trim() || `Scenario ${w.scenarios.length + 1}`, createdAt: state.clock, createdById: me.id, budget, rigDays, objective, minPerCommodity: minPer, selected: result.selected, ev: result.ev, cost: result.cost, rigDaysUsed: result.rigDaysUsed };
    dispatch({ type: 'scenario.save', scenario: sc }); toast(`Scenario "${sc.name}" saved`, '/optimiser/scenarios'); setSaveOpen(false); setName('');
  };
  const cols: Col<OptimiserTarget>[] = [
    { key: 'sel', label: 'Selected', sort: (t) => (sel.has(t.id) ? 1 : 0), render: (t) => sel.has(t.id) ? <Chip status="accepted">selected</Chip> : <span className="chip chip--dash" title={result.rejected.find((r) => r.id === t.id)?.reason}>{result.rejected.find((r) => r.id === t.id)?.reason ?? 'not selected'}</span> },
    { key: 'id', label: 'Target', sort: (t) => t.id, render: (t) => <span className="mono ink">{t.id}</span> },
    { key: 'name', label: 'Name', sort: (t) => t.name, render: (t) => t.name, wrap: true },
    { key: 'p', label: 'Project', sort: (t) => t.projectId, render: (t) => <Link to={`/projects/${t.projectId}`}>{w.projects.find((p) => p.id === t.projectId)?.name}</Link> },
    { key: 'c', label: 'Commodity', sort: (t) => commodityOf(t), render: (t) => <span className="chip"><span className={`sw cat-${COMMODITY[commodityOf(t)].cat}`} aria-hidden="true" />{commodityOf(t)}</span> },
    { key: 'holes', label: 'Holes', num: true, sort: (t) => t.holes, render: (t) => num(t.holes) },
    { key: 'm', label: 'Metres', num: true, sort: (t) => t.metres, render: (t) => num(t.metres) },
    { key: 'cost', label: 'Cost', num: true, sort: (t) => t.cost, render: (t) => money(t.cost) },
    { key: 'days', label: 'Rig days', num: true, sort: (t) => t.rigDays, render: (t) => num(t.rigDays) },
    { key: 'ps', label: 'P(success)', num: true, sort: (t) => t.pSuccess, render: (t) => pct(t.pSuccess * 100) },
    { key: 'ev', label: 'Value if successful', num: true, sort: (t) => t.expectedValue, render: (t) => money(t.expectedValue, { compact: true }) },
    { key: 'exp', label: 'Expected value', num: true, sort: (t) => t.pSuccess * t.expectedValue, render: (t) => money(t.pSuccess * t.expectedValue, { compact: true }) },
    { key: 'ratio', label: 'EV per $', num: true, sort: (t) => (t.pSuccess * t.expectedValue) / t.cost, render: (t) => num((t.pSuccess * t.expectedValue) / t.cost, 2) },
    { key: 'earliest', label: 'Earliest', sort: (t) => t.earliest, render: (t) => <span className="mono">{date(t.earliest)}</span> },
    { key: 'lock', label: 'Locked', render: (t) => <button type="button" className="btn btn--small" aria-pressed={t.locked} onClick={() => dispatch({ type: 'target.lock', id: t.id, locked: !t.locked })}>{t.locked ? 'Locked' : 'Lock'}</button> },
    { key: 'x', label: <span className="vh">Exclude</span>, render: (t) => <button type="button" className="btn btn--small btn--quiet" onClick={() => setExcluded([...excluded, t.id])}>Exclude</button> },
  ];
  return (
    <>
      <PageHead title="Programme optimiser" meta={<><span>{w.targets.length} candidate targets · FY2027 season</span><span>{excluded.length} excluded</span></>} actions={<><Link className="btn" to="/optimiser/scenarios">Saved scenarios</Link>{can(me, 'optimiser.run', w) ? <button type="button" className="btn btn--primary" onClick={() => setSaveOpen(true)}>Save scenario</button> : null}</>} />
      <div className="filters" role="group" aria-label="Constraints">
        <label className="field"><span>Budget, {w.settings.baseCurrency}</span><input type="number" min={0} step={100000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></label>
        <label className="field"><span>Rig days available</span><input type="number" min={0} step={10} value={rigDays} onChange={(e) => setRigDays(Number(e.target.value))} /></label>
        <label className="field"><span>Objective</span><select value={objective} onChange={(e) => setObjective(e.target.value as typeof objective)}><option value="ev">Maximise expected value</option><option value="metres">Maximise metres tested</option><option value="psuccess">Maximise probability of success</option></select></label>
        <label className="field"><span>Minimum targets per commodity</span><input type="number" min={0} max={3} value={minPer} onChange={(e) => setMinPer(Number(e.target.value))} /></label>
        {excluded.length ? <button type="button" className="btn btn--small" onClick={() => setExcluded([])}>Restore {excluded.length} excluded</button> : null}
      </div>
      <div className="stack">
        <div className="panel">
          <div className="stamp">
            <Slot label="Expected value of the selection" value={money(result.ev, { compact: true })} unit={w.settings.baseCurrency} hero sub={`${result.selected.length} of ${targets.length} targets`} />
            <Slot label="Cost" value={money(result.cost)} sub={`${pct((result.cost / Math.max(1, budget)) * 100)} of budget`} />
            <Slot label="Rig days" value={num(result.rigDaysUsed)} sub={`of ${num(rigDays)}`} />
            <Slot label="Metres" value={num(result.metres)} unit="m" />
            <Slot label="Locked" value={num(targets.filter((t) => t.locked).length)} sub="always included if they fit" />
          </div>
          <Authority text="computed by ADIT: greedy selection by expected value per dollar, then pairwise swaps; locked targets first" detail={<dl className="kv"><dt>Expected value</dt><dd>P(success) × in-situ value added if successful, per target, summed.</dd><dt>Constraints</dt><dd>Total cost ≤ budget; total rig days ≤ available; at least the minimum per commodity where it fits.</dd><dt>Not modelled</dt><dd>Rig type compatibility, seasonal windows, shared mobilisation.</dd></dl>} />
        </div>
        <div className="grid grid--2">
          <div className="panel"><Scatter title="Targets: cost against expected value" xLabel={`Cost, ${w.settings.baseCurrency}`} yLabel={`Expected value, ${w.settings.baseCurrency}`} points={targets.map((t) => ({ x: t.cost, y: t.pSuccess * t.expectedValue, label: `${t.id} ${t.name}`, cat: COMMODITY[commodityOf(t)].cat, hollow: !sel.has(t.id), r: 4 + t.rigDays / 12 }))} fx={(v) => money(v, { compact: true })} fy={(v) => money(v, { compact: true })} legend={[...COMMODITIES.map((c) => ({ label: c.name, cat: c.cat })), { label: 'not selected', hollow: true }]} width={560} /></div>
          <div className="panel"><Bars title="Selected cost by commodity" unit={w.settings.baseCurrency} rows={COMMODITIES.map((c) => ({ label: c.name, value: targets.filter((t) => sel.has(t.id) && commodityOf(t) === c.code).reduce((s, t) => s + t.cost, 0), cat: c.cat })).filter((r) => r.value > 0)} fmt={(v) => money(v, { compact: true })} width={560} /></div>
        </div>
        <section className="panel panel--flush"><div className="ph"><h2>Candidate targets</h2><span className="r">selection recomputes as constraints change</span></div><DataTable caption="Candidate targets" rows={targets} cols={cols} rowKey={(t) => t.id} defaultSort={{ key: 'ratio', dir: 'descending' }} /></section>
      </div>
      <Dialog open={saveOpen} onClose={() => setSaveOpen(false)} title="Save this scenario" summary={`${result.selected.length} targets, ${money(result.cost)} of ${money(budget)}, ${result.rigDaysUsed} of ${rigDays} rig days.`}>
        <form onSubmit={(e) => { e.preventDefault(); save(); }}>
          <label className="field"><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Base case 4.5M" autoFocus /></label>
          <div className="dlg-act"><button type="button" className="btn" onClick={() => setSaveOpen(false)}>Cancel</button><button type="submit" className="btn btn--primary">Save</button></div>
        </form>
      </Dialog>
    </>
  );
}

export function Targets() {
  const w = useStore().state.world;
  return (
    <>
      <PageHead title="Candidate targets" meta={<span>{w.targets.length} targets across {new Set(w.targets.map((t) => t.projectId)).size} projects</span>} />
      <div className="panel panel--flush"><DataTable caption="Candidate targets" rows={w.targets} rowKey={(t) => t.id} cols={[
        { key: 'id', label: 'Target', render: (t) => <span className="mono ink">{t.id}</span> },
        { key: 'name', label: 'Name', render: (t) => t.name, wrap: true },
        { key: 'p', label: 'Project', render: (t) => <Link to={`/projects/${t.projectId}`}>{w.projects.find((p) => p.id === t.projectId)?.name}</Link> },
        { key: 'holes', label: 'Holes', num: true, render: (t) => num(t.holes) }, { key: 'm', label: 'Metres', num: true, render: (t) => num(t.metres) }, { key: 'cost', label: 'Cost', num: true, render: (t) => money(t.cost) }, { key: 'd', label: 'Rig days', num: true, render: (t) => num(t.rigDays) }, { key: 'ps', label: 'P(success)', num: true, render: (t) => pct(t.pSuccess * 100) }, { key: 'v', label: 'Value if successful', num: true, render: (t) => money(t.expectedValue) }, { key: 'e', label: 'Earliest', render: (t) => <span className="mono">{date(t.earliest)}</span> }, { key: 'l', label: 'Locked', render: (t) => t.locked ? <Chip status="accepted">locked</Chip> : <span className="dash">—</span> },
      ]} /></div>
    </>
  );
}

export function Scenarios() {
  const { state, dispatch, toast } = useStore();
  const w = state.world;
  return (
    <>
      <PageHead title="Saved scenarios" meta={<span>{w.scenarios.length} scenarios</span>} actions={<Link className="btn btn--primary" to="/optimiser">Open the optimiser</Link>} />
      <div className="panel panel--flush"><DataTable caption="Scenarios" rows={w.scenarios} rowKey={(s) => s.id} empty="No scenario has been saved yet. Run the optimiser and save a selection." cols={[
        { key: 'name', label: 'Scenario', render: (s) => <span className="ink">{s.name}</span> },
        { key: 'at', label: 'Saved', render: (s) => <span className="mono">{datetime(s.createdAt)}</span> },
        { key: 'by', label: 'By', render: (s) => w.users.find((u) => u.id === s.createdById)?.name },
        { key: 'obj', label: 'Objective', render: (s) => ({ ev: 'expected value', metres: 'metres', psuccess: 'P(success)' })[s.objective] },
        { key: 'b', label: 'Budget', num: true, render: (s) => money(s.budget) }, { key: 'c', label: 'Cost', num: true, render: (s) => money(s.cost) }, { key: 'd', label: 'Rig days', num: true, render: (s) => `${s.rigDaysUsed} / ${s.rigDays}` }, { key: 'ev', label: 'Expected value', num: true, render: (s) => money(s.ev, { compact: true }) },
        { key: 'sel', label: 'Targets', render: (s) => <span className="mono small">{s.selected.join(', ')}</span>, wrap: true },
        { key: 'x', label: <span className="vh">Actions</span>, render: (s) => <button type="button" className="btn btn--small" onClick={() => { dispatch({ type: 'scenario.delete', id: s.id }); toast('Scenario deleted'); }}>Delete</button> },
      ]} /></div>
    </>
  );
}
