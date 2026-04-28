import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StatusChip from '../components/StatusChip';
import { builds } from '../data/mockData';

export default function Builds() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const branchCodeSx = isDark
    ? { bgcolor: 'rgba(94,234,212,0.08)', color: '#5eead4', border: '1px solid rgba(94,234,212,0.15)' }
    : { bgcolor: 'rgba(0,137,123,0.08)', color: '#00695c', border: '1px solid rgba(0,137,123,0.2)' };

  const workflowCodeSx = isDark
    ? { bgcolor: 'rgba(255,255,255,0.05)', color: '#8b949e' }
    : { bgcolor: 'rgba(0,0,0,0.05)', color: '#374151' };

  return (
    <Box>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Repository', 'Branch', 'Workflow', 'Status', 'Duration', 'Triggered At'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: 11, color: '#00897b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {builds.map((b) => (
                <TableRow key={b.id}>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{b.repo}</TableCell>
                  <TableCell>
                    <Box component="code" sx={{ px: 0.8, py: 0.3, borderRadius: 1, fontSize: 11, ...branchCodeSx }}>{b.branch}</Box>
                  </TableCell>
                  <TableCell>
                    <Box component="code" sx={{ px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11, ...workflowCodeSx }}>{b.workflow}</Box>
                  </TableCell>
                  <TableCell><StatusChip status={b.status} /></TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontSize: 12, fontFamily: 'monospace' }}>{b.duration}</TableCell>
                  <TableCell sx={{ fontSize: 11, color: theme.palette.text.secondary }}>{b.triggeredAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
