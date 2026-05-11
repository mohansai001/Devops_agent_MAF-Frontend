import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Tooltip, IconButton, Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BuildIcon from '@mui/icons-material/Build';
import ErrorIcon from '@mui/icons-material/Error';
import MenuIcon from '@mui/icons-material/Menu';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { neuShadowSm } from '../data/theme';
import { useThemeMode } from '../hooks/useThemeMode';

const navItems = [
  { label: 'Dashboard',        icon: DashboardIcon,        path: '/dashboard' },
  { label: 'Approvals',        icon: CheckCircleIcon,      path: '/approvals' },
  { label: 'Agent Builder',    icon: SettingsIcon,         path: '/agent-builder' },
  { label: 'Workflows',        icon: AccountTreeIcon,      path: '/workflows' },
  // { label: 'Repositories',     icon: FolderIcon,           path: '/repos' },
  // { label: 'Onboarding',       icon: AddCircleOutlineIcon, path: '/onboarding' },
  // { label: 'Deployments',      icon: RocketLaunchIcon,     path: '/deployments' },
  // { label: 'Builds',           icon: BuildIcon,            path: '/builds' },
  // { label: 'Failed Pipelines', icon: ErrorIcon,            path: '/failed-pipelines' },
];

export const SIDEBAR_W = 220;
export const SIDEBAR_COLLAPSED = 64;

interface Props { onWidthChange?: (w: number) => void }

export default function Sidebar({ onWidthChange }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isDark } = useThemeMode();

  const bg       = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.55)';
  const border   = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.7)';
  const textPri  = isDark ? '#F9FAFB' : '#111827';
  const textSec  = isDark ? '#9CA3AF' : '#374151';
  const iconSec  = isDark ? '#6B7280' : '#6B7280';
  const btnBg    = isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6';

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    onWidthChange?.(next ? SIDEBAR_COLLAPSED : SIDEBAR_W);
  };

  const w = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_W;

  return (
    <Box
      sx={{
        width: w,
        minHeight: '100vh',
        background: bg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRight: border,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s',
        flexShrink: 0,
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 1200,
        overflow: 'hidden',
        boxShadow: '4px 0 20px rgba(0,0,0,0.06)',
      }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2.5, gap: 1.5, minHeight: 64 }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: 2, bgcolor: '#0D9488',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '3px 3px 10px rgba(13,148,136,0.35)',
        }}>
          <CloudUploadIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        {!collapsed && (
          <Typography fontWeight={800} fontSize={16} color={textPri} noWrap letterSpacing="-0.01em">
            VIDA Cortex
          </Typography>
        )}
      </Box>

      {/* Collapse toggle */}
      <Box sx={{ px: 1.5, mb: 1 }}>
        <IconButton
          onClick={toggle}
          size="small"
          sx={{
            color: '#6B7280',
            bgcolor: btnBg,
            boxShadow: neuShadowSm,
            borderRadius: 2,
            '&:hover': { color: '#0D9488' },
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Nav items */}
      <List dense sx={{ flex: 1, px: 1 }}>
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = pathname === path;
          return (
            <Tooltip key={path} title={collapsed ? label : ''} placement="right">
              <ListItemButton
                onClick={() => navigate(path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: collapsed ? 1.5 : 1.5,
                  bgcolor: active ? 'rgba(13,148,136,0.08)' : 'transparent',
                  boxShadow: active ? neuShadowSm : 'none',
                  borderLeft: active ? '3px solid #0D9488' : '3px solid transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(13,148,136,0.05)', transform: 'translateX(2px)' },
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
              >
                <ListItemIcon sx={{
                  minWidth: collapsed ? 0 : 36,
                  color: active ? '#0D9488' : iconSec,
                  transition: 'color 0.2s ease',
                }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
                      color: active ? '#0D9488' : textSec,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
}
