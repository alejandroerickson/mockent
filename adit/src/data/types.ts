// ADIT 7.4 — the tenant's record model. Every id and figure is generated from a seed in world.ts.

export type CommodityCode = 'Au' | 'Li' | 'K' | 'Cu' | 'Ni';

export interface CommodityDef {
  code: CommodityCode;
  name: string;            // Gold
  gradeLabel: string;      // Au
  gradeUnit: string;       // g/t, %
  depositStyle: string;    // orogenic vein, LCT pegmatite …
  holeTypes: HoleType[];
  cutoff: number;          // default cut-off in grade units
  gradeRange: [number, number]; // typical mineralised grade
  background: [number, number]; // barren grade
  metalUnit: string;       // oz, t LCE, t KCl, t Cu, t Ni
  price: { value: number; unit: string }; // price deck entry
  method: string;          // assay method code
  contained(tonnes: number, grade: number): number; // contained metal in metalUnit
  cat: number;             // categorical hue index
}

export type Stage = 'recon' | 'target' | 'drilling' | 'resource' | 'scoping' | 'decision';
export type ProjectStatus = 'active' | 'on-hold' | 'closed';
export type Outcome = 'advanced' | 'relinquished' | 'divested';

export interface Project {
  id: string;
  name: string;
  commodity: CommodityCode;
  jurisdiction: string;
  country: string;
  stage: Stage;
  status: ProjectStatus;
  outcome?: Outcome;
  managerId: string;
  geologistId: string;
  areaKm2: number;
  startedOn: string;
  closedOn?: string;
  budget: { planned: number; committed: number; spent: number; forecast: number };
  lat: number;
  lon: number;
  description: string;
  nextGateOn?: string;
  watch: boolean;
}

export type TenementStatus = 'current' | 'renewal-lodged' | 'expiring' | 'lapsed' | 'application';

export interface Tenement {
  id: string;
  projectId: string;
  type: string;
  holder: string;
  grantedOn: string;
  expiresOn: string;
  areaKm2: number;
  annualCommitment: number; // required expenditure
  spentToDate: number;
  rentDue: number;
  status: TenementStatus;
}

export type ProgrammeType = 'drilling' | 'geochem' | 'geophysics' | 'mapping' | 'metallurgy' | 'baseline';
export type ProgrammePhase = 'draft' | 'scoped' | 'costed' | 'approved' | 'mobilising' | 'in-progress' | 'demobilising' | 'complete' | 'cancelled';

export interface CrewAssignment {
  personId: string;
  role: string;
  from: string;
  to: string;
}

export interface LogisticsItem {
  id: string;
  kind: 'charter' | 'camp' | 'fuel' | 'permit' | 'equipment' | 'medical' | 'freight';
  description: string;
  supplier: string;
  scheduledOn: string;
  cost: number;
  status: 'requested' | 'booked' | 'confirmed' | 'delivered' | 'cancelled';
}

export interface Programme {
  id: string;
  projectId: string;
  type: ProgrammeType;
  name: string;
  phase: ProgrammePhase;
  startOn: string;
  endOn: string;
  budget: number;
  spent: number;
  metresPlanned?: number;
  metresDrilled?: number;
  holesPlanned?: number;
  rigId?: string;
  campId?: string;
  crew: CrewAssignment[];
  logistics: LogisticsItem[];
  approvalId?: string;
  objective: string;
  leadId: string;
}

export type HoleType = 'DDH' | 'RC' | 'AC' | 'Sonic';
export type HoleStatus = 'planned' | 'drilling' | 'completed' | 'abandoned' | 'logged' | 'sampled' | 'assayed';

export interface Drillhole {
  id: string;
  projectId: string;
  programmeId: string;
  type: HoleType;
  easting: number;
  northing: number;
  rl: number;
  azimuth: number;
  dip: number;
  plannedDepth: number;
  depth: number;
  status: HoleStatus;
  startedOn?: string;
  completedOn?: string;
  rigId?: string;
  loggerId?: string;
  bestIntercept?: string; // summary text
}

export type BatchStatus = 'submitted' | 'in-prep' | 'analysing' | 'received' | 'qaqc-hold' | 'accepted' | 'rejected';

export interface QaqcFailure {
  sampleId: string;
  kind: 'standard' | 'blank' | 'duplicate';
  detail: string;
}

export interface SampleBatch {
  id: string;
  projectId: string;
  labId: string;
  holeIds: string[];
  submittedOn: string;
  receivedOn?: string;
  status: BatchStatus;
  method: string;
  sampleCount: number;
  standards: number;
  blanks: number;
  duplicates: number;
  failures: QaqcFailure[];
  dispatchNo: string;
}

export type SampleType = 'core' | 'chip' | 'standard' | 'blank' | 'duplicate';

export interface Sample {
  id: string;
  batchId: string;
  holeId: string;
  from: number;
  to: number;
  type: SampleType;
  grade: number | null; // primary grade in commodity units; null until received
  secondary: Record<string, number>;
  flag?: string;
}

export interface Intercept {
  id: string;
  holeId: string;
  projectId: string;
  from: number;
  to: number;
  length: number;
  grade: number;
  cutoff: number;
  significant: boolean;
}

export type Category = 'measured' | 'indicated' | 'inferred';
export type EstimateStatus = 'draft' | 'internal-review' | 'qp-review' | 'released' | 'superseded';

export interface CategoryBlock {
  category: Category;
  tonnes: number; // Mt
  grade: number;
  contained: number; // metalUnit
}

export interface ResourceEstimate {
  id: string;
  projectId: string;
  asOf: string;
  status: EstimateStatus;
  method: string;
  cutoff: number;
  authorId: string;
  reviewerId?: string;
  blocks: CategoryBlock[];
  p10: number;
  p50: number;
  p90: number;
  notes: string;
}

export type ApprovalType = 'programme' | 'budget-variance' | 'stage-gate' | 'land-access' | 'permit' | 'resource-release' | 'tenement-renewal' | 'purchase-order';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'returned' | 'withdrawn';

export interface ApprovalStep {
  name: string;
  actorId?: string;
  roleCode: string;
  decision?: 'approved' | 'rejected' | 'returned';
  on?: string;
  note?: string;
}

export interface Approval {
  id: string;
  type: ApprovalType;
  title: string;
  projectId: string;
  subjectType: 'programme' | 'project' | 'tenement' | 'estimate' | 'purchase';
  subjectId: string;
  requestedById: string;
  submittedOn: string;
  dueOn: string;
  status: ApprovalStatus;
  amount?: number;
  steps: ApprovalStep[];
  currentStep: number;
  summary: string;
}

export interface Comment {
  id: string;
  entityType: string;
  entityId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  kind: 'approval' | 'assay' | 'tenure' | 'programme' | 'system' | 'mention' | 'budget';
  title: string;
  body: string;
  href: string;
  createdAt: string;
  read: boolean;
}

export interface AuditEntry {
  id: string;
  at: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  detail: string;
}

export interface Rig {
  id: string;
  name: string;
  contractor: string;
  type: HoleType;
  capacityM: number;
  dayRate: number;
  status: 'available' | 'assigned' | 'maintenance' | 'demobilised';
  assignedProgrammeId?: string;
  location: string;
}

export interface Camp {
  id: string;
  name: string;
  projectId: string;
  beds: number;
  occupied: number;
  access: string;
  medic: boolean;
  status: 'open' | 'closed' | 'winterised';
}

export interface Lab {
  id: string;
  name: string;
  location: string;
  accreditation: string;
  turnaroundDays: number;
  active: boolean;
}

export interface CostCode {
  code: string;
  name: string;
  category: string;
}

export interface Role {
  code: string;
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  initials: string;
  roleCode: string;
  title: string;
  email: string;
  team: string;
  location: string;
  timezone: string;
  phone: string;
  active: boolean;
  lastSignIn: string;
  prefs: UserPrefs;
}

export interface UserPrefs {
  defaultSection: string;
  defaultProjectId: string | null;
  units: 'metric' | 'imperial';
  dateFormat: 'ISO' | 'DMY' | 'MDY';
  gradeDecimals: number;
  emailDigest: 'none' | 'daily' | 'weekly';
  notify: Record<Notification['kind'], boolean>;
  rowsPerPage: 25 | 50 | 100;
  compactTables: boolean;
}

export interface PriceDeckEntry {
  commodity: CommodityCode;
  value: number;
  unit: string;
  source: string;
  asOf: string;
}

export interface SystemSettings {
  tenantName: string;
  tenantCode: string;
  fiscalYearStart: string; // MM-DD
  baseCurrency: 'USD' | 'CAD' | 'AUD';
  priceDeck: PriceDeckEntry[];
  cutoffs: Record<CommodityCode, number>;
  qaqc: { standardSigma: number; blankMaxMultiple: number; duplicateHardPct: number; minInsertionRate: number };
  units: { length: 'm'; mass: 't'; area: 'km2' | 'ha' };
  numberLocale: string;
  sessionTimeoutMin: number;
  passwordMinLength: number;
  mfaRequired: boolean;
  ssoProvider: 'none' | 'Entra ID' | 'Okta';
  auditRetentionDays: number;
  attachmentMaxMb: number;
  autoNumbering: { project: string; programme: string; batch: string; approval: string };
  gateApproverRole: string;
  varianceThresholdPct: number;
}

export interface WorkflowDef {
  type: ApprovalType;
  name: string;
  steps: { name: string; roleCode: string; sla: number }[];
  description: string;
}

export interface OptimiserTarget {
  id: string;
  projectId: string;
  name: string;
  holes: number;
  metres: number;
  cost: number;
  rigDays: number;
  pSuccess: number;      // 0–1
  expectedValue: number; // in-situ value added if successful, base currency
  earliest: string;
  locked: boolean;
}

export interface OptimiserScenario {
  id: string;
  name: string;
  createdAt: string;
  createdById: string;
  budget: number;
  rigDays: number;
  objective: 'ev' | 'metres' | 'psuccess';
  minPerCommodity: number;
  selected: string[];
  ev: number;
  cost: number;
  rigDaysUsed: number;
}

export interface World {
  asOf: string;
  fiscalYear: string;
  commodities: CommodityDef[];
  users: User[];
  roles: Role[];
  projects: Project[];
  tenements: Tenement[];
  programmes: Programme[];
  holes: Drillhole[];
  batches: SampleBatch[];
  samples: Sample[];
  intercepts: Intercept[];
  estimates: ResourceEstimate[];
  approvals: Approval[];
  comments: Comment[];
  notifications: Notification[];
  audit: AuditEntry[];
  rigs: Rig[];
  camps: Camp[];
  labs: Lab[];
  costCodes: CostCode[];
  settings: SystemSettings;
  workflows: WorkflowDef[];
  targets: OptimiserTarget[];
  scenarios: OptimiserScenario[];
}
