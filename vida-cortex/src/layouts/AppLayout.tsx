import { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar, { SIDEBAR_W } from './Sidebar';
import Header from './Header';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/approvals': 'Agent Queue',
  '/agent-builder': 'Agent Pipeline Builder',
  '/repos': 'Repositories',
  '/onboarding': 'Onboarding',
  '/deployments': 'Deployments',
  '/builds': 'Builds',
  '/failed-pipelines': 'Failed Pipelines',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [sidebarW, setSidebarW] = useState(SIDEBAR_W);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'transparent' }}>
      <Sidebar onWidthChange={setSidebarW} />
      <Box sx={{ flex: 1, ml: `${sidebarW}px`, transition: 'margin-left 0.25s' }}>
        <Header title={pageTitles[pathname] ?? 'VIDA Cortex'} sidebarWidth={sidebarW} />
        <Box sx={{ mt: '64px', p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
