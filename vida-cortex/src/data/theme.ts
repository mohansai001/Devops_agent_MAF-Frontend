import { createTheme } from '@mui/material/styles';

// Hybrid: Soft Neumorphism + Subtle Glass — VIDA Cortex
// Accent: #0D9488 | Base BG: #F3F4F6

// ── Light tokens ──────────────────────────────────────────────
const L_BG       = '#F3F4F6';
const L_GLASS    = 'rgba(255,255,255,0.6)';
const L_GLASS_SM = 'rgba(255,255,255,0.5)';
const L_BORDER   = 'rgba(255,255,255,0.7)';
const L_TEXT_PRI = '#111827';
const L_TEXT_SEC = '#6B7280';
const L_NEU      = `6px 6px 16px rgba(0,0,0,0.08), -6px -6px 16px rgba(255,255,255,0.8)`;
const L_NEU_SM   = `3px 3px 10px rgba(0,0,0,0.07), -3px -3px 10px rgba(255,255,255,0.75)`;
const L_NEU_IN   = `inset 3px 3px 8px rgba(0,0,0,0.07), inset -3px -3px 8px rgba(255,255,255,0.75)`;

// ── Dark tokens ───────────────────────────────────────────────
const D_BG       = '#0F1117';
const D_GLASS    = 'rgba(255,255,255,0.05)';
const D_GLASS_SM = 'rgba(255,255,255,0.03)';
const D_BORDER   = 'rgba(255,255,255,0.08)';
const D_TEXT_PRI = '#F9FAFB';
const D_TEXT_SEC = '#9CA3AF';
const D_NEU      = `6px 6px 16px rgba(0,0,0,0.4), -6px -6px 16px rgba(255,255,255,0.03)`;
const D_NEU_SM   = `3px 3px 10px rgba(0,0,0,0.35), -3px -3px 10px rgba(255,255,255,0.02)`;
const D_NEU_IN   = `inset 3px 3px 8px rgba(0,0,0,0.35), inset -3px -3px 8px rgba(255,255,255,0.02)`;

const ACCENT = '#0D9488';

export const neuShadow      = L_NEU;
export const neuShadowSm    = L_NEU_SM;
export const neuShadowInset = L_NEU_IN;

export function createAppTheme(isDark: boolean) {
  const BG       = isDark ? D_BG       : L_BG;
  const GLASS    = isDark ? D_GLASS    : L_GLASS;
  const GLASS_SM = isDark ? D_GLASS_SM : L_GLASS_SM;
  const BORDER   = isDark ? D_BORDER   : L_BORDER;
  const TEXT_PRI = isDark ? D_TEXT_PRI : L_TEXT_PRI;
  const TEXT_SEC = isDark ? D_TEXT_SEC : L_TEXT_SEC;
  const neuGlass   = isDark ? D_NEU    : L_NEU;
  const neuGlassSm = isDark ? D_NEU_SM : L_NEU_SM;
  const neuInset   = isDark ? D_NEU_IN : L_NEU_IN;
  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary:    { main: ACCENT },
      secondary:  { main: '#374151' },
      background: { default: BG, paper: GLASS },
      text:       { primary: TEXT_PRI, secondary: TEXT_SEC },
      divider:    isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    },
    typography: {
      fontSize: 11,
      htmlFontSize: 18,
      fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
      h1: { fontWeight: 800, fontSize: '1.3rem',  color: TEXT_PRI, letterSpacing: '-0.02em' },
      h2: { fontWeight: 800, fontSize: '1.15rem', color: TEXT_PRI, letterSpacing: '-0.01em' },
      h3: { fontWeight: 700, fontSize: '1.05rem', color: TEXT_PRI },
      h4: { fontWeight: 700, fontSize: '0.95rem', color: TEXT_PRI },
      h5: { fontWeight: 700, fontSize: '0.85rem', color: TEXT_PRI },
      h6: { fontWeight: 700, fontSize: '0.78rem', color: TEXT_PRI },
      subtitle1: { fontWeight: 600, fontSize: '0.72rem', color: TEXT_PRI },
      subtitle2: { fontWeight: 600, fontSize: '0.68rem', color: TEXT_PRI },
      body1:   { fontSize: '0.7rem',  color: TEXT_PRI },
      body2:   { fontSize: '0.65rem', color: TEXT_SEC },
      caption: { fontSize: '0.6rem',  color: TEXT_SEC },
      button:  { fontSize: '0.68rem' },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: BG, color: TEXT_PRI, fontSize: '0.7rem' },
          '*, *::before, *::after': { boxSizing: 'border-box' },
        },
      },

      // ── Cards ──────────────────────────────────────────────
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            background: GLASS,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 16,
            border: `1px solid ${BORDER}`,
            boxShadow: neuGlass,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDark
                ? `8px 8px 20px rgba(0,0,0,0.4), -8px -8px 20px rgba(255,255,255,0.03)`
                : `8px 8px 20px rgba(0,0,0,0.1), -8px -8px 20px rgba(255,255,255,0.85)`,
            },
          },
        },
      },

      // ── Paper (chart panels, table containers, etc.) ───────
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            background: GLASS,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: `1px solid ${BORDER}`,
            boxShadow: neuGlass,
            borderRadius: 16,
          },
          outlined: {
            backgroundImage: 'none',
            background: GLASS_SM,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: `1px solid ${BORDER}`,
            boxShadow: neuGlassSm,
          },
        },
      },

      // ── Buttons ────────────────────────────────────────────
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 999,
            fontWeight: 600,
            fontSize: '0.68rem',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)' },
          },
          contained: {
            background: 'rgba(13,148,136,0.9)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            color: '#FFFFFF',
            border: '1px solid rgba(13,148,136,0.4)',
            boxShadow: `4px 4px 12px rgba(13,148,136,0.25), -2px -2px 8px rgba(255,255,255,0.5)`,
            '&:hover': {
              background: 'rgba(11,128,117,0.92)',
              boxShadow: `6px 6px 16px rgba(13,148,136,0.35), -2px -2px 8px rgba(255,255,255,0.6)`,
            },
          },
          outlined: {
            borderColor: 'rgba(0,0,0,0.1)',
            color: TEXT_PRI,
            background: GLASS_SM,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            boxShadow: neuGlassSm,
            '&:hover': {
              borderColor: ACCENT,
              color: ACCENT,
              background: GLASS,
              boxShadow: neuGlass,
            },
          },
          text: {
            color: TEXT_SEC,
            '&:hover': { color: ACCENT, background: 'rgba(13,148,136,0.05)' },
          },
        },
      },

      // ── Chips ──────────────────────────────────────────────
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.6rem',
            background: GLASS_SM,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: `1px solid ${BORDER}`,
            boxShadow: neuGlassSm,
          },
        },
      },

      // ── Table ──────────────────────────────────────────────
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-root': {
              background: 'rgba(255,255,255,0.4)',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              fontWeight: 700,
              color: TEXT_SEC,
              textTransform: 'uppercase',
              fontSize: '0.6rem',
              letterSpacing: '0.06em',
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background 0.15s ease',
            '&:hover': { background: 'rgba(255,255,255,0.5)' },
            '& .MuiTableCell-root': { borderBottom: '1px solid rgba(0,0,0,0.04)' },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { color: TEXT_PRI, padding: '10px 14px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`, fontSize: '0.68rem' },
        },
      },

      // ── Tabs ───────────────────────────────────────────────
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            color: TEXT_SEC,
            fontWeight: 600,
            fontSize: '0.68rem',
            transition: 'color 0.2s ease',
            '&.Mui-selected': { color: ACCENT, fontWeight: 700 },
            '&:hover': { color: ACCENT },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { backgroundColor: ACCENT, height: 3, borderRadius: 2 },
        },
      },

      // ── TextField ──────────────────────────────────────────
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              borderRadius: 12,
              boxShadow: neuInset,
              '& fieldset': { border: `1px solid ${BORDER}` },
              '&:hover fieldset': { borderColor: 'rgba(13,148,136,0.3)' },
              '&.Mui-focused fieldset': { borderColor: ACCENT, borderWidth: 2 },
            },
          },
        },
      },

      // ── Dialog ─────────────────────────────────────────────
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${BORDER}`,
            boxShadow: `12px 12px 32px rgba(0,0,0,0.1), -12px -12px 32px rgba(255,255,255,0.85)`,
            borderRadius: 20,
          },
        },
      },

      // ── AppBar ─────────────────────────────────────────────
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            background: isDark ? 'rgba(15,17,23,0.85)' : 'rgba(243,244,246,0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: TEXT_PRI,
            borderBottom: `1px solid ${BORDER}`,
            boxShadow: `0 2px 12px rgba(0,0,0,0.06)`,
          },
        },
      },

      // ── Misc ───────────────────────────────────────────────
      MuiDivider: {
        styleOverrides: { root: { borderColor: 'rgba(0,0,0,0.06)' } },
      },
      MuiStepLabel: {
        styleOverrides: {
          label: {
            color: TEXT_SEC,
            '&.Mui-active':    { color: ACCENT, fontWeight: 600 },
            '&.Mui-completed': { color: ACCENT },
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            color: 'rgba(0,0,0,0.15)',
            '&.Mui-active':    { color: ACCENT },
            '&.Mui-completed': { color: ACCENT },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.05)' },
          bar:  { background: `linear-gradient(90deg, ${ACCENT}, #2DD4BF)` },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            background: GLASS,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: `1px solid ${BORDER}`,
            boxShadow: neuGlassSm,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s ease',
            '&:hover': { color: ACCENT, background: 'rgba(13,148,136,0.06)' },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            background: 'rgba(17,24,39,0.85)',
            backdropFilter: 'blur(8px)',
            color: '#F9FAFB',
            fontSize: '0.6rem',
            borderRadius: 8,
          },
        },
      },
    },
  });
}
