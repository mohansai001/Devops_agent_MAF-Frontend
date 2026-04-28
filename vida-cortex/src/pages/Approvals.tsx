import {
  Box, Card, CardContent, Typography,
  Stepper, Step, StepLabel, Divider, LinearProgress, Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StatusChip from '../components/StatusChip';
import { approvals } from '../data/mockData';

const stages = ['Tech Detection', 'CI Pipeline', 'Terraform', 'CD Pipeline', 'GitHub Actions'];

export default function AgentQueue() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const branchCodeSx = isDark
    ? { bgcolor: 'rgba(94,234,212,0.08)', color: '#5eead4', border: '1px solid rgba(94,234,212,0.15)' }
    : { bgcolor: 'rgba(0,137,123,0.08)', color: '#00695c', border: '1px solid rgba(0,137,123,0.2)' };

  const shaCodeSx = isDark
    ? { bgcolor: 'rgba(255,255,255,0.05)', color: '#8b949e' }
    : { bgcolor: 'rgba(0,0,0,0.05)', color: '#4b5563' };

  const logBg   = isDark ? '#0d1117' : '#1e2530';
  const logBorder = isDark ? 'rgba(0,137,123,0.2)' : 'rgba(0,137,123,0.3)';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Agent banner */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: 2, bgcolor: 'rgba(0,137,123,0.08)', border: '1px solid rgba(0,137,123,0.2)' }}>
        <SmartToyIcon sx={{ color: '#00897b', fontSize: 20 }} />
        <Typography variant="body2" sx={{ color: '#00897b', fontWeight: 600 }}>
          VIDA Agent is autonomously processing all pipelines — no human intervention required
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>AGENT ONLINE</Typography>
        </Box>
      </Box>

      {approvals.map((item) => (
        <Card key={item.id}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary">{item.repo}</Typography>
                <Box component="code" sx={{ px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11, ...branchCodeSx }}>{item.branch}</Box>
                <Box component="code" sx={{ px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11, ...shaCodeSx }}>{item.commitSha}</Box>
              </Box>
              <StatusChip status={item.status} />
            </Box>

            {item.status === 'Running' && (
              <LinearProgress variant="indeterminate" sx={{ mb: 2, borderRadius: 1, bgcolor: 'rgba(0,137,123,0.15)', '& .MuiLinearProgress-bar': { bgcolor: '#00897b' } }} />
            )}

            <Stepper activeStep={item.activeStep} sx={{ mb: 2 }}>
              {stages.map((s) => (
                <Step key={s}><StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: 11 } }}>{s}</StepLabel></Step>
              ))}
            </Stepper>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="caption" sx={{ fontWeight: 700, color: '#00897b', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
              Agent Execution Log
            </Typography>
            <Box sx={{ bgcolor: logBg, borderRadius: 2, p: 2, maxHeight: 130, overflowY: 'auto', border: `1px solid ${logBorder}`, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#374151', borderRadius: 2 } }}>
              {item.logs.map((log, i) => (
                <Typography key={i} component="div" sx={{ color: i === item.logs.length - 1 ? '#5eead4' : '#6b7280', fontSize: 11, fontFamily: 'monospace', mb: 0.3, display: 'flex', gap: 1 }}>
                  <Box component="span" sx={{ color: '#374151', userSelect: 'none' }}>›</Box>
                  {log}
                </Typography>
              ))}
            </Box>

            {item.deployedUrl && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Deployed Endpoint:</Typography>
                <Button size="small" endIcon={<OpenInNewIcon sx={{ fontSize: '12px !important' }} />} href={item.deployedUrl} target="_blank"
                  sx={{ color: '#00897b', fontSize: 12, p: 0, minWidth: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                  {item.deployedUrl}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
