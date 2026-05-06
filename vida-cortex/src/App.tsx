import { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './data/theme';
import { ThemeContextProvider, useThemeMode } from './hooks/useThemeMode';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Approvals from './pages/Approvals';
import AgentBuilder from './pages/AgentBuilder';
import Repositories from './pages/Repositories';
import Onboarding from './pages/Onboarding';
import Deployments from './pages/Deployments';
import Builds from './pages/Builds';
import FailedPipelines from './pages/FailedPipelines';

function ThemedApp() {
  const { isDark } = useThemeMode();
  const theme = useMemo(() => createAppTheme(isDark), [isDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard"       element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/approvals"       element={<AppLayout><Approvals /></AppLayout>} />
          <Route path="/agent-builder"   element={<AppLayout><AgentBuilder /></AppLayout>} />
          <Route path="/repos"           element={<AppLayout><Repositories /></AppLayout>} />
          <Route path="/onboarding"      element={<AppLayout><Onboarding /></AppLayout>} />
          <Route path="/deployments"     element={<AppLayout><Deployments /></AppLayout>} />
          <Route path="/builds"          element={<AppLayout><Builds /></AppLayout>} />
          <Route path="/failed-pipelines" element={<AppLayout><FailedPipelines /></AppLayout>} />
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
