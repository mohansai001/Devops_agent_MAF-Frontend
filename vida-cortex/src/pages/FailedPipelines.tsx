import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Collapse, Typography,
  Button, Chip, LinearProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { failedPipelines } from '../data/mockData';

function FailedRow({ item }: { item: typeof failedPipelines[0] }) {
  const [open, setOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(item.id <= 2);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleDeepAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 1800);
  };

  const workflowCodeSx = isDark
    ? { bgcolor: 'rgba(255,255,255,0.05)', color: '#8b949e' }
    : { bgcolor: 'rgba(0,0,0,0.05)', color: '#374151' };

  const branchCodeSx = isDark
    ? { bgcolor: 'rgba(94,234,212,0.08)', color: '#5eead4', border: '1px solid rgba(94,234,212,0.15)' }
    : { bgcolor: 'rgba(0,137,123,0.08)', color: '#00695c', border: '1px solid rgba(0,137,123,0.2)' };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: open ? 'none !important' : undefined } }}>
        <TableCell sx={{ width: 40, p: 0.5 }}>
          <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: theme.palette.text.secondary, '&:hover': { color: '#00897b' } }}>
            {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{item.repo}</TableCell>
        <TableCell><Box component="code" sx={{ px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11, ...workflowCodeSx }}>{item.workflow}</Box></TableCell>
        <TableCell><Box component="code" sx={{ px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11, ...branchCodeSx }}>{item.branch}</Box></TableCell>
        <TableCell>
          <Chip label={item.failedJob} size="small" sx={{ bgcolor: 'rgba(239,68,68,0.1)', color: isDark ? '#f87171' : '#b91c1c', border: '1px solid rgba(239,68,68,0.25)', fontWeight: 700, fontSize: 11 }} />
        </TableCell>
        <TableCell sx={{ fontSize: 11, color: theme.palette.text.secondary }}>{item.failedAt}</TableCell>
        <TableCell>
          <Button size="small" variant="outlined" startIcon={<PsychologyIcon sx={{ fontSize: '14px !important' }} />}
            onClick={() => { setOpen(true); if (!analyzed) handleDeepAnalyze(); }}
            sx={{ borderColor: 'rgba(139,92,246,0.4)', color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 11, '&:hover': { bgcolor: 'rgba(139,92,246,0.08)', borderColor: '#7c3aed' } }}>
            AI Analyze
          </Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ mx: 2, mb: 2, p: 2.5, bgcolor: isDark ? 'rgba(139,92,246,0.05)' : 'rgba(139,92,246,0.04)', borderRadius: 2, border: '1px solid rgba(139,92,246,0.2)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SmartToyIcon sx={{ color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? '#a78bfa' : '#7c3aed', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  VIDA Agent — Root Cause Analysis
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: 0.6, display: 'block', mb: 0.8 }}>Failure Reason</Typography>
                <Box sx={{ bgcolor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 1.5, p: 1.5 }}>
                  <Typography variant="body2" sx={{ color: isDark ? '#fca5a5' : '#991b1b', fontFamily: 'monospace', fontSize: 12 }}>{item.failureReason}</Typography>
                </Box>
              </Box>

              {analyzing && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: isDark ? '#a78bfa' : '#7c3aed', mb: 1, display: 'block' }}>Agent analyzing failure pattern...</Typography>
                  <LinearProgress sx={{ borderRadius: 1, bgcolor: 'rgba(139,92,246,0.15)', '& .MuiLinearProgress-bar': { bgcolor: isDark ? '#a78bfa' : '#7c3aed' } }} />
                </Box>
              )}

              {analyzed && (
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: 0.6, display: 'block', mb: 0.8 }}>Agent Suggested Fix</Typography>
                  <Box sx={{ bgcolor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 1.5, p: 1.5, display: 'flex', gap: 1 }}>
                    <AutoFixHighIcon sx={{ color: '#10b981', fontSize: 16, mt: 0.2, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: isDark ? '#6ee7b7' : '#065f46', fontSize: 12 }}>{item.suggestedFix}</Typography>
                  </Box>
                </Box>
              )}

              {!analyzed && !analyzing && (
                <Button variant="contained" size="small" startIcon={<PsychologyIcon />} onClick={handleDeepAnalyze}
                  sx={{ bgcolor: isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)', color: isDark ? '#a78bfa' : '#7c3aed', border: '1px solid rgba(139,92,246,0.4)', '&:hover': { bgcolor: 'rgba(139,92,246,0.25)' } }}>
                  Run Deep Analysis
                </Button>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function FailedPipelines() {
  return (
    <Box>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={40} />
                {['Repository', 'Workflow', 'Branch', 'Failed Job', 'Failed At', 'Actions'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: 11, color: '#00897b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {failedPipelines.map((item) => <FailedRow key={item.id} item={item} />)}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
