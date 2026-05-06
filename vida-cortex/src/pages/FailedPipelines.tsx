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

const ACCENT = '#FF4D1C';

function FailedRow({ item }: { item: typeof failedPipelines[0] }) {
  const [open, setOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(item.id <= 2);
  const theme = useTheme();

  const branchCodeSx   = { bgcolor: 'rgba(255,77,28,0.07)', color: ACCENT, px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11 };
  const workflowCodeSx = { bgcolor: 'rgba(0,0,0,0.05)', color: '#6B7280', px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11 };

  const handleDeepAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 1800);
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: open ? 'none !important' : undefined } }}>
        <TableCell sx={{ width: 40, p: 0.5 }}>
          <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: theme.palette.text.secondary }}>
            {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{item.repo}</TableCell>
        <TableCell><Box component="code" sx={workflowCodeSx}>{item.workflow}</Box></TableCell>
        <TableCell><Box component="code" sx={branchCodeSx}>{item.branch}</Box></TableCell>
        <TableCell>
          <Chip label={item.failedJob} size="small" sx={{ bgcolor: 'rgba(220,38,38,0.08)', color: '#DC2626', fontWeight: 700, fontSize: 11, border: 'none', boxShadow: '2px 2px 6px rgba(0,0,0,0.06), -2px -2px 6px rgba(255,255,255,0.7)' }} />
        </TableCell>
        <TableCell sx={{ fontSize: 11, color: theme.palette.text.secondary }}>{item.failedAt}</TableCell>
        <TableCell>
          <Button size="small" variant="outlined" startIcon={<PsychologyIcon sx={{ fontSize: '14px !important' }} />}
            onClick={() => { setOpen(true); if (!analyzed) handleDeepAnalyze(); }}
            sx={{ borderColor: 'rgba(124,58,237,0.3)', color: '#7C3AED', fontSize: 11, '&:hover': { bgcolor: 'rgba(124,58,237,0.06)', borderColor: '#7C3AED' } }}>
            AI Analyze
          </Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ mx: 2, mb: 2, p: 2.5, bgcolor: 'rgba(124,58,237,0.04)', borderRadius: 2, border: '1px solid rgba(124,58,237,0.15)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SmartToyIcon sx={{ color: '#7C3AED', fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  VIDA Agent — Root Cause Analysis
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: 0.6, display: 'block', mb: 0.8 }}>
                  Failure Reason
                </Typography>
                <Box sx={{ bgcolor: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 1.5, p: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#991b1b', fontFamily: 'monospace', fontSize: 12 }}>{item.failureReason}</Typography>
                </Box>
              </Box>

              {analyzing && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#7C3AED', mb: 1, display: 'block' }}>Agent analyzing failure pattern...</Typography>
                  <LinearProgress sx={{ borderRadius: 1, bgcolor: 'rgba(124,58,237,0.1)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #7C3AED, #2563EB)' } }} />
                </Box>
              )}

              {analyzed && (
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: 0.6, display: 'block', mb: 0.8 }}>
                    Agent Suggested Fix
                  </Typography>
                  <Box sx={{ bgcolor: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: 1.5, p: 1.5, display: 'flex', gap: 1 }}>
                    <AutoFixHighIcon sx={{ color: '#059669', fontSize: 16, mt: 0.2, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: '#065f46', fontSize: 12 }}>{item.suggestedFix}</Typography>
                  </Box>
                </Box>
              )}

              {!analyzed && !analyzing && (
                <Button variant="contained" size="small" startIcon={<PsychologyIcon />} onClick={handleDeepAnalyze}
                  sx={{ bgcolor: '#7C3AED', '&:hover': { bgcolor: '#6D28D9' } }}>
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} color="#111827" letterSpacing="-0.02em">
          Failed <Box component="span" sx={{ color: ACCENT }}>Pipelines</Box>
        </Typography>
        <Typography variant="body2" color="#6B7280" mt={0.5}>AI-powered root cause analysis for failed CI/CD runs</Typography>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={40} />
                {['Repository', 'Workflow', 'Branch', 'Failed Job', 'Failed At', 'Actions'].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
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
