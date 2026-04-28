import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Tooltip, IconButton, Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FolderIcon from '@mui/icons-material/Folder';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BuildIcon from '@mui/icons-material/Build';
import ErrorIcon from '@mui/icons-material/Error';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const navItems = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
  { label: 'Approvals', icon: CheckCircleIcon, path: '/approvals' },
  { label: 'Repositories', icon: FolderIcon, path: '/repos' },
  { label: 'Onboarding', icon: AddCircleOutlineIcon, path: '/onboarding' },
  { label: 'Deployments', icon: RocketLaunchIcon, path: '/deployments' },
  { label: 'Builds', icon: BuildIcon, path: '/builds' },
  { label: 'Failed Pipelines', icon: ErrorIcon, path: '/failed-pipelines' },
];

export const SIDEBAR_W = 220;
export const SIDEBAR_COLLAPSED = 64;

interface Props { onWidthChange?: (w: number) => void }

export default function Sidebar({ onWidthChange }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

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
        background: 'linear-gradient(180deg, #134e4a, #115e59, #0f766e)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 1200,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2.5, gap: 1.5, minHeight: 64 }}>
        <CloudUploadIcon sx={{ color: '#5eead4', fontSize: 28, flexShrink: 0 }} />
        {!collapsed && (
          <Typography fontWeight={800} fontSize={16} color="#fff" noWrap>
            VIDA Cortex
          </Typography>
        )}
      </Box>

      <Box sx={{ px: 1, mb: 1 }}>
        <IconButton onClick={toggle} sx={{ color: '#99f6e4' }}>
          <MenuIcon />
        </IconButton>
      </Box>

      <List dense sx={{ flex: 1, px: 0.5 }}>
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = pathname === path;
          return (
            <Tooltip key={path} title={collapsed ? label : ''} placement="right">
              <ListItemButton
                onClick={() => navigate(path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: collapsed ? 1.5 : 2,
                  bgcolor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: active ? '#5eead4' : '#99f6e4' }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: 13,
                      fontWeight: active ? 700 : 400,
                      color: active ? '#fff' : '#ccfbf1',
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
