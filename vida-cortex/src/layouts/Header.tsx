import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, Tooltip, Chip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeMode } from '../hooks/useThemeMode';

interface Props { title: string; sidebarWidth: number }

export default function Header({ title, sidebarWidth }: Props) {
  const navigate = useNavigate();
  const { isDark, toggle } = useThemeMode();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${isDark ? 'rgba(0,137,123,0.2)' : 'rgba(0,137,123,0.15)'}`,
        left: sidebarWidth,
        width: `calc(100% - ${sidebarWidth}px)`,
        transition: 'left 0.25s, width 0.25s',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight={700} color={isDark ? '#e2e8f0' : '#1a202c'}>
            {title}
          </Typography>
          <Chip
            icon={<SmartToyIcon sx={{ fontSize: '14px !important', color: '#5eead4 !important' }} />}
            label="Agent Active"
            size="small"
            sx={{
              bgcolor: 'rgba(0,137,123,0.12)',
              color: '#00897b',
              border: '1px solid rgba(0,137,123,0.25)',
              fontWeight: 600,
              fontSize: 11,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Theme toggle */}
          <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={toggle}
              sx={{
                color: isDark ? '#fbbf24' : '#64748b',
                bgcolor: isDark ? 'rgba(251,191,36,0.08)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${isDark ? 'rgba(251,191,36,0.2)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 2,
                width: 36,
                height: 36,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(251,191,36,0.15)' : 'rgba(0,137,123,0.08)',
                  color: isDark ? '#fbbf24' : '#00897b',
                },
              }}
            >
              {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton sx={{ color: isDark ? '#8b949e' : '#64748b', '&:hover': { color: '#00897b' } }}>
              <NotificationsIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: isDark ? 'rgba(0,137,123,0.3)' : '#00897b',
              border: `1px solid ${isDark ? 'rgba(94,234,212,0.4)' : 'rgba(0,137,123,0.3)'}`,
              fontSize: 13,
              color: '#fff',
            }}
          >
            JD
          </Avatar>

          <Tooltip title="Logout">
            <IconButton
              onClick={() => navigate('/login')}
              sx={{ color: isDark ? '#8b949e' : '#64748b', '&:hover': { color: '#ef4444' } }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
