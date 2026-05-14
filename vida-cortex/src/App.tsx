import { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './data/theme';
import { ThemeContextProvider, useThemeMode } from './hooks/useThemeMode';
import { ROUTE_PATHS } from './routes';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AgentQueue from './pages/Approvals';
import AgentBuilder from './pages/AgentBuilder';
import Repositories from './pages/Repositories';
import Onboarding from './pages/Onboarding';
import AgentOnboarding from './pages/AgentOnboarding';
import Deployments from './pages/Deployments';
import Builds from './pages/Builds';
import Workflows from './pages/Workflows';
import FailedPipelines from './pages/FailedPipelines';

function ThemedApp() {
  const { isDark } = useThemeMode();
  const theme = useMemo(() => createAppTheme(isDark), [isDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path={ROUTE_PATHS.ROOT} element={<Navigate to={ROUTE_PATHS.LOGIN} replace />} />
          <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />
          <Route path={ROUTE_PATHS.DASHBOARD} element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path={ROUTE_PATHS.APPROVALS} element={<AppLayout><AgentQueue /></AppLayout>} />
          <Route path={ROUTE_PATHS.AGENT_BUILDER} element={<AppLayout><AgentBuilder /></AppLayout>} />
          <Route path={ROUTE_PATHS.WORKFLOWS} element={<AppLayout><Workflows /></AppLayout>} />
          <Route path={ROUTE_PATHS.REPOS} element={<AppLayout><Repositories /></AppLayout>} />
          <Route path={ROUTE_PATHS.ONBOARDING} element={<AppLayout><Onboarding /></AppLayout>} />
          <Route path={ROUTE_PATHS.AGENT_ONBOARDING} element={<AppLayout><AgentOnboarding /></AppLayout>} />
          <Route path={ROUTE_PATHS.DEPLOYMENTS} element={<AppLayout><Deployments /></AppLayout>} />
          <Route path={ROUTE_PATHS.BUILDS} element={<AppLayout><Builds /></AppLayout>} />
          <Route path={ROUTE_PATHS.FAILED_PIPELINES} element={<AppLayout><FailedPipelines /></AppLayout>} />
          <Route path="*" element={<Navigate to={ROUTE_PATHS.DASHBOARD} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeContextProvider>
      <ThemedApp />
    </ThemeContextProvider>
  );
}
