import { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar, { SIDEBAR_W } from './Sidebar';
import Header from './Header';
import { useLocation } from 'react-router-dom';
import { useThemeMode } from '../hooks/useThemeMode';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/approvals': 'Agent Queue',
  '/repos': 'Repositories',
  '/onboarding': 'Onboarding',
  '/deployments': 'Deployments',
  '/builds': 'Builds',
  '/failed-pipelines': 'Failed Pipelines',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [sidebarW, setSidebarW] = useState(SIDEBAR_W);
  const { isDark } = useThemeMode();

  const gridColor = isDark ? 'rgba(0,137,123,0.06)' : 'rgba(0,137,123,0.04)';
  const bgColor   = isDark ? '#0d1117' : '#f0f4f8';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: bgColor, position: 'relative', overflow: 'hidden', transition: 'background-color 0.3s' }}>
      {/* Animated grid */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          animation: 'gridMove 25s linear infinite',
          pointerEvents: 'none',
          zIndex: 0,
          '@keyframes gridMove': {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '40px 40px' },
          },
        }}
      />
      {/* Ambient glows */}
      <Box sx={{ position: 'fixed', top: '20%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${isDark ? 'rgba(0,137,123,0.08)' : 'rgba(0,137,123,0.05)'} 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />
      <Box sx={{ position: 'fixed', bottom: '10%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${isDark ? 'rgba(94,234,212,0.05)' : 'rgba(0,137,123,0.04)'} 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

      <Sidebar onWidthChange={setSidebarW} />
      <Box sx={{ flex: 1, ml: `${sidebarW}px`, transition: 'margin-left 0.25s', position: 'relative', zIndex: 1 }}>
        <Header title={pageTitles[pathname] ?? 'VIDA Cortex'} sidebarWidth={sidebarW} />
        <Box sx={{ mt: '64px', p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
