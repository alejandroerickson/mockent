import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import { StoreProvider } from './store';
import { Shell } from './shell/Shell';
import { Portfolio } from './pages/Portfolio';
import { Projects, NewProject, ProjectDetail } from './pages/Projects';
import { Programmes, NewProgramme, ProgrammeDetail, Schedule, Rigs, Camps, CrewRotations } from './pages/Programmes';
import { Drilling, Intercepts, HoleDetail } from './pages/Drilling';
import { Assays, NewDispatch, QaqcSummary, SampleRegister, BatchDetail } from './pages/Assays';
import { ResourcesHome, Estimates, NewEstimate, EstimateDetail, Valuation, Forecast, PriceDeck } from './pages/Resources';
import { Approvals, ApprovalDetail } from './pages/Approvals';
import { Optimiser, Targets, Scenarios } from './pages/Optimiser';
import { SystemSettingsPage, PriceDeckAdmin, QaqcAdmin, Workflows, ReferenceData, Users, Roles, AuditLog } from './pages/Admin';
import { Profile, Preferences, NotificationSettings, Security, AllNotifications, SearchPage, NotFound } from './pages/Account';
import { Manual } from './pages/Manual';

const router = createHashRouter([
  { path: '/manual/*', element: <Manual /> },
  {
    path: '/', element: <Shell />, children: [
      { index: true, element: <Navigate to="/portfolio" replace /> },
      { path: 'portfolio', element: <Portfolio /> },
      { path: 'portfolio/:shape', element: <Portfolio /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/new', element: <NewProject /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
      { path: 'projects/:id/:tab', element: <ProjectDetail /> },
      { path: 'programmes', element: <Programmes /> },
      { path: 'programmes/new', element: <NewProgramme /> },
      { path: 'programmes/schedule', element: <Schedule /> },
      { path: 'programmes/rigs', element: <Rigs /> },
      { path: 'programmes/camps', element: <Camps /> },
      { path: 'programmes/crew', element: <CrewRotations /> },
      { path: 'programmes/:id', element: <ProgrammeDetail /> },
      { path: 'programmes/:id/:tab', element: <ProgrammeDetail /> },
      { path: 'drilling', element: <Drilling /> },
      { path: 'drilling/intercepts', element: <Intercepts /> },
      { path: 'drilling/:id', element: <HoleDetail /> },
      { path: 'assays', element: <Assays /> },
      { path: 'assays/new', element: <NewDispatch /> },
      { path: 'assays/qaqc', element: <QaqcSummary /> },
      { path: 'assays/samples', element: <SampleRegister /> },
      { path: 'assays/:id', element: <BatchDetail /> },
      { path: 'resources', element: <ResourcesHome /> },
      { path: 'resources/estimates', element: <Estimates /> },
      { path: 'resources/estimates/new', element: <NewEstimate /> },
      { path: 'resources/estimates/:id', element: <EstimateDetail /> },
      { path: 'resources/valuation', element: <Valuation /> },
      { path: 'resources/forecast', element: <Forecast /> },
      { path: 'resources/price-deck', element: <PriceDeck /> },
      { path: 'approvals', element: <Approvals /> },
      { path: 'approvals/:id', element: <ApprovalDetail /> },
      { path: 'optimiser', element: <Optimiser /> },
      { path: 'optimiser/targets', element: <Targets /> },
      { path: 'optimiser/scenarios', element: <Scenarios /> },
      { path: 'admin', element: <SystemSettingsPage /> },
      { path: 'admin/system', element: <SystemSettingsPage /> },
      { path: 'admin/price-deck', element: <PriceDeckAdmin /> },
      { path: 'admin/qaqc', element: <QaqcAdmin /> },
      { path: 'admin/workflows', element: <Workflows /> },
      { path: 'admin/reference', element: <ReferenceData /> },
      { path: 'admin/users', element: <Users /> },
      { path: 'admin/roles', element: <Roles /> },
      { path: 'admin/audit', element: <AuditLog /> },
      { path: 'account', element: <Profile /> },
      { path: 'account/preferences', element: <Preferences /> },
      { path: 'account/notifications', element: <NotificationSettings /> },
      { path: 'account/security', element: <Security /> },
      { path: 'notifications', element: <AllNotifications /> },
      { path: 'search', element: <SearchPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export function App() {
  return <StoreProvider><RouterProvider router={router} /></StoreProvider>;
}
