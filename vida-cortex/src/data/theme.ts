import { createTheme } from '@mui/material/styles';

export function createAppTheme(isDark: boolean) {
  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: { main: '#00897b' },
      background: {
        default: isDark ? '#0d1117' : '#f0f4f8',
        paper:   isDark ? '#161b22' : '#ffffff',
      },
      text: {
        primary:   isDark ? '#e2e8f0' : '#1a202c',
        secondary: isDark ? '#8b949e' : '#4a5568',
      },
      divider: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    },
    typography: { fontFamily: '"Segoe UI", Roboto, sans-serif' },
    shape: { borderRadius: 12 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: isDark
            ? { background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', borderRadius: 12 }
            : { background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderRadius: 12 },
        },
      },
      MuiButton: {
        styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } },
      },
      MuiChip: {
        styleOverrides: { root: { borderRadius: 6, fontWeight: 600, fontSize: '0.75rem' } },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-root': {
              background: isDark ? 'rgba(0,137,123,0.08)' : 'rgba(0,137,123,0.05)',
              borderBottom: `1px solid ${isDark ? 'rgba(0,137,123,0.2)' : 'rgba(0,137,123,0.15)'}`,
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': { background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,137,123,0.03)' },
            '& .MuiTableCell-root': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}` },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: { root: { color: isDark ? '#c9d1d9' : '#374151' } },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            color: isDark ? '#8b949e' : '#64748b',
            '&.Mui-selected': { color: '#00897b' },
          },
        },
      },
      MuiTabs: {
        styleOverrides: { indicator: { backgroundColor: '#00897b' } },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)' },
              '&:hover fieldset': { borderColor: 'rgba(0,137,123,0.5)' },
              '&.Mui-focused fieldset': { borderColor: '#00897b' },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            background: isDark ? '#161b22' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
          },
        },
      },
      MuiStepLabel: {
        styleOverrides: {
          label: {
            color: isDark ? '#8b949e' : '#64748b',
            '&.Mui-active': { color: '#00897b' },
            '&.Mui-completed': { color: '#00897b' },
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)',
            '&.Mui-active': { color: '#00897b' },
            '&.Mui-completed': { color: '#00897b' },
          },
        },
      },
      MuiDivider: {
        styleOverrides: { root: { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' } },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? 'rgba(13,17,23,0.85)' : 'rgba(255,255,255,0.9)',
          },
        },
      },
    },
  });
}
