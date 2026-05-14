import { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar, { SIDEBAR_W } from './Sidebar';
import Header from './Header';
import { useLocation } from 'react-router-dom';
import { useThemeMode } from '../hooks/useThemeMode';
import { getPageTitle } from '../routes';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [sidebarW, setSidebarW] = useState(SIDEBAR_W);
  const { isDark } = useThemeMode();
  const pageTitle = getPageTitle(pathname);

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      bgcolor: isDark ? '#0A0E1A' : '#F3F4F6' 
    }}>
      <Sidebar onWidthChange={setSidebarW} />
      <Box sx={{ flex: 1, ml: `${sidebarW}px`, transition: 'margin-left 0.25s' }}>
        <Header title={pageTitle} sidebarWidth={sidebarW} />
        <Box sx={{ mt: '64px', p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
