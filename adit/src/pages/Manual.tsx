// The User Manual: a Read surface published by the vendor. Opens in its own tab, forced to the light theme,
// with a document layout rather than the console shell, so a reader can tell they have left the application.
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Section { slug: string; n: string; title: string; body: ReactNode }

const UI = ({ children }: { children: ReactNode }) => <span className="ui">{children}</span>;

const SECTIONS: Section[] = [
  { slug: '', n: '1', title: 'About ADIT', body: (
    <>
      <p>ADIT is the Exploration Management System from Brannock Geosystems. It holds the complete record of a mineral exploration portfolio: the projects and the tenure under them, the field programmes that test them, every drillhole, sample and assay result, the resource estimates built on those results, the budgets that pay for them, and the approvals and stage-gate decisions that move a project forward or close it.</p>
      <p>This manual describes release 7.4. It is written for trained users: geologists, database staff, logistics coordinators, finance and tenure officers, and administrators. It explains what each page shows and how the common jobs are done. It does not teach exploration geology or your company's own procedures, which sit on top of the application.</p>
      <h3>One record chain</h3>
      <p>Everything in ADIT hangs off one chain of records. A <b>project</b> holds <b>tenements</b> and <b>programmes</b>. A drilling programme holds <b>drillholes</b>. Holes are sampled into <b>batches</b> that go to a laboratory and come back with grades. Grades above cut-off make <b>intercepts</b>. Intercepts support a <b>resource estimate</b>, which a <b>price deck</b> turns into a value. Along the way, <b>approvals</b> gate the spending and a <b>stage-gate decision</b> ends each stage. Every figure on a screen can be traced back down this chain; that is the point of the system.</p>
      <h3>Support</h3>
      <p>Brannock Geosystems support is available on <code>support@brannockgeo.example</code> and <code>+1 800 555 0199</code>, 06:00 to 18:00 Pacific on business days. Quote your tenant code (shown on the System settings page) and the record id you are looking at. Changes to workflow definitions and auto-numbering rules are made by support under a change request.</p>
      <div className="note"><b>Demonstration tenant.</b> A tenant marked <code>DEMO</code> in the top bar holds synthetic data for training and evaluation. Nothing in it is real, and it can be reset from System settings.</div>
    </>) },
  { slug: 'getting-started', n: '2', title: 'Getting started', body: (
    <>
      <h3>Signing in</h3>
      <p>ADIT signs you in through your company's identity provider. Your role is assigned by a system administrator and decides which sections you can act in. Your name and role are shown in the account menu at the top right. In a demonstration tenant the account menu also lets you switch between the tenant's users, so a trainer can show each role's view.</p>
      <h3>The layout</h3>
      <ul>
        <li><b>Top bar.</b> The ADIT mark, the environment chip, the sections (Portfolio, Projects, Programmes, Drilling, Assays, Resources, Approvals, Optimiser, Admin), then search, notifications, help, your account and the theme switch.</li>
        <li><b>In this section.</b> The column on the left lists the shapes and cuts of the section you are in: which subset of records, grouped how. Counts beside each entry are live. On a narrow screen this column folds into a band under the top bar.</li>
        <li><b>The page.</b> A page head with the record's name and id, then panels. Figures are set in a monospaced face so columns line up; the unit sits beside the number in ordinary type.</li>
        <li><b>Tabs.</b> A record with several aspects (a project, a programme) has tabs under its head. The address changes with the tab, so a tab can be bookmarked.</li>
      </ul>
      <h3>Search</h3>
      <p>The search box at the top right matches any part of an id (project, programme, hole, batch, request, estimate, tenement) and any word of a name. Press <kbd>Enter</kbd> to open the results page. Sample numbers are matched when you type at least five digits.</p>
      <h3>Notifications</h3>
      <p>The bell shows how many notifications you have not read. Open it to see the latest twelve; each links to the record it is about. <UI>Mark all read</UI> clears the count. <UI>All notifications</UI> opens the full list. Which kinds reach you is set under <UI>Notification settings</UI> in your account (section 12).</p>
      <h3>Tables</h3>
      <p>Column headings with a sort icon sort the table; a second click reverses the order. Long tables are paged; the page size is a preference. Wide tables scroll sideways inside their panel and keep the first column in view. A dash in a cell means the value does not exist for that row, not that it is zero.</p>
      <h3>Charts</h3>
      <p>Every chart carries a legend and a <UI>Values behind this chart</UI> disclosure with the plotted figures in a table, so nothing depends on hovering. Marks that stand for a record are links.</p>
      <h3>Theme</h3>
      <p>The switch at the far right of the top bar changes between the dark and light themes. The choice is remembered on the device.</p>
    </>) },
  { slug: 'portfolio', n: '3', title: 'Portfolio', body: (
    <>
      <p>Portfolio is the home page. It shows every active project in the pipeline and what needs attention across the whole portfolio.</p>
      <h3>By stage</h3>
      <p>The stage board has one column per stage: Reconnaissance, Target generation, Drilling, Resource definition, Scoping study and Stage-gate decision. A column head shows the count of projects in that stage and the sum of their committed and forecast spend for the fiscal year; clicking it opens the Projects register cut to that stage. Each ticket in a column is a project: its id, name, commodity, the stage's live figure (metres drilled this year for Drilling, spend to date elsewhere), its jurisdiction and its next gate date. Committed and forecast in a column head are the sums of its projects' fiscal-year budgets; the legend under the board names the commodity colours. A ticket with a dashed border is on hold. Click a ticket to open the project.</p>
      <h3>Needs attention</h3>
      <p>The ledger under the board lists, in this order: approvals overdue, approvals due within seven days, tenements expiring within ninety days, batches on QAQC hold, programmes that have spent past the variance threshold, projects whose gate is within forty-five days, and unfilled project roles. Each line links to the record and shows its status chip.</p>
      <h3>Other shapes</h3>
      <dl>
        <dt>By commodity, By jurisdiction</dt><dd>The same projects grouped, with a budget bar chart and one register per group.</dd>
        <dt>Analytics</dt><dd>Metres drilled by month against plan, spend against significant intercepts, batches submitted and received, and the QAQC check counts. The stamp at the top gives the fiscal-year totals; open <UI>show method</UI> under it to read how each is computed.</dd>
        <dt>Budget</dt><dd>Approved, committed, spent and forecast for every active project, with the variance requests pending. Forecast above budget is shown in red with a plus sign; below in blue with a minus.</dd>
      </dl>
      <h3>Watching</h3>
      <p>Projects you have marked <UI>Watch</UI> are listed under Watching in the left column of the Portfolio section. Watching is per user.</p>
    </>) },
  { slug: 'projects', n: '4', title: 'Projects', body: (
    <>
      <p>A project is an exploration property: one commodity, one jurisdiction, one or more tenements, a stage in the pipeline and a budget for the fiscal year.</p>
      <h3>The register</h3>
      <p>Projects lists active projects by default. The left column cuts the register to on-hold or closed projects, to one commodity, or to one stage. The <UI>Find</UI> box matches id, name or jurisdiction. Columns include the project geologist (a dashed <em>vacant</em> chip when the role is unfilled), area under tenure, budget, spent with a progress bar, forecast against budget and the next gate date.</p>
      <h3>Creating a project</h3>
      <p><UI>New project</UI> asks for a name, commodity, jurisdiction, country, area, fiscal-year budget, project geologist and description. New projects start at Reconnaissance and are numbered by the tenant's auto-numbering rule. You need the <code>project.write</code> permission.</p>
      <h3>The project record</h3>
      <table>
        <thead><tr><th>Tab</th><th>What it holds</th></tr></thead>
        <tbody>
          <tr><td>Overview</td><td>Budget, area, holes, significant intercepts and the latest estimate; the description, the team, the stage history; recent programmes; open items (pending approvals, batches on hold, expiring tenements); comments.</td></tr>
          <tr><td>Tenure</td><td>Every tenement with its type, holder, expiry, area, annual expenditure commitment, spend against it and rent due. <UI>Lodge renewal</UI> starts the tenement-renewal workflow.</td></tr>
          <tr><td>Programmes</td><td>The project's programmes, all phases. <UI>New programme</UI> opens the programme form with this project selected.</td></tr>
          <tr><td>Drilling</td><td>Hole counts and metres, the best intercept, and the hole table.</td></tr>
          <tr><td>Assays</td><td>The project's sample batches.</td></tr>
          <tr><td>Resource</td><td>The latest released estimate (or the latest of any status), its categories, in-situ value at the price deck and the P10/P50/P90 forecast; the estimate history.</td></tr>
          <tr><td>Budget</td><td>The project ledger, spend by month against plan, programme budgets by type, and the programme ledgers.</td></tr>
          <tr><td>Approvals</td><td>Every request raised on the project.</td></tr>
          <tr><td>Activity</td><td>The audit trail for the project and its records.</td></tr>
        </tbody>
      </table>
      <h3>Comments</h3>
      <p>Most records have a comments panel at the foot of their overview. Type <code>@</code> and a colleague's first name to notify them. The project manager and project geologist are notified of every comment on their project.</p>
      <h3>Stage-gate decisions</h3>
      <p>A project leaves a stage by a stage-gate decision. Users with the <code>gate.decide</code> permission (the Exploration Manager by default) press <UI>Stage-gate decision</UI> on the project and choose one of:</p>
      <ul>
        <li><b>Advance</b> to the next stage. From the Stage-gate decision stage, advancing hands the project to the development group and closes it in ADIT with the outcome <em>advanced</em>.</li>
        <li><b>Place on hold</b> at the current stage, or <b>Resume</b> a held project.</li>
        <li><b>Relinquish</b>: close the project, lapse its tenure at the next expiry and make its records read-only.</li>
      </ul>
      <p>A reasoning of at least twenty characters is required and is written verbatim to the audit log. Where the decision needs a formal review first, raise a stage-gate approval request from Approvals (section 9); the gate pack and recommendation travel with it and the decision itself is then recorded here.</p>
      <h3>Editing</h3>
      <p><UI>Edit</UI> changes the name, description, project geologist, next gate date and year-end forecast. Budget, commodity and jurisdiction are set at creation and changed by support.</p>
    </>) },
  { slug: 'programmes', n: '5', title: 'Programmes', body: (
    <>
      <p>A programme is a unit of field or study work on a project: drilling, geochemistry, geophysics, mapping, metallurgy or an environmental baseline. It has a budget, dates, an objective, a lead, and once approved, a crew and its logistics.</p>
      <h3>Phases</h3>
      <table>
        <thead><tr><th>Phase</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>draft</td><td>Created; objective and dates roughed in.</td></tr>
          <tr><td>scoped</td><td>Targets, metres and method settled.</td></tr>
          <tr><td>costed</td><td>Budget complete. From here the programme is submitted for approval.</td></tr>
          <tr><td>approved</td><td>The programme-approval workflow has passed. Crew and logistics can be booked.</td></tr>
          <tr><td>mobilising</td><td>Rig, camp and crew moving to site.</td></tr>
          <tr><td>in-progress</td><td>Field work under way. Holes, samples and spend accrue.</td></tr>
          <tr><td>demobilising</td><td>Field work finished; equipment and crew leaving.</td></tr>
          <tr><td>complete</td><td>Ledger closed. Late invoices go to the project ledger.</td></tr>
          <tr><td>cancelled</td><td>Abandoned before completion.</td></tr>
        </tbody>
      </table>
      <p>The left column cuts the list to programmes in the field (mobilising to demobilising), in planning (draft to approved), complete, or all. The <UI>Type</UI> pills narrow further.</p>
      <h3>Creating and approving a programme</h3>
      <ol>
        <li><UI>New programme</UI>: choose the project and type, name it, state the objective, set dates and budget. Drilling programmes also take planned metres, planned holes and a rig. The programme is created as a draft.</li>
        <li>On the programme page, <UI>Move to scoped</UI>, then <UI>Move to costed</UI> as the plan firms up.</li>
        <li>At costed, <UI>Submit for approval</UI> raises a programme-approval request: Technical review (Project Geologist) → Budget check (Finance Controller) → Manager approval (Exploration Manager). When the last step is approved, the programme moves to approved by itself.</li>
        <li>From approved, move through mobilising, in-progress and demobilising to complete as the work proceeds.</li>
      </ol>
      <h3>Crew</h3>
      <p><UI>Assign crew</UI> adds a person, their role on this programme and a rotation (start and end). ADIT refuses an assignment that overlaps the same person's rotation on another live programme and says which. Assigned ADIT users are notified. The <UI>Crew</UI> tab lists assignments with their state: upcoming, on site or ended. <UI>Crew rotations</UI> in the left column shows every rotation across the tenant, soonest to end first.</p>
      <h3>Logistics</h3>
      <p>The <UI>Logistics</UI> tab holds the programme's charters, camp services, fuel, permits, equipment, medical cover and freight, each with a supplier, date, cost and status (requested → booked → confirmed → delivered). <UI>Add item</UI> and <UI>Edit</UI> maintain them. Purchase orders above the delegated limit go through the purchase-order workflow in Approvals.</p>
      <h3>Schedule, rigs and camps</h3>
      <p><UI>Schedule</UI> draws every programme on a timeline from January 2026 to June 2027, with today marked. <UI>Rigs</UI> lists contracted rigs with type, capacity, day rate, status and the programme they are on; logistics staff can update status and location. <UI>Camps</UI> lists camps with beds, occupancy, access and medical cover.</p>
    </>) },
  { slug: 'drilling', n: '6', title: 'Drilling', body: (
    <>
      <p>Drilling holds every drillhole in the tenant, across projects and programmes.</p>
      <h3>Hole statuses</h3>
      <table>
        <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>planned</td><td>Collar designed; not started.</td></tr>
          <tr><td>drilling</td><td>Rig on the hole.</td></tr>
          <tr><td>completed</td><td>Reached target depth; not yet logged.</td></tr>
          <tr><td>abandoned</td><td>Stopped short of three quarters of planned depth (lost hole, ground conditions).</td></tr>
          <tr><td>logged</td><td>Geological logging done; awaiting sampling and dispatch.</td></tr>
          <tr><td>sampled</td><td>Samples cut and dispatched; results pending.</td></tr>
          <tr><td>assayed</td><td>Results received and the batch accepted. Intercepts are computed.</td></tr>
        </tbody>
      </table>
      <h3>The hole list</h3>
      <p>Filter by hole id, project and hole type (DDH diamond, RC reverse circulation, AC aircore, Sonic). The left column cuts to holes drilling now, planned, awaiting sampling (logged) or abandoned. Columns give collar coordinates, azimuth and dip, planned and actual depth, the best intercept and the completion date. The column chart at the top shows holes completed by month, by commodity.</p>
      <h3>The hole record</h3>
      <p>Depth against plan, collar and orientation, sample counts, the best intercept, the rig and the logger, the batches the hole's samples went in. The downhole grade profile draws every assayed interval; intervals at or above cut-off are solid, below are dim, and the dashed line is the cut-off. The intercepts table lists runs above cut-off (one sample of internal dilution allowed); a <em>significant</em> intercept is at least one and a half times cut-off over the commodity's minimum length. The samples table lists every interval with its primary grade, secondary elements and any QAQC flag.</p>
      <p><UI>Update hole</UI> (permission <code>hole.write</code>) changes status, depth and completion date.</p>
      <h3>Intercepts</h3>
      <p><UI>Significant intercepts</UI> in the left column lists intercepts across the tenant, sorted by grade × length, with a scatter of length against grade over cut-off. Untick <UI>Significant only</UI> to see everything above cut-off.</p>
    </>) },
  { slug: 'assays', n: '7', title: 'Assays', body: (
    <>
      <p>Assays holds sample batches: the dispatches of samples to a laboratory, the results that come back, and the quality checks on them.</p>
      <h3>Batch lifecycle</h3>
      <table>
        <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>submitted</td><td>Dispatched; the laboratory has not confirmed receipt.</td></tr>
          <tr><td>in-prep</td><td>Crushing and pulverising.</td></tr>
          <tr><td>analysing</td><td>At the instrument.</td></tr>
          <tr><td>received</td><td>Results imported; QAQC checks run; awaiting review.</td></tr>
          <tr><td>qaqc-hold</td><td>A check failed and the batch is withheld from intercepts and estimates.</td></tr>
          <tr><td>accepted</td><td>Reviewed and released. Holes move to assayed.</td></tr>
          <tr><td>rejected</td><td>Returned to the laboratory for re-assay.</td></tr>
        </tbody>
      </table>
      <h3>Dispatching samples</h3>
      <p><UI>New dispatch</UI>: choose the project and laboratory, tick the logged holes to include, and submit. Sample numbers are assigned on dispatch. Control samples are inserted at the tenant rule of one standard, one blank and one field duplicate per twenty samples. The holes move to sampled.</p>
      <h3>Reviewing a batch</h3>
      <p>The batch page shows the sample count, insertions, insertion rate, failures, the share above cut-off and the turnaround against the laboratory's quoted days. Each QAQC failure is listed with the sample, the kind of check and what was measured against what was expected. Users with <code>qaqc.review</code> (the Database Geologist) can:</p>
      <ul>
        <li><UI>Import results</UI> on a batch still at the laboratory, which runs the checks and moves it to received.</li>
        <li><UI>Accept batch</UI>, confirming each failure has been reviewed.</li>
        <li><UI>Place on hold</UI> while the laboratory re-runs the failed checks.</li>
        <li><UI>Reject</UI>, with the reason sent to the laboratory.</li>
      </ul>
      <p>The project geologist and database geologist are notified of every status change.</p>
      <h3>Tolerances</h3>
      <p>A standard fails when it is outside the tenant's sigma tolerance of its certified value. A blank fails above a multiple of the detection limit. A field duplicate fails when its half absolute relative difference is above the limit, for pairs above cut-off. The values are set under Admin → QAQC tolerances (section 11).</p>
      <h3>QAQC summary and the sample register</h3>
      <p><UI>QAQC summary</UI> gives the pass rate by month, failures by project and the record by laboratory (checks, failures, pass rate, mean against quoted turnaround). <UI>Sample register</UI> lists every sample in the tenant; narrow by id, project and type before paging.</p>
    </>) },
  { slug: 'resources', n: '8', title: 'Resources', body: (
    <>
      <p>Resources holds resource estimates and what they are worth under the corporate price deck.</p>
      <h3>Estimates</h3>
      <p>An estimate belongs to a project and has an as-of date, a method, a cut-off, an author, a reviewer and one block per category: measured, indicated and inferred, each with tonnes, grade and contained metal. Statuses run draft → internal-review → qp-review → released; an estimate replaced by a later one is superseded. Only released estimates count in the portfolio figures.</p>
      <p><UI>New estimate</UI> (permission <code>resource.write</code>) takes the project, method, cut-off and the indicated and inferred blocks; measured blocks are entered by the database geologist after QP review. The estimate is saved as a draft.</p>
      <h3>Releasing an estimate</h3>
      <p>On a draft, <UI>Submit for release</UI> raises the resource-release workflow: Database sign-off (Database Geologist) → QP review (Project Geologist) → Manager release (Exploration Manager). The estimate moves to internal review while it runs and to released when the last step is approved. <UI>Change status</UI> moves an unreleased estimate between draft, internal review and QP review, or marks it superseded, and sets the reviewer.</p>
      <h3>Value and forecast</h3>
      <dl>
        <dt>Portfolio resources</dt><dd>In-situ value at the deck for every project with a released estimate, by project, commodity and category.</dd>
        <dt>In-situ value</dt><dd>The same with a price factor and a uniform recovery applied, for screening. No costs are deducted.</dd>
        <dt>Forecast</dt><dd>P10, P50 and P90 contained metal for the latest estimate on each project.</dd>
        <dt>Price deck</dt><dd>The price and unit for each commodity, its source and date, and the default cut-off. Administrators edit it; every valuation changes at once.</dd>
      </dl>
      <div className="note"><b>Copper is priced per pound.</b> ADIT converts at 2,204.62 lb per tonne when it values contained copper.</div>
    </>) },
  { slug: 'approvals', n: '9', title: 'Approvals', body: (
    <>
      <p>Approvals is the queue of workflow requests. Each request follows the steps of its workflow, and each step is owned by a role.</p>
      <h3>Workflows</h3>
      <table>
        <thead><tr><th>Workflow</th><th>Raised for</th><th>Steps</th></tr></thead>
        <tbody>
          <tr><td>Programme approval</td><td>A costed programme</td><td>Technical review → Budget check → Manager approval</td></tr>
          <tr><td>Budget variance</td><td>A forecast overrun above the threshold</td><td>Finance review → Manager approval</td></tr>
          <tr><td>Stage-gate decision</td><td>A project at the end of a stage</td><td>Geology recommendation → Finance review → Gate decision</td></tr>
          <tr><td>Land access agreement</td><td>Access to private or community land</td><td>Tenure review → Manager sign-off</td></tr>
          <tr><td>Work permit</td><td>Ground disturbance</td><td>Permit lodgement → Regulator decision</td></tr>
          <tr><td>Resource estimate release</td><td>An estimate leaving review</td><td>Database sign-off → QP review → Manager release</td></tr>
          <tr><td>Tenement renewal</td><td>A tenement before expiry</td><td>Expenditure check → Renewal lodgement</td></tr>
          <tr><td>Purchase order</td><td>Orders above the delegated limit</td><td>Logistics check → Finance approval</td></tr>
        </tbody>
      </table>
      <h3>The queue</h3>
      <p><UI>Awaiting me</UI> lists requests whose current step belongs to your role; the four most urgent are shown as tickets, the lead ticket first. <UI>All pending</UI>, <UI>Raised by me</UI> and <UI>Decided</UI> are the other cuts, and the left column also cuts by workflow. Each step has a service level in days; a request past its due date is marked overdue and appears in the Portfolio attention ledger.</p>
      <h3>Deciding</h3>
      <p>Open the request. If the current step is yours, the head offers <UI>Approve</UI>, <UI>Return</UI> and <UI>Reject</UI>.</p>
      <ul>
        <li><b>Approve</b> passes the step. The request moves to the next step and its owner is notified; on the last step the request is approved and its subject is updated (a programme becomes approved, an estimate released, a tenement's renewal lodged).</li>
        <li><b>Return</b> sends the request back to the requester to revise. A reason is required.</li>
        <li><b>Reject</b> ends the workflow. A reason is required and is sent to the requester.</li>
      </ul>
      <p>A requester can <UI>Withdraw</UI> their own pending request. Comments on a request notify the requester. Every decision is written to the audit log with its note.</p>
    </>) },
  { slug: 'optimiser', n: '10', title: 'Optimiser', body: (
    <>
      <p>The programme optimiser chooses which candidate drill targets to fund in the coming season under a budget and a rig-day limit.</p>
      <h3>Candidate targets</h3>
      <p>Each target belongs to a project and has a number of holes, metres, cost, rig days, a probability of success, the in-situ value it would add if successful, and the earliest date it can start. <UI>Candidate targets</UI> in the left column lists them. Targets are maintained by project geologists with support's help.</p>
      <h3>Running it</h3>
      <p>Set the budget, rig days, objective (expected value, metres tested, or probability of success) and, if wanted, a minimum number of targets per commodity. The selection recomputes as you change them. The stamp shows the expected value, cost, rig days and metres of the selection; the table marks each target selected or gives the reason it is not (budget exhausted, rig days exhausted). <UI>Lock</UI> forces a target in whenever it fits; <UI>Exclude</UI> removes it from consideration for this run.</p>
      <p>The method is stated under the stamp: locked targets first, then the best expected value per dollar until a constraint binds, then pairwise swaps that improve the objective. It does not model rig type, seasonal windows or shared mobilisation; treat the result as a starting point for the programme plan.</p>
      <h3>Scenarios</h3>
      <p><UI>Save scenario</UI> stores the constraints and the selection under a name. <UI>Saved scenarios</UI> lists them with who saved them and when, and can delete them.</p>
    </>) },
  { slug: 'administration', n: '11', title: 'Administration', body: (
    <>
      <p>Admin is available to roles with <code>admin.read</code>; changes need <code>admin.write</code> or <code>user.manage</code>.</p>
      <dl>
        <dt>System settings</dt><dd>Tenant name, fiscal year start, base currency, number locale, the budget-variance threshold, the stage-gate approver role; session timeout, password length, multi-factor, single sign-on provider, audit retention and the attachment limit; the auto-numbering rules (read-only). In a demonstration tenant, <UI>Reset demonstration tenant</UI> discards every change made in this browser.</dd>
        <dt>Price deck and cut-offs</dt><dd>The price and default cut-off for each commodity.</dd>
        <dt>QAQC tolerances</dt><dd>Sigma for standards, the blank multiple, the duplicate HARD limit and the minimum insertion rate.</dd>
        <dt>Workflows</dt><dd>The eight workflows, their steps, owning roles and service levels. Read-only; changed by support.</dd>
        <dt>Reference data</dt><dd>Laboratories, cost codes and commodities.</dd>
        <dt>Users</dt><dd>Accounts with role, title, email, team, location, status and last sign-in. <UI>Add user</UI> and <UI>Edit</UI>. Deactivated users keep their history; steps assigned to them pass to their role.</dd>
        <dt>Roles and permissions</dt><dd>The permission matrix and who holds each role.</dd>
        <dt>Audit log</dt><dd>Every action in the tenant with who, when, the record and the detail. Filter by text and user.</dd>
      </dl>
    </>) },
  { slug: 'account', n: '12', title: 'Your account', body: (
    <>
      <p>Open the account menu at the top right.</p>
      <dl>
        <dt>My profile</dt><dd>Phone, location and time zone. Name and email come from the identity provider.</dd>
        <dt>Preferences</dt><dd>The section to open on sign-in, a default project, units, date format, grade decimals, rows per page and compact tables.</dd>
        <dt>Notification settings</dt><dd>Which kinds of notification reach you in ADIT, and the email digest.</dd>
        <dt>Security</dt><dd>How you sign in and your active sessions.</dd>
      </dl>
    </>) },
  { slug: 'reference', n: '13', title: 'Reference', body: (
    <>
      <h3>Record ids</h3>
      <table>
        <thead><tr><th>Record</th><th>Format</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>Project</td><td><code>PRJ-0000</code></td><td>PRJ-0412</td></tr>
          <tr><td>Programme</td><td><code>PRG-YYYY-000</code></td><td>PRG-2026-014</td></tr>
          <tr><td>Drillhole</td><td><code>&lt;project prefix&gt;-&lt;type&gt;-000</code></td><td>WC-DDH-014</td></tr>
          <tr><td>Sample batch</td><td><code>LAB-YY-00000</code></td><td>LAB-26-04412</td></tr>
          <tr><td>Sample</td><td>six digits</td><td>100482</td></tr>
          <tr><td>Resource estimate</td><td><code>RES-YYYY-00</code></td><td>RES-2026-03</td></tr>
          <tr><td>Approval request</td><td><code>WF-YYYY-0000</code></td><td>WF-2026-0131</td></tr>
          <tr><td>Rig, camp</td><td><code>RIG-00</code>, <code>CMP-XX</code></td><td>RIG-07, CMP-WC</td></tr>
          <tr><td>Tenement</td><td>as issued by the jurisdiction</td><td>E 47/2210, MC00034821</td></tr>
        </tbody>
      </table>
      <h3>Status chips</h3>
      <p>Status is shown in a small chip. A filled chip is a settled or good state (approved, accepted, complete, current). A dashed chip is a waiting or provisional state (pending, draft, planned, expiring, on hold). A bold chip is a terminal negative state (rejected, lapsed, abandoned, cancelled). Colour is never used for status.</p>
      <h3>Money</h3>
      <p>All money is in the tenant's base currency. A difference against a budget or plan carries a sign: above budget is red with a plus, below is blue with a minus. Large figures may be abbreviated with k (thousand) and M (million); the table beneath always has the full figure.</p>
      <h3>Grades and units</h3>
      <table>
        <thead><tr><th>Commodity</th><th>Primary grade</th><th>Metal unit</th><th>Price unit</th></tr></thead>
        <tbody>
          <tr><td>Gold</td><td>Au g/t</td><td>oz</td><td>USD/oz</td></tr>
          <tr><td>Lithium</td><td>Li₂O %</td><td>t Li₂O</td><td>USD/t SC6 (spodumene concentrate)</td></tr>
          <tr><td>Potash</td><td>KCl %</td><td>t KCl</td><td>USD/t KCl</td></tr>
          <tr><td>Copper</td><td>Cu %</td><td>t Cu</td><td>USD/lb</td></tr>
          <tr><td>Nickel</td><td>Ni %</td><td>t Ni</td><td>USD/t</td></tr>
        </tbody>
      </table>
      <h3>What changed in 7.4</h3>
      <ul>
        <li>The Portfolio stage board replaces the tile dashboard.</li>
        <li>Crew assignment refuses overlapping rotations and names the clash.</li>
        <li>The optimiser gained locked targets, a minimum per commodity and saved scenarios.</li>
        <li>Every chart carries its values in a disclosure table.</li>
        <li>Batch review actions moved to the batch page head.</li>
        <li>Notification settings are per kind; the email digest is a separate choice.</li>
      </ul>
    </>) },
];

export function Manual() {
  const { '*': rest } = useParams();
  const slug = (rest ?? '').replace(/\/$/, '');
  const idx = Math.max(0, SECTIONS.findIndex((s) => s.slug === slug));
  const s = SECTIONS[idx];
  useEffect(() => {
    const prev = document.documentElement.dataset.theme;
    document.documentElement.dataset.theme = 'light';
    document.title = `${s.n}. ${s.title} — ADIT User Manual`;
    window.scrollTo(0, 0);
    return () => { document.documentElement.dataset.theme = prev; };
  }, [s]);
  const prev = SECTIONS[idx - 1], next = SECTIONS[idx + 1];
  const to = (x: Section) => `/manual${x.slug ? '/' + x.slug : ''}`;
  return (
    <div className="manual">
      <nav className="manual-nav" aria-label="Manual contents">
        <div className="pub">Brannock Geosystems</div>
        <div className="ttl">ADIT User Manual</div>
        <div className="rel">Release 7.4 · document BG-ADIT-UM-74-02 · 2026-08</div>
        <ol>{SECTIONS.map((x) => <li key={x.slug}><Link to={to(x)} aria-current={x === s ? 'page' : undefined}><span className="n">{x.n}.</span>{x.title}</Link></li>)}</ol>
        <a className="back" href="#/portfolio">← Back to ADIT</a>
      </nav>
      <main className="manual-body" id="content">
        <h1>{s.n}. {s.title}</h1>
        <div className="sub">ADIT User Manual · Release 7.4 · Section {s.n} of {SECTIONS.length}</div>
        {s.body}
        <div className="pn">{prev ? <Link to={to(prev)}>← {prev.n}. {prev.title}</Link> : <span />}{next ? <Link to={to(next)}>{next.n}. {next.title} →</Link> : <span />}</div>
        <p className="faint small" style={{ marginTop: 32 }}>© Brannock Geosystems. ADIT is a trademark of Brannock Geosystems. This document describes release 7.4 and is superseded by the release notes for any later version.</p>
      </main>
    </div>
  );
}
