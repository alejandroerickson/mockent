# Product

<!-- impeccable:product-schema 1 -->

> Every fact below is either **[A]**, a stated requirement, or **[inferred]**, chosen during the build to fill a gap. `okf/` holds the wider record; this file is the design-relevant subset.

## Platform

web

## Stack

Delegated **[A]**: Vite + React + TypeScript in the top-level folder `adit/`, hash-routed so it publishes as static files at `https://alejandroerickson.com/mockent/adit/` through the existing `scripts/build-pages.sh`. No backend: all data is generated in the browser from a fixed seed and user actions persist in `localStorage`. **[inferred]** Vitest for the tests the deploy script requires.

## Users

- **Experts at the companies that license the product** **[A]**: the application is highly specialized, built for experts, and not self-explanatory; it is understood by the people who use it daily, who have the vendor's support line, the vendor's user manual, and their own company's business processes on top (the last is out of scope **[A]**).
- **The mock tenant** **[inferred]**: *Kestrel Range Resources*, a mid-tier mineral explorer with a portfolio of projects in several jurisdictions. Seven named users with distinct roles: exploration manager, senior project geologist, database geologist, field logistics coordinator, finance controller, tenure and permitting officer, system administrator. The app supports multiple users **[A]**; a user switcher stands in for sign-in.
- **The reader who judges it** **[A]**: a non-expert. It needs to be believable to a non-expert, not to mining experts.

## Product Purpose

**ADIT Exploration Management System, release 7.4, by Brannock Geosystems** **[inferred names]**: a generalized remote mining exploration app **[A]** in which a company plans, staffs, budgets, drills, assays, evaluates and closes out mineral exploration projects. It covers **[A]**: entities describing types of exploration; the stages of planning; logistics for getting a team out and assigning work to it; domain detail about the material found; forecasts of how much there is and what it might be worth; analytics, dashboards and budgets; an optimisation interface; approvals; results; and what happens afterwards (closed, or on to the next stage). Five deliberately different commodities **[A: gold, lithium and potash named; diamonds excluded]**: gold, lithium, potash, copper and nickel **[copper and nickel inferred]**.

Success, for Mockent, is that the app is believable, dense, richly represented and its own thing **[A]**. The repository's reason for building it (browser-control experiments) is deliberately not part of the product and must not surface in its copy, markup or data **[A]**.

## Positioning

**[inferred, as a mock]** ADIT's claim is that one record chain runs from a tenement through a programme, a drillhole, a sample batch and an intercept to a resource estimate and a stage-gate decision, so a manager can trace any forecast figure back to the assay it rests on. That is the mechanism every screen is built around and the reason the manual exists.

## Operating Context

- Used at a desk in an office and, for field staff, on a laptop at a camp with poor connectivity; dense tables and keyboard-friendly forms are expected **[inferred]**.
- The vendor supplies a **User Manual** that opens in a new tab from the application, styled so the reader can tell they have left the application, describing each page and how to get the important things done **[A]**.
- Users leave comments and enter information on records; modals and popovers are normal **[A]**.
- No AI assistant of any kind **[A]**.

## Capabilities and Constraints

- Sections **[inferred from A's list]**: Portfolio (dashboards and analytics), Projects (with tenure, stages, budget, comments), Programmes (planning stages, logistics, crew and rig assignment), Drilling and Assays (holes, sample batches, QAQC, intercepts), Resources (estimates, forecasts, valuation under a price deck), Approvals (workflow queue and stage-gate decisions), Optimiser, Administration (system settings, users, roles, workflows, reference data, audit log) and each user's own settings; notifications throughout.
- All figures are synthetic and seeded; the app says so once, in the environment chip, and nowhere else **[inferred]**.
- The DOM carries the ARIA labels, roles and landmarks a real product would **[A]**, and nothing aimed at automation.
- Undecided, not invented: whether Mockent ever gets a backend; whether other tenants or languages matter.

## Brand Commitments

- Product name **ADIT**, vendor **Brannock Geosystems**, tenant **Kestrel Range Resources** **[inferred; may be renamed]**.
- Voice: the vendor's, terse and technical, in the application's own vocabulary; the manual explains, the screens name.
- The design system is recorded in `DESIGN.md` **[A]**.

## Evidence on Hand

- None real. Every project, person, place, assay, price and budget is invented. Never present any of it as real-world data, and never add a real company or person.

## Product Principles

1. **Believable to a careful non-expert.** Names, units, ids and workflows should read as a real product's, not as a demo's.
2. **The record chain is the product.** Every figure is reachable from the thing it was computed from.
3. **Expert software explains nothing on screen.** The manual explains; the screens name and act.
4. **Dense and consistent over surprising.** One component vocabulary across every section.
5. **Its own thing.** No trace of why the mock was built.

## Accessibility & Inclusion

WCAG 2.2 AA as the floor: 4.5:1 body text, keyboard reach for every pointer action, visible focus, no meaning carried by colour alone.
