// ADIT 7.4 — the demonstration tenant, generated from a fixed seed.
// Kestrel Range Resources: an invented mid-tier explorer. Nothing here is real.
import { Rng, pad, addDays, daysBetween } from './rng';
import type {
  World, CommodityDef, CommodityCode, User, Role, Project, Tenement, Programme, Drillhole,
  SampleBatch, Sample, Intercept, ResourceEstimate, Approval, Comment, Notification, AuditEntry,
  Rig, Camp, Lab, CostCode, SystemSettings, WorkflowDef, OptimiserTarget, Stage, ProgrammePhase,
  HoleStatus, BatchStatus, CategoryBlock, ApprovalType, CrewAssignment, LogisticsItem,
} from './types';

export const AS_OF = '2026-09-21T14:32:00Z';
export const TODAY = AS_OF.slice(0, 10);

export const STAGES: { code: Stage; name: string; short: string }[] = [
  { code: 'recon', name: 'Reconnaissance', short: 'Recon' },
  { code: 'target', name: 'Target generation', short: 'Targets' },
  { code: 'drilling', name: 'Drilling', short: 'Drilling' },
  { code: 'resource', name: 'Resource definition', short: 'Resource' },
  { code: 'scoping', name: 'Scoping study', short: 'Scoping' },
  { code: 'decision', name: 'Stage-gate decision', short: 'Decision' },
];
export const STAGE_NAME = Object.fromEntries(STAGES.map((s) => [s.code, s.name])) as Record<Stage, string>;

export const COMMODITIES: CommodityDef[] = [
  { code: 'Au', name: 'Gold', gradeLabel: 'Au', gradeUnit: 'g/t', depositStyle: 'Orogenic vein', holeTypes: ['DDH', 'RC'], cutoff: 0.5, gradeRange: [0.6, 6.5], background: [0.005, 0.12], metalUnit: 'oz', price: { value: 2340, unit: 'USD/oz' }, method: 'FA50-AAS', contained: (mt, g) => (mt * 1e6 * g) / 31.1035, cat: 0 },
  { code: 'Li', name: 'Lithium', gradeLabel: 'Li₂O', gradeUnit: '%', depositStyle: 'LCT pegmatite', holeTypes: ['DDH', 'RC'], cutoff: 0.4, gradeRange: [0.5, 2.1], background: [0.01, 0.08], metalUnit: 't Li₂O', price: { value: 1150, unit: 'USD/t SC6' }, method: 'ME-ICP61 (Na₂O₂ fusion)', contained: (mt, g) => mt * 1e6 * (g / 100), cat: 1 },
  { code: 'K', name: 'Potash', gradeLabel: 'KCl', gradeUnit: '%', depositStyle: 'Evaporite (sylvinite)', holeTypes: ['DDH', 'Sonic'], cutoff: 15, gradeRange: [18, 34], background: [0.5, 4], metalUnit: 't KCl', price: { value: 320, unit: 'USD/t KCl' }, method: 'K-XRF / Cl-titration', contained: (mt, g) => mt * 1e6 * (g / 100), cat: 2 },
  { code: 'Cu', name: 'Copper', gradeLabel: 'Cu', gradeUnit: '%', depositStyle: 'Porphyry Cu-Mo', holeTypes: ['DDH', 'RC', 'AC'], cutoff: 0.2, gradeRange: [0.24, 0.95], background: [0.005, 0.05], metalUnit: 't Cu', price: { value: 4.15, unit: 'USD/lb' }, method: 'ME-MS61 (4-acid)', contained: (mt, g) => mt * 1e6 * (g / 100), cat: 3 },
  { code: 'Ni', name: 'Nickel', gradeLabel: 'Ni', gradeUnit: '%', depositStyle: 'Magmatic Ni-Cu sulphide', holeTypes: ['DDH'], cutoff: 0.3, gradeRange: [0.36, 2.4], background: [0.01, 0.09], metalUnit: 't Ni', price: { value: 16800, unit: 'USD/t' }, method: 'ME-ICP61 + Ni-OG62', contained: (mt, g) => mt * 1e6 * (g / 100), cat: 4 },
];
export const COMMODITY = Object.fromEntries(COMMODITIES.map((c) => [c.code, c])) as Record<CommodityCode, CommodityDef>;

export const ROLES: Role[] = [
  { code: 'EXM', name: 'Exploration Manager', permissions: ['project.read', 'project.write', 'programme.approve', 'gate.decide', 'budget.approve', 'resource.read', 'optimiser.run', 'admin.read'] },
  { code: 'PGEO', name: 'Project Geologist', permissions: ['project.read', 'project.write', 'programme.write', 'hole.write', 'resource.write', 'optimiser.run'] },
  { code: 'DBGEO', name: 'Database Geologist', permissions: ['project.read', 'hole.write', 'assay.write', 'qaqc.review', 'resource.read'] },
  { code: 'LOG', name: 'Field Logistics Coordinator', permissions: ['project.read', 'programme.read', 'logistics.write', 'crew.assign', 'purchase.raise'] },
  { code: 'FIN', name: 'Finance Controller', permissions: ['project.read', 'budget.read', 'budget.write', 'variance.approve', 'purchase.approve'] },
  { code: 'TEN', name: 'Tenure & Permitting Officer', permissions: ['project.read', 'tenement.write', 'permit.write', 'land.approve'] },
  { code: 'SYS', name: 'System Administrator', permissions: ['admin.read', 'admin.write', 'user.manage', 'workflow.edit', 'audit.read'] },
];

const defaultNotify = { approval: true, assay: true, tenure: true, programme: true, system: true, mention: true, budget: true };
const prefs = (p: Partial<User['prefs']>): User['prefs'] => ({ defaultSection: 'portfolio', defaultProjectId: null, units: 'metric', dateFormat: 'ISO', gradeDecimals: 2, emailDigest: 'daily', notify: { ...defaultNotify }, rowsPerPage: 50, compactTables: false, ...p });

export const USERS: User[] = [
  { id: 'u-mokonkwo', name: 'Marguerite Okonkwo', initials: 'MO', roleCode: 'EXM', title: 'Exploration Manager', email: 'm.okonkwo@kestrelrange.example', team: 'Exploration', location: 'Vancouver', timezone: 'America/Vancouver', phone: '+1 604 555 0140', active: true, lastSignIn: '2026-09-21T13:58:00Z', prefs: prefs({ defaultSection: 'approvals' }) },
  { id: 'u-twierzbicki', name: 'Tomasz Wierzbicki', initials: 'TW', roleCode: 'PGEO', title: 'Senior Project Geologist', email: 't.wierzbicki@kestrelrange.example', team: 'Exploration', location: 'Timmins', timezone: 'America/Toronto', phone: '+1 705 555 0188', active: true, lastSignIn: '2026-09-21T11:02:00Z', prefs: prefs({ defaultSection: 'projects', defaultProjectId: 'PRJ-0412' }) },
  { id: 'u-praghunathan', name: 'Priya Raghunathan', initials: 'PR', roleCode: 'DBGEO', title: 'Database Geologist', email: 'p.raghunathan@kestrelrange.example', team: 'Geoscience Data', location: 'Perth', timezone: 'Australia/Perth', phone: '+61 8 5550 2214', active: true, lastSignIn: '2026-09-21T02:41:00Z', prefs: prefs({ defaultSection: 'assays', gradeDecimals: 3, rowsPerPage: 100, compactTables: true }) },
  { id: 'u-dsorensen', name: 'Declan Sørensen', initials: 'DS', roleCode: 'LOG', title: 'Field Logistics Coordinator', email: 'd.sorensen@kestrelrange.example', team: 'Field Operations', location: 'Saskatoon', timezone: 'America/Regina', phone: '+1 306 555 0171', active: true, lastSignIn: '2026-09-20T22:15:00Z', prefs: prefs({ defaultSection: 'programmes', emailDigest: 'none' }) },
  { id: 'u-ymbeki', name: 'Yolanda Mbeki', initials: 'YM', roleCode: 'FIN', title: 'Finance Controller', email: 'y.mbeki@kestrelrange.example', team: 'Finance', location: 'Vancouver', timezone: 'America/Vancouver', phone: '+1 604 555 0162', active: true, lastSignIn: '2026-09-21T14:05:00Z', prefs: prefs({ defaultSection: 'approvals', dateFormat: 'DMY' }) },
  { id: 'u-hferrier', name: 'Hamish Ferrier', initials: 'HF', roleCode: 'TEN', title: 'Tenure & Permitting Officer', email: 'h.ferrier@kestrelrange.example', team: 'Land & Tenure', location: 'Perth', timezone: 'Australia/Perth', phone: '+61 8 5550 2290', active: true, lastSignIn: '2026-09-19T06:30:00Z', prefs: prefs({ defaultSection: 'projects', emailDigest: 'weekly' }) },
  { id: 'u-abarrientos', name: 'Ana Lucía Barrientos', initials: 'AB', roleCode: 'SYS', title: 'System Administrator', email: 'a.barrientos@kestrelrange.example', team: 'IT', location: 'Santiago', timezone: 'America/Santiago', phone: '+56 2 5550 4410', active: true, lastSignIn: '2026-09-21T12:20:00Z', prefs: prefs({ defaultSection: 'admin' }) },
  { id: 'u-kholloway', name: 'Kieran Holloway', initials: 'KH', roleCode: 'PGEO', title: 'Project Geologist', email: 'k.holloway@kestrelrange.example', team: 'Exploration', location: 'Kalgoorlie', timezone: 'Australia/Perth', phone: '+61 8 5550 2301', active: true, lastSignIn: '2026-09-18T09:12:00Z', prefs: prefs({ defaultSection: 'drilling', defaultProjectId: 'PRJ-0455' }) },
  { id: 'u-rnakamura', name: 'Rina Nakamura', initials: 'RN', roleCode: 'PGEO', title: 'Project Geologist', email: 'r.nakamura@kestrelrange.example', team: 'Exploration', location: 'Antofagasta', timezone: 'America/Santiago', phone: '+56 55 5550 1180', active: false, lastSignIn: '2026-06-30T17:45:00Z', prefs: prefs({ defaultSection: 'projects' }) },
];
export const USER = Object.fromEntries(USERS.map((u) => [u.id, u])) as Record<string, User>;

// Field crew who appear on rotations but do not sign in to ADIT.
export const FIELD_STAFF: { id: string; name: string; role: string }[] = [
  { id: 'f-01', name: 'Bram Vandenberg', role: 'Field geologist' }, { id: 'f-02', name: 'Sunita Kaur', role: 'Field geologist' },
  { id: 'f-03', name: 'Oleg Petrenko', role: 'Core technician' }, { id: 'f-04', name: 'Lea Moreau', role: 'Core technician' },
  { id: 'f-05', name: 'Jarrod Whitlock', role: 'Field technician' }, { id: 'f-06', name: 'Mele Tupou', role: 'Field technician' },
  { id: 'f-07', name: 'Aaron Grosvenor', role: 'Camp manager' }, { id: 'f-08', name: 'Nadia Farouk', role: 'Safety officer' },
  { id: 'f-09', name: 'Ezra Lindqvist', role: 'Geophysicist' }, { id: 'f-10', name: 'Chloé Beaulieu', role: 'Environmental officer' },
  { id: 'f-11', name: 'Tariq Osei', role: 'Medic' }, { id: 'f-12', name: 'Ingrid Halvorsen', role: 'Field geologist' },
];

export const LABS: Lab[] = [
  { id: 'lab-norlab', name: 'Norlab Assay Services', location: 'Thunder Bay, ON', accreditation: 'ISO/IEC 17025', turnaroundDays: 18, active: true },
  { id: 'lab-geostat', name: 'Geostat Laboratories', location: 'Perth, WA', accreditation: 'ISO/IEC 17025', turnaroundDays: 21, active: true },
  { id: 'lab-pacan', name: 'Pacific Analytical', location: 'Antofagasta, Chile', accreditation: 'ISO/IEC 17025', turnaroundDays: 24, active: true },
  { id: 'lab-prairie', name: 'Prairie Core Labs', location: 'Saskatoon, SK', accreditation: 'ISO 9001', turnaroundDays: 14, active: true },
  { id: 'lab-fenno', name: 'Fennoscandian Minerals Lab', location: 'Rovaniemi, Finland', accreditation: 'ISO/IEC 17025', turnaroundDays: 26, active: false },
];

export const COST_CODES: CostCode[] = [
  { code: '5100', name: 'Drilling contract', category: 'Drilling' }, { code: '5110', name: 'Drilling consumables', category: 'Drilling' },
  { code: '5120', name: 'Rig mobilisation', category: 'Drilling' }, { code: '5200', name: 'Assays and sample prep', category: 'Analytical' },
  { code: '5210', name: 'QAQC reference materials', category: 'Analytical' }, { code: '5300', name: 'Geophysical survey', category: 'Geophysics' },
  { code: '5400', name: 'Field wages', category: 'Personnel' }, { code: '5410', name: 'Contract geologists', category: 'Personnel' },
  { code: '5500', name: 'Camp and catering', category: 'Logistics' }, { code: '5510', name: 'Air charter', category: 'Logistics' },
  { code: '5520', name: 'Fuel', category: 'Logistics' }, { code: '5530', name: 'Freight', category: 'Logistics' },
  { code: '5600', name: 'Tenement rent and fees', category: 'Tenure' }, { code: '5610', name: 'Land access payments', category: 'Tenure' },
  { code: '5700', name: 'Environmental baseline', category: 'Permitting' }, { code: '5800', name: 'Resource consultants', category: 'Studies' },
  { code: '5810', name: 'Metallurgical testwork', category: 'Studies' }, { code: '5900', name: 'Insurance and safety', category: 'Overheads' },
];

export const WORKFLOWS: WorkflowDef[] = [
  { type: 'programme', name: 'Programme approval', description: 'A costed programme must be approved before mobilisation.', steps: [{ name: 'Technical review', roleCode: 'PGEO', sla: 3 }, { name: 'Budget check', roleCode: 'FIN', sla: 3 }, { name: 'Manager approval', roleCode: 'EXM', sla: 5 }] },
  { type: 'budget-variance', name: 'Budget variance', description: 'Spend forecast to exceed the approved programme budget by more than the variance threshold.', steps: [{ name: 'Finance review', roleCode: 'FIN', sla: 2 }, { name: 'Manager approval', roleCode: 'EXM', sla: 3 }] },
  { type: 'stage-gate', name: 'Stage-gate decision', description: 'Advance, hold or relinquish a project at the end of a stage.', steps: [{ name: 'Geology recommendation', roleCode: 'PGEO', sla: 5 }, { name: 'Finance review', roleCode: 'FIN', sla: 5 }, { name: 'Gate decision', roleCode: 'EXM', sla: 10 }] },
  { type: 'land-access', name: 'Land access agreement', description: 'Access to private or community land for a programme.', steps: [{ name: 'Tenure review', roleCode: 'TEN', sla: 7 }, { name: 'Manager sign-off', roleCode: 'EXM', sla: 5 }] },
  { type: 'permit', name: 'Work permit', description: 'Regulatory permit to disturb ground.', steps: [{ name: 'Permit lodgement', roleCode: 'TEN', sla: 10 }, { name: 'Regulator decision', roleCode: 'TEN', sla: 45 }] },
  { type: 'resource-release', name: 'Resource estimate release', description: 'Release an estimate from QP review to the portfolio.', steps: [{ name: 'Database sign-off', roleCode: 'DBGEO', sla: 5 }, { name: 'QP review', roleCode: 'PGEO', sla: 15 }, { name: 'Manager release', roleCode: 'EXM', sla: 3 }] },
  { type: 'tenement-renewal', name: 'Tenement renewal', description: 'Lodge a renewal before expiry.', steps: [{ name: 'Expenditure check', roleCode: 'FIN', sla: 5 }, { name: 'Renewal lodgement', roleCode: 'TEN', sla: 10 }] },
  { type: 'purchase-order', name: 'Purchase order', description: 'Purchase orders above the delegated limit.', steps: [{ name: 'Logistics check', roleCode: 'LOG', sla: 2 }, { name: 'Finance approval', roleCode: 'FIN', sla: 3 }] },
];

export const SETTINGS: SystemSettings = {
  tenantName: 'Kestrel Range Resources',
  tenantCode: 'KRR',
  fiscalYearStart: '01-01',
  baseCurrency: 'USD',
  priceDeck: COMMODITIES.map((c) => ({ commodity: c.code, value: c.price.value, unit: c.price.unit, source: 'Corporate price deck Q3 2026', asOf: '2026-07-01' })),
  cutoffs: { Au: 0.5, Li: 0.4, K: 15, Cu: 0.2, Ni: 0.3 },
  qaqc: { standardSigma: 3, blankMaxMultiple: 5, duplicateHardPct: 20, minInsertionRate: 5 },
  units: { length: 'm', mass: 't', area: 'km2' },
  numberLocale: 'en-CA',
  sessionTimeoutMin: 30,
  passwordMinLength: 12,
  mfaRequired: true,
  ssoProvider: 'Entra ID',
  auditRetentionDays: 2555,
  attachmentMaxMb: 250,
  autoNumbering: { project: 'PRJ-{0000}', programme: 'PRG-{YYYY}-{000}', batch: 'LAB-{YY}-{00000}', approval: 'WF-{YYYY}-{0000}' },
  gateApproverRole: 'EXM',
  varianceThresholdPct: 10,
};

interface ProjectSeed {
  id: string; name: string; commodity: CommodityCode; jurisdiction: string; country: string; stage: Stage; status: Project['status']; outcome?: Project['outcome'];
  managerId: string; geologistId: string; areaKm2: number; startedOn: string; closedOn?: string; planned: number; lat: number; lon: number; description: string; nextGateOn?: string; watch?: boolean; prefix: string;
}

const PROJECT_SEEDS: ProjectSeed[] = [
  { id: 'PRJ-0412', prefix: 'WC', name: 'Wolverine Creek', commodity: 'Au', jurisdiction: 'Ontario', country: 'Canada', stage: 'drilling', status: 'active', managerId: 'u-mokonkwo', geologistId: 'u-twierzbicki', areaKm2: 148.2, startedOn: '2023-04-11', planned: 4200000, lat: 48.62, lon: -81.11, description: 'Shear-hosted quartz-vein gold along the Wolverine deformation zone. Phase 3 diamond drilling is testing the down-plunge extension of the Main Zone below 350 m.', nextGateOn: '2027-02-15', watch: true },
  { id: 'PRJ-0387', prefix: 'BR', name: 'Bellamy Ridge', commodity: 'Au', jurisdiction: 'Nevada', country: 'United States', stage: 'resource', status: 'active', managerId: 'u-mokonkwo', geologistId: 'u-kholloway', areaKm2: 62.7, startedOn: '2022-09-02', planned: 3100000, lat: 40.81, lon: -116.92, description: 'Carlin-style disseminated gold in silty carbonate. Maiden resource estimate in QP review; infill RC completed in July.', nextGateOn: '2026-11-30', watch: true },
  { id: 'PRJ-0455', prefix: 'TH', name: 'Tarrant Hills', commodity: 'Li', jurisdiction: 'Western Australia', country: 'Australia', stage: 'target', status: 'active', managerId: 'u-mokonkwo', geologistId: 'u-kholloway', areaKm2: 211.4, startedOn: '2025-02-20', planned: 1450000, lat: -21.34, lon: 119.72, description: 'Pegmatite swarm in the eastern Pilbara. Soil geochemistry and mapping have ranked eleven targets; first-pass RC drilling is being costed.', nextGateOn: '2026-12-10' },
  { id: 'PRJ-0398', prefix: 'MA', name: 'Mount Aster', commodity: 'Li', jurisdiction: 'Québec', country: 'Canada', stage: 'drilling', status: 'active', managerId: 'u-mokonkwo', geologistId: 'u-twierzbicki', areaKm2: 96.5, startedOn: '2023-06-14', planned: 3800000, lat: 52.21, lon: -74.58, description: 'Spodumene-bearing LCT pegmatite dykes, three swarms over 4.2 km of strike. Phase 2 diamond drilling in progress; winter road access closes mid-November.', nextGateOn: '2027-03-31', watch: true },
  { id: 'PRJ-0421', prefix: 'LO', name: 'Lorimer', commodity: 'K', jurisdiction: 'Saskatchewan', country: 'Canada', stage: 'scoping', status: 'active', managerId: 'u-mokonkwo', geologistId: 'u-twierzbicki', areaKm2: 318.9, startedOn: '2021-11-03', planned: 2600000, lat: 52.95, lon: -105.41, description: 'Sylvinite beds of the Patience Lake and Belle Plaine members at 1,050–1,180 m depth. Scoping study underway on a solution-mining case.', nextGateOn: '2026-10-31', watch: true },
  { id: 'PRJ-0468', prefix: 'DF', name: 'Dunmore Flats', commodity: 'K', jurisdiction: 'Saskatchewan', country: 'Canada', stage: 'recon', status: 'active', managerId: 'u-mokonkwo', geologistId: 'u-twierzbicki', areaKm2: 402.0, startedOn: '2026-03-09', planned: 650000, lat: 51.88, lon: -104.12, description: 'Permit area over the Prairie Evaporite trend, 40 km south-east of Lorimer. Seismic reprocessing and one stratigraphic hole planned for the 2027 winter.', nextGateOn: '2027-04-30' },
  { id: 'PRJ-0376', prefix: 'CA', name: 'Cerro Azufre', commodity: 'Cu', jurisdiction: 'Antofagasta Region', country: 'Chile', stage: 'resource', status: 'active', managerId: 'u-mokonkwo', geologistId: 'u-rnakamura', areaKm2: 87.3, startedOn: '2022-03-28', planned: 5400000, lat: -23.91, lon: -68.87, description: 'Porphyry Cu-Mo system with a supergene enrichment blanket. Resource update in progress; project geologist vacancy since June.', nextGateOn: '2026-12-18', watch: true },
  { id: 'PRJ-0441', prefix: 'CH', name: 'Copper Hollow', commodity: 'Cu', jurisdiction: 'Arizona', country: 'United States', stage: 'target', status: 'active', managerId: 'u-mokonkwo', geologistId: 'u-kholloway', areaKm2: 54.1, startedOn: '2024-08-19', planned: 1200000, lat: 32.74, lon: -110.28, description: 'Covered porphyry target under 120–200 m of gravel. IP survey complete; two chargeability anomalies ranked for scout drilling.', nextGateOn: '2027-01-29' },
  { id: 'PRJ-0409', prefix: 'KL', name: 'Kettle Lake', commodity: 'Ni', jurisdiction: 'Ontario', country: 'Canada', stage: 'drilling', status: 'active', managerId: 'u-mokonkwo', geologistId: 'u-twierzbicki', areaKm2: 73.6, startedOn: '2023-09-25', planned: 2900000, lat: 47.28, lon: -84.02, description: 'Komatiite-hosted Ni-Cu-PGE sulphide. Borehole EM conductors under test with three diamond holes; assay batch on QAQC hold.', nextGateOn: '2027-02-28', watch: true },
  { id: 'PRJ-0463', prefix: 'HJ', name: 'Hjalmar Belt', commodity: 'Ni', jurisdiction: 'Lapland', country: 'Finland', stage: 'recon', status: 'active', managerId: 'u-mokonkwo', geologistId: 'u-kholloway', areaKm2: 156.8, startedOn: '2026-01-15', planned: 480000, lat: 67.42, lon: 26.61, description: 'Reservation over a layered intrusion contact. Till geochemistry and ground magnetics planned for the 2027 field season.', nextGateOn: '2027-05-15' },
  { id: 'PRJ-0433', prefix: 'SD', name: 'Sable Dome', commodity: 'Au', jurisdiction: 'Western Australia', country: 'Australia', stage: 'decision', status: 'active', managerId: 'u-mokonkwo', geologistId: 'u-kholloway', areaKm2: 39.4, startedOn: '2023-11-06', planned: 1900000, lat: -30.72, lon: 121.45, description: 'Granite-dome-margin gold. Phase 2 RC returned narrow intercepts below the economic threshold; stage-gate recommendation is to relinquish the southern blocks.', nextGateOn: '2026-09-30', watch: true },
  { id: 'PRJ-0390', prefix: 'OC', name: 'Orrin Creek', commodity: 'Cu', jurisdiction: 'British Columbia', country: 'Canada', stage: 'recon', status: 'on-hold', managerId: 'u-mokonkwo', geologistId: 'u-twierzbicki', areaKm2: 118.0, startedOn: '2022-07-12', planned: 250000, lat: 55.31, lon: -127.64, description: 'Alkalic porphyry target. On hold pending the land-access agreement with the title-holders; no field work since 2025.', nextGateOn: '2027-06-30' },
  { id: 'PRJ-0362', prefix: 'PS', name: 'Pinnacle Salar', commodity: 'Li', jurisdiction: 'Salta', country: 'Argentina', stage: 'decision', status: 'closed', outcome: 'advanced', managerId: 'u-mokonkwo', geologistId: 'u-rnakamura', areaKm2: 224.7, startedOn: '2021-05-17', closedOn: '2026-04-30', planned: 0, lat: -24.55, lon: -66.97, description: 'Lithium brine. Advanced to pre-feasibility on 2026-04-30 and transferred to the development group; exploration records are read-only.' },
  { id: 'PRJ-0351', prefix: 'MG', name: 'Marrow Gulch', commodity: 'Au', jurisdiction: 'Nevada', country: 'United States', stage: 'decision', status: 'closed', outcome: 'relinquished', managerId: 'u-mokonkwo', geologistId: 'u-kholloway', areaKm2: 27.9, startedOn: '2021-02-08', closedOn: '2025-12-12', planned: 0, lat: 39.44, lon: -117.02, description: 'Epithermal vein target. Relinquished after Phase 2 drilling failed to extend the discovery vein; claims dropped 2025-12-12.' },
];

const TENEMENT_TYPES: Record<string, (r: Rng, i: number) => { id: string; type: string }> = {
  Ontario: (r, i) => ({ id: `${r.int(300000, 399999)}${i}`.slice(0, 6), type: 'Mining claim (cell)' }),
  Québec: (r) => ({ id: `CDC ${r.int(2400000, 2499999)}`, type: 'Claim (CDC)' }),
  Saskatchewan: (r) => ({ id: `MC${pad(r.int(10000, 99999), 8)}`, type: 'Mineral claim' }),
  'British Columbia': (r) => ({ id: `${r.int(1000000, 1099999)}`, type: 'Mineral claim (MTO)' }),
  Nevada: (r) => ({ id: `NMC ${r.int(1100000, 1199999)}`, type: 'BLM lode claim block' }),
  Arizona: (r) => ({ id: `AMC ${r.int(400000, 459999)}`, type: 'BLM lode claim block' }),
  'Western Australia': (r) => ({ id: `E ${r.int(45, 63)}/${r.int(1000, 6999)}`, type: 'Exploration licence' }),
  'Antofagasta Region': (r) => ({ id: `${r.pick(['Azufre', 'Sierra', 'Quebrada'])} ${r.int(1, 24)} 1/30`, type: 'Concesión de exploración' }),
  Lapland: (r) => ({ id: `VA${r.int(2024, 2026)}:${pad(r.int(1, 99), 4)}`, type: 'Reservation' }),
  Salta: (r) => ({ id: `Exp. ${r.int(18000, 19999)}`, type: 'Cateo' }),
};

const HOLDERS: Record<string, string> = { Canada: 'Kestrel Range Resources Ltd.', 'United States': 'Kestrel Range (Nevada) Inc.', Australia: 'Kestrel Range Australia Pty Ltd', Chile: 'Kestrel Range Chile SpA', Finland: 'Kestrel Range Finland Oy', Argentina: 'Kestrel Range Argentina S.A.' };

export function buildWorld(seed = 7401): World {
  const r = new Rng(seed);
  const projects: Project[] = PROJECT_SEEDS.map((s) => {
    const spentPct = s.status === 'closed' ? 1 : { recon: 0.31, target: 0.48, drilling: 0.67, resource: 0.74, scoping: 0.58, decision: 0.92 }[s.stage] + r.float(-0.06, 0.06);
    const spent = Math.round(s.planned * spentPct);
    const committed = Math.round(spent + s.planned * (s.status === 'active' ? r.float(0.05, 0.18) : 0));
    const forecast = Math.round(s.planned * (s.status === 'active' ? r.float(0.92, 1.14) : 1));
    return { id: s.id, name: s.name, commodity: s.commodity, jurisdiction: s.jurisdiction, country: s.country, stage: s.stage, status: s.status, outcome: s.outcome, managerId: s.managerId, geologistId: s.geologistId, areaKm2: s.areaKm2, startedOn: s.startedOn, closedOn: s.closedOn, budget: { planned: s.planned, committed, spent, forecast }, lat: s.lat, lon: s.lon, description: s.description, nextGateOn: s.nextGateOn, watch: !!s.watch };
  });
  const prefixOf = Object.fromEntries(PROJECT_SEEDS.map((s) => [s.id, s.prefix]));

  // ---- tenements
  const tenements: Tenement[] = [];
  for (const p of projects) {
    const n = p.status === 'closed' ? 1 : r.int(1, 4);
    let remaining = p.areaKm2;
    for (let i = 0; i < n; i++) {
      const t = TENEMENT_TYPES[p.jurisdiction](r, i);
      const area = i === n - 1 ? remaining : Math.round(remaining * r.float(0.2, 0.55) * 10) / 10;
      remaining = Math.round((remaining - area) * 10) / 10;
      const granted = addDays(p.startedOn, r.int(-400, 60));
      const term = r.pick([365 * 2, 365 * 3, 365 * 5]);
      let expires = addDays(granted, term);
      while (expires < '2026-06-01') expires = addDays(expires, term);
      const commitment = Math.round(area * r.int(1800, 5200));
      const days = daysBetween(TODAY, expires);
      let status: Tenement['status'] = 'current';
      if (p.status === 'closed' && p.outcome === 'relinquished') status = 'lapsed';
      else if (days < 0) status = 'lapsed';
      else if (days < 60) status = r.chance(0.5) ? 'renewal-lodged' : 'expiring';
      else if (days < 120) status = 'expiring';
      if (p.id === 'PRJ-0468' && i === 0) status = 'application';
      tenements.push({ id: t.id, projectId: p.id, type: t.type, holder: HOLDERS[p.country], grantedOn: granted, expiresOn: expires, areaKm2: area, annualCommitment: commitment, spentToDate: Math.round(commitment * r.float(0.3, 1.3)), rentDue: Math.round(area * r.int(120, 480)), status });
    }
  }
  // make sure a few are about to expire, for the attention ledger
  tenements.filter((t) => t.projectId === 'PRJ-0409')[0].expiresOn = addDays(TODAY, 34);
  tenements.filter((t) => t.projectId === 'PRJ-0409')[0].status = 'expiring';
  tenements.filter((t) => t.projectId === 'PRJ-0455')[0].expiresOn = addDays(TODAY, 71);
  tenements.filter((t) => t.projectId === 'PRJ-0455')[0].status = 'renewal-lodged';
  tenements.filter((t) => t.projectId === 'PRJ-0376')[0].expiresOn = addDays(TODAY, 19);
  tenements.filter((t) => t.projectId === 'PRJ-0376')[0].status = 'expiring';

  // ---- rigs and camps
  const rigs: Rig[] = [
    { id: 'RIG-07', name: 'Boart LF-90 #7', contractor: 'Northline Drilling', type: 'DDH', capacityM: 1200, dayRate: 6800, status: 'assigned', location: 'Wolverine Creek' },
    { id: 'RIG-11', name: 'Sandvik DE710 #11', contractor: 'Northline Drilling', type: 'DDH', capacityM: 900, dayRate: 6200, status: 'assigned', location: 'Mount Aster' },
    { id: 'RIG-14', name: 'Boart LF-70 #14', contractor: 'Boreal Core', type: 'DDH', capacityM: 700, dayRate: 5600, status: 'assigned', location: 'Kettle Lake' },
    { id: 'RIG-22', name: 'Schramm T685 RC', contractor: 'Westgate Drilling', type: 'RC', capacityM: 400, dayRate: 4900, status: 'available', location: 'Kalgoorlie yard' },
    { id: 'RIG-23', name: 'Schramm T450 RC', contractor: 'Westgate Drilling', type: 'RC', capacityM: 300, dayRate: 4200, status: 'maintenance', location: 'Kalgoorlie yard' },
    { id: 'RIG-31', name: 'Foremost DR-24 #31', contractor: 'Andes Perforaciones', type: 'DDH', capacityM: 1500, dayRate: 7400, status: 'available', location: 'Calama yard' },
    { id: 'RIG-40', name: 'Sonic SDC 550', contractor: 'Prairie Sonic', type: 'Sonic', capacityM: 250, dayRate: 5100, status: 'demobilised', location: 'Saskatoon' },
    { id: 'RIG-44', name: 'Aircore AC-2', contractor: 'Westgate Drilling', type: 'AC', capacityM: 120, dayRate: 2600, status: 'available', location: 'Kalgoorlie yard' },
  ];
  const camps: Camp[] = [
    { id: 'CMP-WC', name: 'Wolverine Creek camp', projectId: 'PRJ-0412', beds: 24, occupied: 19, access: 'Gravel road, 62 km from Timmins', medic: true, status: 'open' },
    { id: 'CMP-MA', name: 'Aster Lake camp', projectId: 'PRJ-0398', beds: 18, occupied: 16, access: 'Float plane / winter road (Dec–Mar)', medic: true, status: 'open' },
    { id: 'CMP-KL', name: 'Kettle Lake camp', projectId: 'PRJ-0409', beds: 12, occupied: 9, access: 'Helicopter, 40 min from Wawa', medic: false, status: 'open' },
    { id: 'CMP-CA', name: 'Campamento Azufre', projectId: 'PRJ-0376', beds: 30, occupied: 4, access: '4WD, 3 h from Calama', medic: true, status: 'open' },
    { id: 'CMP-TH', name: 'Tarrant Hills fly camp', projectId: 'PRJ-0455', beds: 8, occupied: 0, access: '4WD, 210 km from Marble Bar', medic: false, status: 'closed' },
    { id: 'CMP-LO', name: 'Lorimer site office', projectId: 'PRJ-0421', beds: 0, occupied: 0, access: 'Highway 3, town accommodation', medic: false, status: 'winterised' },
  ];

  // ---- programmes
  const programmes: Programme[] = [];
  const approvals: Approval[] = [];
  const holes: Drillhole[] = [];
  const batches: SampleBatch[] = [];
  const samples: Sample[] = [];
  const intercepts: Intercept[] = [];
  let prgSeq = 1;
  let wfSeq = 120;
  let batchSeq = 4400;
  let logSeq = 1;
  const nextPrg = (year: number) => `PRG-${year}-${pad(prgSeq++, 3)}`;
  const nextWf = () => `WF-2026-${pad(wfSeq++, 4)}`;
  const nextBatch = () => `LAB-26-${pad(batchSeq++, 5)}`;

  const crewFor = (n: number, from: string, to: string, lead: string): CrewAssignment[] => {
    const staff = r.shuffle(FIELD_STAFF).slice(0, n);
    const out: CrewAssignment[] = [{ personId: lead, role: 'Programme lead', from, to }];
    let cursor = from;
    for (const s of staff) {
      const rot = r.pick([14, 21, 28]);
      const end = addDays(cursor, rot);
      out.push({ personId: s.id, role: s.role, from: cursor, to: end > to ? to : end });
      if (r.chance(0.5)) cursor = addDays(cursor, r.int(0, 10));
    }
    return out;
  };
  const logisticsFor = (p: Project, prg: { startOn: string; endOn: string; type: Programme['type'] }): LogisticsItem[] => {
    const items: LogisticsItem[] = [];
    const st = (d: string): LogisticsItem['status'] => (d < addDays(TODAY, -3) ? 'delivered' : d < addDays(TODAY, 21) ? 'confirmed' : r.chance(0.6) ? 'booked' : 'requested');
    const add = (kind: LogisticsItem['kind'], description: string, supplier: string, on: string, cost: number) => items.push({ id: `LG-${pad(logSeq++, 4)}`, kind, description, supplier, scheduledOn: on, cost, status: st(on) });
    const air = p.country === 'Canada' ? 'Boreal Air Charters' : p.country === 'Australia' ? 'Pilbara Aviation' : p.country === 'Chile' ? 'Aerocordillera' : 'Arctic Wings';
    add('charter', `Crew change flight, ${p.jurisdiction}`, air, prg.startOn, r.int(6000, 14000));
    add('camp', 'Camp catering and housekeeping, weekly', 'Outpost Camp Services', addDays(prg.startOn, 3), r.int(9000, 22000));
    add('fuel', `Diesel, ${r.int(4, 12) * 1000} L bulk delivery`, 'Northfuel Distribution', addDays(prg.startOn, 5), r.int(8000, 21000));
    if (prg.type === 'drilling') add('equipment', 'Core trays, 1,200 units, and sample bags', 'Geosupply Direct', addDays(prg.startOn, -7), r.int(4000, 9000));
    add('medical', 'Emergency response plan and medic rotation', 'Remote Medical Partners', addDays(prg.startOn, -2), r.int(5000, 12000));
    add('freight', 'Sample dispatch to laboratory, road freight', 'Interline Freight', addDays(prg.startOn, 26), r.int(1500, 4200));
    if (r.chance(0.5)) add('permit', 'Water-taking permit renewal', 'Regulator', addDays(prg.startOn, -20), 0);
    return items;
  };

  const PRG_PLANS: { projectId: string; type: Programme['type']; name: string; phase: ProgrammePhase; start: string; end: string; budget: number; metres?: number; holesN?: number; rigId?: string; objective: string; approved?: boolean }[] = [
    { projectId: 'PRJ-0412', type: 'drilling', name: 'Phase 3 diamond drilling, Main Zone plunge', phase: 'in-progress', start: '2026-07-06', end: '2026-11-14', budget: 1850000, metres: 9600, holesN: 22, rigId: 'RIG-07', objective: 'Extend the Main Zone below 350 m on 80 m sections; test the hinge zone for a second lens.' },
    { projectId: 'PRJ-0412', type: 'drilling', name: 'Phase 2 diamond drilling', phase: 'complete', start: '2025-06-02', end: '2025-10-24', budget: 1420000, metres: 7800, holesN: 19, rigId: 'RIG-07', objective: 'Define the Main Zone to 350 m on 40 m sections.' },
    { projectId: 'PRJ-0412', type: 'geophysics', name: 'Downhole EM, Phase 3 holes', phase: 'approved', start: '2026-10-05', end: '2026-10-19', budget: 96000, objective: 'Survey completed Phase 3 holes for off-hole conductors.' },
    { projectId: 'PRJ-0412', type: 'metallurgy', name: 'Preliminary cyanidation testwork', phase: 'costed', start: '2026-11-20', end: '2027-02-20', budget: 145000, objective: 'Bottle-roll and gravity recovery on three Main Zone composites.' },
    { projectId: 'PRJ-0387', type: 'drilling', name: 'Infill RC, resource area', phase: 'complete', start: '2026-04-13', end: '2026-07-18', budget: 980000, metres: 11200, holesN: 46, rigId: 'RIG-22', objective: 'Infill to 25 m spacing across the resource area to support Indicated classification.' },
    { projectId: 'PRJ-0387', type: 'metallurgy', name: 'Column leach testwork', phase: 'in-progress', start: '2026-06-01', end: '2026-12-15', budget: 210000, objective: 'Heap-leach amenability on four lithological composites.' },
    { projectId: 'PRJ-0387', type: 'baseline', name: 'Environmental baseline, year 2', phase: 'in-progress', start: '2026-01-15', end: '2026-12-31', budget: 165000, objective: 'Second year of groundwater, flora and fauna monitoring.' },
    { projectId: 'PRJ-0455', type: 'geochem', name: 'Soil geochemistry, eastern swarm', phase: 'complete', start: '2026-04-20', end: '2026-06-12', budget: 118000, objective: 'Li-Cs-Ta soil sampling on 200 × 50 m grid over the eastern pegmatite swarm.' },
    { projectId: 'PRJ-0455', type: 'mapping', name: 'Pegmatite mapping and rock chips', phase: 'complete', start: '2026-05-04', end: '2026-06-26', budget: 74000, objective: 'Map dyke geometry and zonation; rock-chip every outcropping dyke.' },
    { projectId: 'PRJ-0455', type: 'drilling', name: 'First-pass RC, targets T1–T6', phase: 'costed', start: '2027-03-15', end: '2027-05-30', budget: 640000, metres: 4800, holesN: 32, rigId: 'RIG-22', objective: 'Scout-drill the six top-ranked targets after the wet season.', approved: false },
    { projectId: 'PRJ-0398', type: 'drilling', name: 'Phase 2 diamond drilling, Dyke swarm B', phase: 'in-progress', start: '2026-06-22', end: '2026-11-08', budget: 2100000, metres: 8400, holesN: 28, rigId: 'RIG-11', objective: 'Drill swarm B on 100 m sections to 200 m vertical; twin two Phase 1 holes for QAQC.' },
    { projectId: 'PRJ-0398', type: 'drilling', name: 'Phase 1 diamond drilling', phase: 'complete', start: '2025-01-13', end: '2025-04-04', budget: 1650000, metres: 6100, holesN: 20, rigId: 'RIG-11', objective: 'First drill test of swarms A and B from the winter road.' },
    { projectId: 'PRJ-0398', type: 'baseline', name: 'Environmental baseline, year 1', phase: 'in-progress', start: '2026-05-01', end: '2027-04-30', budget: 190000, objective: 'Baseline water quality and caribou monitoring.' },
    { projectId: 'PRJ-0421', type: 'drilling', name: 'Stratigraphic hole LO-03 (core)', phase: 'complete', start: '2026-01-19', end: '2026-03-06', budget: 1350000, metres: 1240, holesN: 1, rigId: 'RIG-40', objective: 'Core the full evaporite section for bed correlation and brine-chemistry samples.' },
    { projectId: 'PRJ-0421', type: 'geophysics', name: '2D seismic, lines L7–L9', phase: 'complete', start: '2025-11-03', end: '2025-12-19', budget: 720000, objective: 'Image the Patience Lake member across the eastern half of the claims.' },
    { projectId: 'PRJ-0421', type: 'metallurgy', name: 'Solution-mining cavern modelling', phase: 'in-progress', start: '2026-07-01', end: '2026-10-30', budget: 240000, objective: 'Cavern geometry and brine-grade modelling for the scoping study.' },
    { projectId: 'PRJ-0468', type: 'geophysics', name: 'Seismic reprocessing, legacy lines', phase: 'scoped', start: '2026-11-02', end: '2027-01-30', budget: 185000, objective: 'Reprocess 1998 vintage seismic to map the salt back.' },
    { projectId: 'PRJ-0468', type: 'drilling', name: 'Stratigraphic hole DF-01', phase: 'draft', start: '2027-01-18', end: '2027-03-12', budget: 1400000, metres: 1300, holesN: 1, objective: 'One cored stratigraphic hole to confirm sylvinite in the permit area.' },
    { projectId: 'PRJ-0376', type: 'drilling', name: 'Resource extension drilling, north-east', phase: 'demobilising', start: '2026-03-02', end: '2026-08-29', budget: 2450000, metres: 12600, holesN: 24, rigId: 'RIG-31', objective: 'Extend the enrichment blanket to the north-east and infill the hypogene zone.' },
    { projectId: 'PRJ-0376', type: 'metallurgy', name: 'Sulphide flotation testwork', phase: 'in-progress', start: '2026-05-12', end: '2026-11-30', budget: 310000, objective: 'Rougher and cleaner flotation on hypogene composites.' },
    { projectId: 'PRJ-0376', type: 'drilling', name: 'Geotechnical and hydrogeology holes', phase: 'approved', start: '2026-10-12', end: '2026-12-05', budget: 680000, metres: 2100, holesN: 6, rigId: 'RIG-31', objective: 'Six oriented geotechnical holes and two monitoring wells for the resource update.' },
    { projectId: 'PRJ-0441', type: 'geophysics', name: 'Gradient-array IP survey', phase: 'complete', start: '2026-02-09', end: '2026-03-20', budget: 262000, objective: 'IP/resistivity over the covered target area on 200 m lines.' },
    { projectId: 'PRJ-0441', type: 'drilling', name: 'Scout RC, chargeability anomalies A and B', phase: 'costed', start: '2026-11-30', end: '2027-01-22', budget: 540000, metres: 2400, holesN: 8, rigId: 'RIG-44', objective: 'Eight scout holes through cover into the two anomalies.', approved: false },
    { projectId: 'PRJ-0409', type: 'drilling', name: 'BHEM conductor test, Phase 2', phase: 'in-progress', start: '2026-08-10', end: '2026-10-30', budget: 1150000, metres: 3600, holesN: 8, rigId: 'RIG-14', objective: 'Test three off-hole borehole EM conductors from Phase 1.' },
    { projectId: 'PRJ-0409', type: 'drilling', name: 'Phase 1 diamond drilling', phase: 'complete', start: '2025-08-04', end: '2025-11-12', budget: 1380000, metres: 4200, holesN: 11, rigId: 'RIG-14', objective: 'Drill the ground EM conductors along the komatiite contact.' },
    { projectId: 'PRJ-0409', type: 'geophysics', name: 'Borehole EM, Phase 1 holes', phase: 'complete', start: '2025-11-17', end: '2025-12-05', budget: 88000, objective: 'BHEM in all Phase 1 holes.' },
    { projectId: 'PRJ-0463', type: 'geochem', name: 'Till geochemistry, 2027', phase: 'scoped', start: '2027-06-15', end: '2027-08-20', budget: 210000, objective: 'Basal till sampling on 500 m centres across the reservation.' },
    { projectId: 'PRJ-0463', type: 'geophysics', name: 'Ground magnetics, 2027', phase: 'draft', start: '2027-03-01', end: '2027-04-15', budget: 140000, objective: 'Snowmobile-borne magnetics on 100 m lines.' },
    { projectId: 'PRJ-0433', type: 'drilling', name: 'Phase 2 RC, southern blocks', phase: 'complete', start: '2026-03-09', end: '2026-05-22', budget: 760000, metres: 6400, holesN: 34, rigId: 'RIG-23', objective: 'Test the southern dome margin on 80 m sections.' },
    { projectId: 'PRJ-0433', type: 'drilling', name: 'Phase 1 RC', phase: 'complete', start: '2025-04-07', end: '2025-06-13', budget: 690000, metres: 5900, holesN: 31, rigId: 'RIG-23', objective: 'First-pass RC on the geochemical anomalies.' },
    { projectId: 'PRJ-0390', type: 'mapping', name: 'Reconnaissance mapping', phase: 'cancelled', start: '2025-07-14', end: '2025-08-22', budget: 62000, objective: 'Cancelled pending the land-access agreement.' },
    { projectId: 'PRJ-0362', type: 'drilling', name: 'Brine production well test', phase: 'complete', start: '2025-09-01', end: '2025-12-20', budget: 2200000, metres: 820, holesN: 3, objective: 'Pump-test three production wells for the PFS.' },
    { projectId: 'PRJ-0351', type: 'drilling', name: 'Phase 2 RC, vein extension', phase: 'complete', start: '2025-05-05', end: '2025-07-11', budget: 610000, metres: 4400, holesN: 26, objective: 'Test the along-strike extension of the discovery vein.' },
  ];

  const stepsFor = (type: ApprovalType) => WORKFLOWS.find((w) => w.type === type)!.steps;
  const mkApproval = (a: { type: ApprovalType; title: string; projectId: string; subjectType: Approval['subjectType']; subjectId: string; requestedById: string; submittedOn: string; status: Approval['status']; amount?: number; summary: string; progress: number; due?: string }): Approval => {
    const defs = stepsFor(a.type);
    const actorFor = (rc: string) => USERS.find((u) => u.roleCode === rc && u.active)!.id;
    const steps = defs.map((d, i) => {
      const s: Approval['steps'][number] = { name: d.name, roleCode: d.roleCode, actorId: actorFor(d.roleCode) };
      if (i < a.progress) { s.decision = 'approved'; s.on = addDays(a.submittedOn, defs.slice(0, i + 1).reduce((x, y) => x + Math.min(y.sla, r.int(1, y.sla)), 0)); }
      return s;
    });
    if (a.status === 'rejected') { const st = steps[a.progress]; st.decision = 'rejected'; st.on = addDays(a.submittedOn, r.int(2, 9)); }
    if (a.status === 'returned') { const st = steps[a.progress]; st.decision = 'returned'; st.on = addDays(a.submittedOn, r.int(2, 9)); st.note = 'Returned for more detail on the contingency.'; }
    const totalSla = defs.reduce((x, y) => x + y.sla, 0);
    return { id: nextWf(), type: a.type, title: a.title, projectId: a.projectId, subjectType: a.subjectType, subjectId: a.subjectId, requestedById: a.requestedById, submittedOn: a.submittedOn, dueOn: a.due ?? addDays(a.submittedOn, totalSla), status: a.status, amount: a.amount, steps, currentStep: Math.min(a.progress, defs.length - 1), summary: a.summary };
  };

  for (const plan of PRG_PLANS.slice().sort((a, b) => (a.start < b.start ? -1 : 1))) {
    const p = projects.find((x) => x.id === plan.projectId)!;
    const year = Number(plan.start.slice(0, 4));
    const id = nextPrg(year);
    const spentFrac = { draft: 0, scoped: 0, costed: 0, approved: 0.04, mobilising: 0.12, 'in-progress': Math.min(0.95, Math.max(0.15, daysBetween(plan.start, TODAY) / Math.max(1, daysBetween(plan.start, plan.end)))), demobilising: 0.97, complete: r.float(0.88, 1.09), cancelled: 0.03 }[plan.phase];
    const spent = Math.round(plan.budget * spentFrac);
    const lead = p.geologistId === 'u-rnakamura' ? 'u-kholloway' : p.geologistId;
    const prg: Programme = {
      id, projectId: p.id, type: plan.type, name: plan.name, phase: plan.phase, startOn: plan.start, endOn: plan.end, budget: plan.budget, spent,
      metresPlanned: plan.metres, holesPlanned: plan.holesN, rigId: plan.rigId, campId: camps.find((c) => c.projectId === p.id)?.id,
      crew: ['approved', 'mobilising', 'in-progress', 'demobilising', 'complete'].includes(plan.phase) ? crewFor(plan.type === 'drilling' ? r.int(5, 8) : r.int(2, 4), plan.start, plan.end, lead) : [],
      logistics: ['approved', 'mobilising', 'in-progress', 'demobilising'].includes(plan.phase) ? logisticsFor(p, { startOn: plan.start, endOn: plan.end, type: plan.type }) : [],
      objective: plan.objective, leadId: lead,
    };
    if (['approved', 'mobilising', 'in-progress', 'demobilising', 'complete'].includes(plan.phase)) {
      const ap = mkApproval({ type: 'programme', title: `Programme approval: ${plan.name}`, projectId: p.id, subjectType: 'programme', subjectId: id, requestedById: lead, submittedOn: addDays(plan.start, -r.int(21, 45)), status: 'approved', amount: plan.budget, summary: `${plan.objective} Budget ${plan.budget.toLocaleString('en-CA')} ${SETTINGS.baseCurrency}.`, progress: 3 });
      approvals.push(ap); prg.approvalId = ap.id;
    } else if (plan.phase === 'costed') {
      const ap = mkApproval({ type: 'programme', title: `Programme approval: ${plan.name}`, projectId: p.id, subjectType: 'programme', subjectId: id, requestedById: lead, submittedOn: addDays(TODAY, -r.int(2, 12)), status: 'pending', amount: plan.budget, summary: `${plan.objective} Budget ${plan.budget.toLocaleString('en-CA')} ${SETTINGS.baseCurrency}.`, progress: r.int(0, 2) });
      approvals.push(ap); prg.approvalId = ap.id;
    }
    programmes.push(prg);

    // ---- holes for drilling programmes
    if (plan.type === 'drilling' && plan.holesN && plan.metres && ['in-progress', 'demobilising', 'complete'].includes(plan.phase)) {
      const cdef = COMMODITY[p.commodity];
      const drilledFrac = plan.phase === 'complete' ? 1 : plan.phase === 'demobilising' ? 0.96 : Math.min(0.9, Math.max(0.2, daysBetween(plan.start, TODAY) / Math.max(1, daysBetween(plan.start, plan.end))));
      const nDone = Math.round(plan.holesN * drilledFrac);
      const avg = plan.metres / plan.holesN;
      const prevCount = holes.filter((h) => h.projectId === p.id).length;
      const holeType = plan.rigId ? rigs.find((x) => x.id === plan.rigId)!.type : cdef.holeTypes[0];
      let drilledTotal = 0;
      const e0 = r.int(380000, 620000), n0 = Math.round(p.lat >= 0 ? p.lat * 110900 : 10000000 - Math.abs(p.lat) * 110900);
      for (let i = 0; i < plan.holesN; i++) {
        const seq = prevCount + i + 1;
        const hid = `${prefixOf[p.id]}-${holeType}-${pad(seq, 3)}`;
        const planned = Math.round(avg * r.float(0.7, 1.4) / 3) * 3;
        let status: HoleStatus;
        let depth = 0;
        const started = addDays(plan.start, Math.round((i / plan.holesN) * daysBetween(plan.start, plan.end)));
        const completed = addDays(started, Math.max(2, Math.round(planned / r.int(60, 110))));
        if (i < nDone) {
          depth = r.chance(0.08) ? Math.round(planned * r.float(0.3, 0.7)) : Math.round(planned * r.float(0.96, 1.12));
          const abandoned = depth < planned * 0.75;
          status = abandoned ? 'abandoned' : completed < addDays(TODAY, -35) ? 'assayed' : completed < addDays(TODAY, -14) ? 'sampled' : completed < addDays(TODAY, -3) ? 'logged' : 'completed';
          if (plan.phase === 'complete') status = abandoned ? 'abandoned' : 'assayed';
        } else if (i === nDone && plan.phase === 'in-progress') { status = 'drilling'; depth = Math.round(planned * r.float(0.2, 0.8)); }
        else status = 'planned';
        drilledTotal += depth;
        holes.push({ id: hid, projectId: p.id, programmeId: id, type: holeType, easting: e0 + r.int(-1800, 1800), northing: n0 + r.int(-2400, 2400), rl: r.int(240, 620) + r.int(0, 9) / 10, azimuth: (r.pick([0, 45, 90, 135, 180, 225, 270, 315]) + r.int(-4, 4) + 360) % 360, dip: -r.int(50, 75), plannedDepth: planned, depth, status, startedOn: status === 'planned' ? undefined : started, completedOn: ['planned', 'drilling'].includes(status) ? undefined : completed, rigId: plan.rigId, loggerId: status === 'planned' ? undefined : r.pick(FIELD_STAFF.filter((f) => f.role === 'Field geologist')).id });
      }
      prg.metresDrilled = drilledTotal;
    }
  }

  // ---- samples, batches, intercepts
  const labFor = (p: Project) => (p.country === 'Canada' ? (p.commodity === 'K' ? 'lab-prairie' : 'lab-norlab') : p.country === 'Australia' ? 'lab-geostat' : p.country === 'Chile' || p.country === 'Argentina' ? 'lab-pacan' : p.country === 'United States' ? 'lab-norlab' : 'lab-fenno');
  let sampleSeq = 100000;
  for (const p of projects) {
    const cdef = COMMODITY[p.commodity];
    const pHoles = holes.filter((h) => h.projectId === p.id && ['sampled', 'assayed', 'logged'].includes(h.status));
    // group holes into batches of 2–4
    const groups: Drillhole[][] = [];
    let gi = 0;
    while (gi < pHoles.length) { const n = r.int(1, 3); groups.push(pHoles.slice(gi, gi + n)); gi += n; }
    for (const g of groups) {
      if (g.length === 0) continue;
      const anyLogged = g.some((h) => h.status === 'logged');
      const allAssayed = g.every((h) => h.status === 'assayed');
      const submitted = addDays(g[g.length - 1].completedOn!, r.int(4, 12));
      const lab = LABS.find((l) => l.id === labFor(p))!;
      let status: BatchStatus = anyLogged ? 'submitted' : allAssayed ? 'accepted' : r.pick(['in-prep', 'analysing', 'received']);
      const bid = nextBatch();
      const failures: SampleBatch['failures'] = [];
      let count = 0, standards = 0, blanks = 0, duplicates = 0;
      const interval = p.commodity === 'K' ? 0.5 : g[0].type === 'RC' ? 1 : 2;
      const received = ['received', 'accepted', 'qaqc-hold'].includes(status) ? addDays(submitted, lab.turnaroundDays + r.int(-4, 9)) : undefined;
      for (const h of g) {
        const start = p.commodity === 'K' ? Math.max(0, h.depth - 140) : 0;
        // mineralised zones
        const zones: [number, number][] = [];
        const nz = p.commodity === 'Cu' ? r.int(1, 2) : r.int(0, 3);
        const zl: [number, number] = p.commodity === 'Cu' ? [40, 160] : p.commodity === 'K' ? [2, 12] : [3, 28];
        for (let z = 0; z < nz; z++) { const f = r.float(start + 20, Math.max(start + 40, h.depth - 30)); zones.push([f, f + r.float(...zl)]); }
        const prgPhase = programmes.find((x) => x.id === h.programmeId)!.phase;
        const selective = prgPhase === 'complete';
        let d = start;
        const gradesForIntercept: { from: number; to: number; grade: number }[] = [];
        while (d < h.depth) {
          const to = Math.min(h.depth, d + interval);
          const mid = (d + to) / 2;
          const inZone = zones.some(([a, b]) => mid >= a && mid <= b);
          if (selective && !zones.some(([a, b]) => mid >= a - 8 && mid <= b + 8)) { d = to; continue; }
          const grade = received ? (inZone ? r.grade(cdef.gradeRange) : r.float(...cdef.background)) : null;
          const sid = `${pad(sampleSeq++, 6)}`;
          samples.push({ id: sid, batchId: bid, holeId: h.id, from: Math.round(d * 100) / 100, to: Math.round(to * 100) / 100, type: h.type === 'RC' ? 'chip' : 'core', grade: grade === null ? null : Math.round(grade * 1000) / 1000, secondary: received ? secondaryFor(r, p.commodity, grade!) : {} });
          count++;
          if (grade !== null) gradesForIntercept.push({ from: d, to, grade });
          // QAQC insertions
          if (count % 20 === 0) {
            const kind = r.pick(['standard', 'blank', 'duplicate'] as const);
            const qid = `${pad(sampleSeq++, 6)}`;
            let qgrade: number | null = null;
            let flag: string | undefined;
            if (received) {
              if (kind === 'standard') { qgrade = cdef.gradeRange[0] * 2 * r.float(0.93, 1.07); standards++; if (r.chance(0.02)) { flag = 'Outside 3σ'; failures.push({ sampleId: qid, kind, detail: `Standard ${r.pick(['OREAS 214', 'OREAS 252', 'CDN-GS-3E', 'OREAS 750', 'OREAS 903'])} returned ${qgrade.toFixed(2)} ${cdef.gradeUnit}, outside ±3σ of the certified value.` }); } }
              else if (kind === 'blank') { qgrade = r.float(...cdef.background) * 0.4; blanks++; if (r.chance(0.015)) { qgrade = cdef.background[1] * 8; flag = 'Blank above threshold'; failures.push({ sampleId: qid, kind, detail: `Coarse blank returned ${qgrade.toFixed(3)} ${cdef.gradeUnit}, more than ${SETTINGS.qaqc.blankMaxMultiple}× detection.` }); } }
              else { qgrade = grade! * r.float(0.85, 1.15); duplicates++; if (r.chance(0.03) && grade! > cdef.cutoff) { qgrade = grade! * 1.45; flag = 'Duplicate HARD > 20%'; failures.push({ sampleId: qid, kind, detail: `Field duplicate of ${sid} differs by ${Math.round(Math.abs(qgrade - grade!) / ((qgrade + grade!) / 2) * 100)}% (HARD), above ${SETTINGS.qaqc.duplicateHardPct}%.` }); } }
            } else { if (kind === 'standard') standards++; else if (kind === 'blank') blanks++; else duplicates++; }
            samples.push({ id: qid, batchId: bid, holeId: h.id, from: Math.round(d * 100) / 100, to: Math.round(to * 100) / 100, type: kind, grade: qgrade === null ? null : Math.round(qgrade * 1000) / 1000, secondary: {}, flag });
          }
          d = to;
        }
        // intercepts (simple: runs of consecutive samples above cutoff, allowing 1 sample internal dilution)
        if (received) {
          let run: typeof gradesForIntercept = [];
          let gap = 0;
          const flush = () => {
            if (run.length >= 2) {
              const len = run[run.length - 1].to - run[0].from;
              const gl = run.reduce((s, x) => s + x.grade * (x.to - x.from), 0) / len;
              if (gl >= cdef.cutoff) {
                const sig = len >= (p.commodity === 'K' ? 2 : 4) && gl >= cdef.cutoff * 1.5;
                intercepts.push({ id: `INT-${h.id}-${intercepts.length + 1}`, holeId: h.id, projectId: p.id, from: Math.round(run[0].from * 10) / 10, to: Math.round(run[run.length - 1].to * 10) / 10, length: Math.round(len * 10) / 10, grade: Math.round(gl * 100) / 100, cutoff: cdef.cutoff, significant: sig });
              }
            }
            run = []; gap = 0;
          };
          for (const s of gradesForIntercept) {
            if (s.grade >= cdef.cutoff) { run.push(s); gap = 0; }
            else if (run.length && gap < 1) { run.push(s); gap++; }
            else flush();
          }
          flush();
          const best = intercepts.filter((x) => x.holeId === h.id).sort((a, b) => b.grade * b.length - a.grade * a.length)[0];
          if (best) h.bestIntercept = `${best.length} m @ ${best.grade} ${cdef.gradeUnit} ${cdef.gradeLabel} from ${best.from} m`;
        }
      }
      if (status === 'accepted' && (failures.length >= 2 || (failures.some((f) => f.kind === 'standard') && r.chance(0.7)))) status = 'qaqc-hold';
      batches.push({ id: bid, projectId: p.id, labId: lab.id, holeIds: g.map((h) => h.id), submittedOn: submitted, receivedOn: received, status, method: cdef.method, sampleCount: count + standards + blanks + duplicates, standards, blanks, duplicates, failures, dispatchNo: `DSP-${p.id.slice(4)}-${pad(r.int(1, 99), 3)}` });
    }
  }
  // Kettle Lake's newest batch is the one on hold that the brief mentions
  const klBatch = batches.filter((b) => b.projectId === 'PRJ-0409').sort((a, b) => (b.submittedOn > a.submittedOn ? 1 : -1))[0];
  if (klBatch && klBatch.receivedOn) { klBatch.status = 'qaqc-hold'; if (!klBatch.failures.length) klBatch.failures.push({ sampleId: samples.find((s) => s.batchId === klBatch.id && s.type === 'standard')?.id ?? '—', kind: 'standard', detail: 'Standard OREAS 903 returned 0.18 % Ni against a certified 0.31 % Ni, outside ±3σ.' }); }

  // ---- resource estimates
  const estimates: ResourceEstimate[] = [];
  const mkBlocks = (c: CommodityCode, scale: number, hasMeasured: boolean): CategoryBlock[] => {
    const cdef = COMMODITY[c];
    const mid = (cdef.gradeRange[0] + cdef.gradeRange[1]) / 2;
    const blocks: CategoryBlock[] = [];
    if (hasMeasured) blocks.push({ category: 'measured', tonnes: +(scale * 0.22).toFixed(2), grade: +(mid * 1.08).toFixed(2), contained: 0 });
    blocks.push({ category: 'indicated', tonnes: +(scale * (hasMeasured ? 0.41 : 0.35)).toFixed(2), grade: +(mid * 0.98).toFixed(2), contained: 0 });
    blocks.push({ category: 'inferred', tonnes: +(scale * (hasMeasured ? 0.37 : 0.65)).toFixed(2), grade: +(mid * 0.86).toFixed(2), contained: 0 });
    for (const b of blocks) b.contained = Math.round(cdef.contained(b.tonnes, b.grade));
    return blocks;
  };
  const est = (id: string, projectId: string, asOf: string, status: ResourceEstimate['status'], scale: number, measured: boolean, authorId: string, reviewerId: string | undefined, notes: string) => {
    const p = projects.find((x) => x.id === projectId)!;
    const blocks = mkBlocks(p.commodity, scale, measured);
    const total = blocks.reduce((s, b) => s + b.contained, 0);
    estimates.push({ id, projectId, asOf, status, method: p.commodity === 'K' ? 'Polygonal, bed-thickness weighted' : r.pick(['Ordinary kriging', 'Inverse distance squared', 'Ordinary kriging with top-cut']), cutoff: SETTINGS.cutoffs[p.commodity], authorId, reviewerId, blocks, p10: Math.round(total * 0.68), p50: Math.round(total * 1.0), p90: Math.round(total * 1.41), notes });
  };
  est('RES-2026-03', 'PRJ-0387', '2026-08-31', 'qp-review', 38.5, false, 'u-kholloway', 'u-twierzbicki', 'Maiden estimate. Top-cut 12 g/t Au applied to the Upper Silty unit; 25 m infill supports Indicated over the central 600 m.');
  est('RES-2025-02', 'PRJ-0387', '2025-09-30', 'superseded', 27.0, false, 'u-kholloway', 'u-twierzbicki', 'Exploration target range only; superseded by RES-2026-03.');
  est('RES-2026-01', 'PRJ-0376', '2026-02-28', 'released', 412.0, true, 'u-rnakamura', 'u-twierzbicki', 'Supergene blanket and hypogene zone reported separately in the technical report. Mo credit excluded from the headline grade.');
  est('RES-2026-05', 'PRJ-0376', '2026-09-15', 'draft', 468.0, true, 'u-kholloway', undefined, 'Resource update incorporating the north-east extension drilling. Draft; awaiting the final six holes of PRG-2026-019.');
  est('RES-2026-02', 'PRJ-0421', '2026-05-31', 'released', 186.0, false, 'u-twierzbicki', 'u-kholloway', 'Sylvinite beds PL-1 to PL-3 above 18 % KCl over a minimum 2.4 m thickness. Solution-mining recoverable factor not applied.');
  est('RES-2026-04', 'PRJ-0412', '2026-06-30', 'released', 6.2, false, 'u-twierzbicki', 'u-kholloway', 'Main Zone to 350 m vertical. Inferred only below 250 m; Phase 3 drilling targets an upgrade.');
  est('RES-2025-04', 'PRJ-0362', '2025-11-30', 'released', 640.0, true, 'u-rnakamura', 'u-twierzbicki', 'Brine resource on a lithium-carbonate-equivalent basis, drainable porosity method. Transferred with the project.');
  est('RES-2026-06', 'PRJ-0398', '2026-08-15', 'internal-review', 22.4, false, 'u-twierzbicki', 'u-praghunathan', 'Swarm A only. Swarm B to be added after Phase 2.');

  // ---- other approvals: stage gates, variances, land access, tenement renewals, resource release, purchase orders
  approvals.push(mkApproval({ type: 'stage-gate', title: 'Stage-gate decision: Sable Dome, end of target testing', projectId: 'PRJ-0433', subjectType: 'project', subjectId: 'PRJ-0433', requestedById: 'u-kholloway', submittedOn: addDays(TODAY, -16), status: 'pending', summary: 'Phase 2 RC returned 14 intercepts above cut-off, best 6 m @ 1.9 g/t Au. None exceed the 3 g·m threshold over 40 m of strike. Recommendation: relinquish the southern blocks, retain the northern licence for one further season.', progress: 2, due: addDays(TODAY, 9) }));
  approvals.push(mkApproval({ type: 'stage-gate', title: 'Stage-gate decision: Lorimer, scoping to pre-feasibility', projectId: 'PRJ-0421', subjectType: 'project', subjectId: 'PRJ-0421', requestedById: 'u-twierzbicki', submittedOn: addDays(TODAY, -4), status: 'pending', summary: 'Scoping study indicates a 2.1 Mtpa solution-mining case. Recommendation: advance to pre-feasibility, subject to the cavern-modelling results due 2026-10-30.', progress: 0, due: addDays(TODAY, 21) }));
  approvals.push(mkApproval({ type: 'stage-gate', title: 'Stage-gate decision: Marrow Gulch', projectId: 'PRJ-0351', subjectType: 'project', subjectId: 'PRJ-0351', requestedById: 'u-kholloway', submittedOn: '2025-11-20', status: 'approved', summary: 'Phase 2 failed to extend the discovery vein. Decision: relinquish.', progress: 3 }));
  approvals.push(mkApproval({ type: 'stage-gate', title: 'Stage-gate decision: Pinnacle Salar, advance to PFS', projectId: 'PRJ-0362', subjectType: 'project', subjectId: 'PRJ-0362', requestedById: 'u-rnakamura', submittedOn: '2026-03-30', status: 'approved', summary: 'Pump tests confirm sustained brine grade. Decision: advance to pre-feasibility and transfer to the development group.', progress: 3 }));
  approvals.push(mkApproval({ type: 'budget-variance', title: 'Budget variance: Phase 2 diamond drilling, Mount Aster', projectId: 'PRJ-0398', subjectType: 'programme', subjectId: programmes.find((x) => x.projectId === 'PRJ-0398' && x.phase === 'in-progress' && x.type === 'drilling')!.id, requestedById: 'u-twierzbicki', submittedOn: addDays(TODAY, -6), status: 'pending', amount: 286000, summary: 'Forecast overrun of 13.6 % against the approved 2,100,000: two lost-circulation holes re-drilled, and helicopter support extended by nine days after the float-plane season closed early.', progress: 1, due: addDays(TODAY, -1) }));
  approvals.push(mkApproval({ type: 'budget-variance', title: 'Budget variance: Resource extension drilling, Cerro Azufre', projectId: 'PRJ-0376', subjectType: 'programme', subjectId: programmes.find((x) => x.projectId === 'PRJ-0376' && x.phase === 'demobilising')!.id, requestedById: 'u-kholloway', submittedOn: addDays(TODAY, -31), status: 'approved', amount: 190000, summary: 'Overrun of 7.8 %: additional geotechnical logging at the client\'s request.', progress: 2 }));
  approvals.push(mkApproval({ type: 'land-access', title: 'Land access agreement: Orrin Creek', projectId: 'PRJ-0390', subjectType: 'project', subjectId: 'PRJ-0390', requestedById: 'u-hferrier', submittedOn: addDays(TODAY, -48), status: 'returned', summary: 'Draft access agreement with the title-holders for the 2027 mapping season. Returned by the manager for a revised compensation schedule.', progress: 1 }));
  approvals.push(mkApproval({ type: 'land-access', title: 'Land access agreement: Copper Hollow, scout drilling', projectId: 'PRJ-0441', subjectType: 'project', subjectId: 'PRJ-0441', requestedById: 'u-hferrier', submittedOn: addDays(TODAY, -9), status: 'pending', summary: 'Grazing-lease access for eight scout RC holes and the access track.', progress: 0 }));
  approvals.push(mkApproval({ type: 'permit', title: 'Work permit: Copper Hollow scout RC', projectId: 'PRJ-0441', subjectType: 'programme', subjectId: programmes.find((x) => x.projectId === 'PRJ-0441' && x.type === 'drilling')!.id, requestedById: 'u-hferrier', submittedOn: addDays(TODAY, -22), status: 'pending', summary: 'Notice of intent lodged with the state regulator; bonding calculation attached.', progress: 1 }));
  approvals.push(mkApproval({ type: 'tenement-renewal', title: `Tenement renewal: ${tenements.filter((t) => t.projectId === 'PRJ-0455')[0].id}, Tarrant Hills`, projectId: 'PRJ-0455', subjectType: 'tenement', subjectId: tenements.filter((t) => t.projectId === 'PRJ-0455')[0].id, requestedById: 'u-hferrier', submittedOn: addDays(TODAY, -13), status: 'pending', summary: 'Renewal for a further five years. Expenditure condition met at 118 %.', progress: 1 }));
  approvals.push(mkApproval({ type: 'tenement-renewal', title: `Tenement renewal: ${tenements.filter((t) => t.projectId === 'PRJ-0409')[0].id}, Kettle Lake`, projectId: 'PRJ-0409', subjectType: 'tenement', subjectId: tenements.filter((t) => t.projectId === 'PRJ-0409')[0].id, requestedById: 'u-hferrier', submittedOn: addDays(TODAY, -2), status: 'pending', summary: 'Claim cells expire in 34 days. Assessment work to be filed against Phase 2 drilling.', progress: 0 }));
  approvals.push(mkApproval({ type: 'resource-release', title: 'Resource release: RES-2026-03, Bellamy Ridge maiden estimate', projectId: 'PRJ-0387', subjectType: 'estimate', subjectId: 'RES-2026-03', requestedById: 'u-kholloway', submittedOn: addDays(TODAY, -19), status: 'pending', summary: 'Maiden Indicated and Inferred estimate. Database sign-off complete; QP review in progress.', progress: 1 }));
  approvals.push(mkApproval({ type: 'resource-release', title: 'Resource release: RES-2026-01, Cerro Azufre', projectId: 'PRJ-0376', subjectType: 'estimate', subjectId: 'RES-2026-01', requestedById: 'u-rnakamura', submittedOn: '2026-02-02', status: 'approved', summary: 'Release of the February 2026 estimate.', progress: 3 }));
  approvals.push(mkApproval({ type: 'purchase-order', title: 'Purchase order: helicopter support extension, Mount Aster', projectId: 'PRJ-0398', subjectType: 'purchase', subjectId: 'PO-26-01188', requestedById: 'u-dsorensen', submittedOn: addDays(TODAY, -3), status: 'pending', amount: 74500, summary: 'Nine additional days of A-Star support, Aster Lake camp, 2026-09-24 to 2026-10-02.', progress: 1 }));
  approvals.push(mkApproval({ type: 'purchase-order', title: 'Purchase order: core trays and sample bags, Wolverine Creek', projectId: 'PRJ-0412', subjectType: 'purchase', subjectId: 'PO-26-01172', requestedById: 'u-dsorensen', submittedOn: addDays(TODAY, -11), status: 'approved', amount: 8420, summary: '1,200 core trays and 5,000 calico bags.', progress: 2 }));
  approvals.push(mkApproval({ type: 'purchase-order', title: 'Purchase order: satellite communications, Kettle Lake', projectId: 'PRJ-0409', subjectType: 'purchase', subjectId: 'PO-26-01151', requestedById: 'u-dsorensen', submittedOn: addDays(TODAY, -24), status: 'rejected', amount: 31200, summary: 'Second VSAT terminal for the camp. Rejected: existing terminal capacity sufficient; revisit if the camp expands.', progress: 1 }));

  // ---- optimiser targets
  const targets: OptimiserTarget[] = [
    { id: 'T-01', projectId: 'PRJ-0412', name: 'Main Zone below 450 m, sections 12–16', holes: 6, metres: 3600, cost: 720000, rigDays: 54, pSuccess: 0.62, expectedValue: 4100000, earliest: '2027-01-11', locked: false },
    { id: 'T-02', projectId: 'PRJ-0412', name: 'Hinge Zone, second lens', holes: 4, metres: 1800, cost: 380000, rigDays: 28, pSuccess: 0.35, expectedValue: 5200000, earliest: '2027-02-01', locked: false },
    { id: 'T-03', projectId: 'PRJ-0455', name: 'Targets T1–T3 (eastern swarm)', holes: 18, metres: 2700, cost: 360000, rigDays: 24, pSuccess: 0.48, expectedValue: 2900000, earliest: '2027-03-15', locked: false },
    { id: 'T-04', projectId: 'PRJ-0455', name: 'Targets T4–T6 (central swarm)', holes: 14, metres: 2100, cost: 290000, rigDays: 19, pSuccess: 0.31, expectedValue: 2400000, earliest: '2027-04-01', locked: false },
    { id: 'T-05', projectId: 'PRJ-0398', name: 'Swarm C first test', holes: 8, metres: 2400, cost: 640000, rigDays: 40, pSuccess: 0.44, expectedValue: 6800000, earliest: '2027-01-20', locked: false },
    { id: 'T-06', projectId: 'PRJ-0398', name: 'Swarm B infill to 50 m', holes: 12, metres: 3000, cost: 780000, rigDays: 48, pSuccess: 0.81, expectedValue: 3600000, earliest: '2027-01-20', locked: false },
    { id: 'T-07', projectId: 'PRJ-0468', name: 'Stratigraphic hole DF-01', holes: 1, metres: 1300, cost: 1400000, rigDays: 38, pSuccess: 0.55, expectedValue: 9500000, earliest: '2027-01-18', locked: true },
    { id: 'T-08', projectId: 'PRJ-0441', name: 'Anomaly A scout holes', holes: 4, metres: 1200, cost: 270000, rigDays: 16, pSuccess: 0.22, expectedValue: 8100000, earliest: '2026-11-30', locked: false },
    { id: 'T-09', projectId: 'PRJ-0441', name: 'Anomaly B scout holes', holes: 4, metres: 1200, cost: 270000, rigDays: 16, pSuccess: 0.18, expectedValue: 8100000, earliest: '2026-12-15', locked: false },
    { id: 'T-10', projectId: 'PRJ-0409', name: 'Conductor C4 (untested)', holes: 3, metres: 1500, cost: 460000, rigDays: 30, pSuccess: 0.29, expectedValue: 7400000, earliest: '2027-02-08', locked: false },
    { id: 'T-11', projectId: 'PRJ-0409', name: 'Down-plunge of KL-DDH-009', holes: 2, metres: 1100, cost: 340000, rigDays: 22, pSuccess: 0.51, expectedValue: 2800000, earliest: '2027-02-08', locked: false },
    { id: 'T-12', projectId: 'PRJ-0376', name: 'Hypogene infill, north block', holes: 10, metres: 5000, cost: 1250000, rigDays: 70, pSuccess: 0.86, expectedValue: 5900000, earliest: '2027-03-01', locked: false },
    { id: 'T-13', projectId: 'PRJ-0387', name: 'Southern extension, sections 40–44', holes: 12, metres: 2400, cost: 310000, rigDays: 20, pSuccess: 0.46, expectedValue: 2100000, earliest: '2027-02-15', locked: false },
    { id: 'T-14', projectId: 'PRJ-0463', name: 'Contact zone reconnaissance holes', holes: 3, metres: 900, cost: 410000, rigDays: 26, pSuccess: 0.15, expectedValue: 6200000, earliest: '2027-08-01', locked: false },
  ];

  // ---- comments
  const comments: Comment[] = [
    { id: 'c-001', entityType: 'project', entityId: 'PRJ-0412', authorId: 'u-twierzbicki', body: 'WC-DDH-036 hit the vein 40 m deeper than the section predicted. Re-cutting sections 14–16 before we collar 038.', createdAt: addDays(TODAY, -2) + 'T15:40:00Z' },
    { id: 'c-002', entityType: 'project', entityId: 'PRJ-0412', authorId: 'u-mokonkwo', body: 'Noted. Keep 054 on the plan unless the re-cut moves the target by more than 25 m.', createdAt: addDays(TODAY, -2) + 'T18:12:00Z' },
    { id: 'c-003', entityType: 'project', entityId: 'PRJ-0409', authorId: 'u-praghunathan', body: 'Batch on QAQC hold: OREAS 903 failed low. Asked the lab to re-run the standard and the ten samples either side.', createdAt: addDays(TODAY, -1) + 'T03:05:00Z' },
    { id: 'c-004', entityType: 'approval', entityId: approvals.find((a) => a.type === 'budget-variance' && a.status === 'pending')!.id, authorId: 'u-ymbeki', body: 'The helicopter extension is already on a separate PO. Does the variance double-count it?', createdAt: addDays(TODAY, -3) + 'T21:30:00Z' },
    { id: 'c-005', entityType: 'approval', entityId: approvals.find((a) => a.type === 'budget-variance' && a.status === 'pending')!.id, authorId: 'u-twierzbicki', body: 'No, the PO covers days 1–9 from the 24th; the variance covers the re-drills and the days already flown.', createdAt: addDays(TODAY, -3) + 'T22:14:00Z' },
    { id: 'c-006', entityType: 'project', entityId: 'PRJ-0433', authorId: 'u-kholloway', body: 'Gate pack uploaded. The northern licence is worth one more season on the IP anomaly; the southern blocks are not.', createdAt: addDays(TODAY, -16) + 'T08:20:00Z' },
    { id: 'c-007', entityType: 'programme', entityId: programmes.find((x) => x.projectId === 'PRJ-0398' && x.phase === 'in-progress' && x.type === 'drilling')!.id, authorId: 'u-dsorensen', body: 'Float-plane season closed 2026-09-12. Crew changes are by helicopter until the winter road opens.', createdAt: addDays(TODAY, -8) + 'T14:00:00Z' },
    { id: 'c-008', entityType: 'project', entityId: 'PRJ-0376', authorId: 'u-mokonkwo', body: 'Project geologist vacancy: Kieran is covering the resource update remotely until the role is filled.', createdAt: addDays(TODAY, -40) + 'T16:45:00Z' },
    { id: 'c-009', entityType: 'project', entityId: 'PRJ-0390', authorId: 'u-hferrier', body: 'Revised compensation schedule sent to the title-holders 2026-09-10. No reply yet.', createdAt: addDays(TODAY, -11) + 'T05:10:00Z' },
  ];

  // ---- notifications (per user)
  const notifications: Notification[] = [];
  let nSeq = 1;
  const notify = (userId: string, kind: Notification['kind'], title: string, body: string, href: string, daysAgo: number, read = false) => notifications.push({ id: `n-${pad(nSeq++, 4)}`, userId, kind, title, body, href, createdAt: addDays(TODAY, -daysAgo) + `T${pad(r.int(6, 20), 2)}:${pad(r.int(0, 59), 2)}:00Z`, read });
  const pendingFor = (rc: string) => approvals.filter((a) => a.status === 'pending' && a.steps[a.currentStep].roleCode === rc);
  for (const u of USERS.filter((x) => x.active)) {
    for (const a of pendingFor(u.roleCode)) notify(u.id, 'approval', `Awaiting your ${a.steps[a.currentStep].name.toLowerCase()}`, a.title, `/approvals/${a.id}`, Math.max(0, daysBetween(a.submittedOn, TODAY) - 1), r.chance(0.3));
  }
  notify('u-praghunathan', 'assay', 'Batch received', `${batches.find((b) => b.status === 'received')?.id ?? 'LAB-26-04412'} received from the laboratory; 3 QAQC checks outstanding.`, `/assays`, 1);
  notify('u-praghunathan', 'assay', 'QAQC hold', `${klBatch?.id} placed on hold: standard failure.`, `/assays/${klBatch?.id}`, 1);
  notify('u-twierzbicki', 'assay', 'QAQC hold', `${klBatch?.id} (Kettle Lake) placed on hold: standard failure.`, `/assays/${klBatch?.id}`, 1);
  notify('u-hferrier', 'tenure', 'Tenement expiring in 19 days', `${tenements.filter((t) => t.projectId === 'PRJ-0376')[0].id}, Cerro Azufre. No renewal lodged.`, `/projects/PRJ-0376/tenure`, 0);
  notify('u-hferrier', 'tenure', 'Tenement expiring in 34 days', `${tenements.filter((t) => t.projectId === 'PRJ-0409')[0].id}, Kettle Lake. Renewal in workflow.`, `/projects/PRJ-0409/tenure`, 2, true);
  notify('u-mokonkwo', 'tenure', 'Tenement expiring in 19 days', `${tenements.filter((t) => t.projectId === 'PRJ-0376')[0].id}, Cerro Azufre. No renewal lodged.`, `/projects/PRJ-0376/tenure`, 0);
  notify('u-mokonkwo', 'budget', 'Programme forecast over budget', 'Phase 2 diamond drilling, Mount Aster: forecast 113.6 % of approved.', `/programmes/${programmes.find((x) => x.projectId === 'PRJ-0398' && x.phase === 'in-progress' && x.type === 'drilling')!.id}`, 6, true);
  notify('u-mokonkwo', 'mention', 'Tomasz Wierzbicki commented on Wolverine Creek', 'WC-DDH-036 hit the vein 40 m deeper than the section predicted…', `/projects/PRJ-0412`, 2, true);
  notify('u-dsorensen', 'programme', 'Crew change due', 'Wolverine Creek: rotation ends 2026-09-24 for 3 crew; charter booked.', `/programmes/${programmes.find((x) => x.projectId === 'PRJ-0412' && x.phase === 'in-progress')!.id}`, 1);
  notify('u-dsorensen', 'programme', 'Rig RIG-31 demobilising', 'Cerro Azufre resource extension drilling: demobilisation started 2026-08-29.', `/programmes/${programmes.find((x) => x.projectId === 'PRJ-0376' && x.phase === 'demobilising')!.id}`, 23, true);
  notify('u-ymbeki', 'budget', 'Variance request overdue', 'Phase 2 diamond drilling, Mount Aster: finance review was due yesterday.', `/approvals/${approvals.find((a) => a.type === 'budget-variance' && a.status === 'pending')!.id}`, 0);
  notify('u-abarrientos', 'system', 'Scheduled maintenance', 'ADIT 7.4.2 patch window: Saturday 2026-09-26, 02:00–04:00 UTC.', `/admin/system`, 3, true);
  notify('u-abarrientos', 'system', 'Inactive account', 'Rina Nakamura has not signed in for 83 days. Deactivation policy applies at 90.', `/admin/users`, 1);
  for (const u of USERS.filter((x) => x.active)) notify(u.id, 'system', 'Release 7.4 installed', 'See the User Manual for what changed in this release.', `/manual`, 12, true);

  // ---- audit
  const audit: AuditEntry[] = [];
  let aSeq = 1;
  const log = (daysAgo: number, userId: string, action: string, entityType: string, entityId: string, detail: string) => audit.push({ id: `a-${pad(aSeq++, 5)}`, at: addDays(TODAY, -daysAgo) + `T${pad(r.int(0, 23), 2)}:${pad(r.int(0, 59), 2)}:${pad(r.int(0, 59), 2)}Z`, userId, action, entityType, entityId, detail });
  for (const a of approvals) for (const s of a.steps) if (s.decision && s.on) log(Math.max(0, daysBetween(s.on, TODAY)), s.actorId!, `approval.${s.decision}`, 'approval', a.id, `${s.name}: ${s.decision}`);
  for (const b of batches) { log(daysBetween(b.submittedOn, TODAY), 'u-praghunathan', 'batch.submitted', 'batch', b.id, `${b.sampleCount} samples to ${LABS.find((l) => l.id === b.labId)!.name}`); if (b.receivedOn) log(daysBetween(b.receivedOn, TODAY), 'u-praghunathan', 'batch.received', 'batch', b.id, `Results imported, ${b.failures.length} QAQC failure(s)`); }
  for (const e of estimates) log(daysBetween(e.asOf, TODAY), e.authorId, 'estimate.saved', 'estimate', e.id, `${e.status}`);
  log(0, 'u-abarrientos', 'settings.updated', 'settings', 'qaqc', 'duplicateHardPct 25 → 20');
  log(1, 'u-abarrientos', 'user.deactivated', 'user', 'u-rnakamura', 'Left the company 2026-06-30');
  log(5, 'u-mokonkwo', 'project.watch', 'project', 'PRJ-0433', 'Added to watch list');
  log(12, 'u-abarrientos', 'system.upgrade', 'system', 'ADIT', 'Release 7.4.0 installed');
  for (const c of comments) log(daysBetween(c.createdAt.slice(0, 10), TODAY), c.authorId, 'comment.added', c.entityType, c.entityId, c.body.slice(0, 60));
  audit.sort((a, b) => (a.at < b.at ? 1 : -1));
  notifications.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return { asOf: AS_OF, fiscalYear: 'FY2026', commodities: COMMODITIES, users: USERS, roles: ROLES, projects, tenements, programmes, holes, batches, samples, intercepts, estimates, approvals, comments, notifications, audit, rigs, camps, labs: LABS, costCodes: COST_CODES, settings: SETTINGS, workflows: WORKFLOWS, targets, scenarios: [] };
}

function secondaryFor(r: Rng, c: CommodityCode, grade: number): Record<string, number> {
  const rd = (x: number, d = 3) => Math.round(x * 10 ** d) / 10 ** d;
  switch (c) {
    case 'Au': return { 'Ag g/t': rd(grade * r.float(0.5, 4), 2), 'As ppm': rd(r.float(5, 900), 0), 'S %': rd(r.float(0.1, 3.2), 2) };
    case 'Li': return { 'Ta₂O₅ ppm': rd(r.float(20, 260), 0), 'Cs₂O %': rd(r.float(0.01, 0.4), 3), 'Fe₂O₃ %': rd(r.float(0.3, 2.5), 2) };
    case 'K': return { 'NaCl %': rd(r.float(55, 78), 1), 'Insolubles %': rd(r.float(0.5, 6), 2), 'MgCl₂ %': rd(r.float(0.05, 1.2), 2) };
    case 'Cu': return { 'Mo ppm': rd(r.float(10, 420), 0), 'Au g/t': rd(grade * r.float(0.05, 0.4), 3), 'S %': rd(r.float(0.5, 4), 2) };
    case 'Ni': return { 'Cu %': rd(grade * r.float(0.2, 0.9), 3), 'Co ppm': rd(grade * r.float(150, 500), 0), 'Pt+Pd g/t': rd(grade * r.float(0.1, 0.8), 3) };
  }
}
