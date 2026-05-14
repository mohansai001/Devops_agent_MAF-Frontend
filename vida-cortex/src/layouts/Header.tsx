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
        bgcolor: 'transparent',
        background: isDark ? 'rgba(15,17,23,0.85)' : 'rgba(243,244,246,0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.7)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        left: sidebarWidth,
        width: `calc(100% - ${sidebarWidth}px)`,
        transition: 'left 0.25s, width 0.25s',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ minHeight: 52 }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: isDark ? '#F3F4F6' : '#111827', letterSpacing: '-0.01em', fontSize: '0.85rem' }}>
            {title}
          </Typography>
          <Chip
            icon={<SmartToyIcon sx={{ fontSize: '14px !important', color: '#0D9488 !important' }} />}
            label="Agent Active"
            size="small"
            sx={{
              bgcolor: isDark ? 'rgba(13,148,136,0.15)' : 'rgba(13,148,136,0.08)',
              color: '#0D9488',
              fontWeight: 600,
              fontSize: 11,
              border: 'none',
              boxShadow: isDark 
                ? '3px 3px 10px rgba(0,0,0,0.3), -2px -2px 8px rgba(255,255,255,0.03)' 
                : '3px 3px 8px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.7)',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={toggle} sx={{ color: isDark ? '#F9FAFB' : '#6B7280' }}>
              {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton sx={{ color: '#6B7280' }}>
              <NotificationsIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: '#0D9488',
              fontSize: 13,
              color: '#fff',
              fontWeight: 700,
              boxShadow: '3px 3px 10px rgba(13,148,136,0.3)',
            }}
          >
            JD
          </Avatar>

          <Tooltip title="Logout">
            <IconButton
              onClick={() => navigate('/login')}
              sx={{ color: '#6B7280', '&:hover': { color: '#ef4444' } }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
