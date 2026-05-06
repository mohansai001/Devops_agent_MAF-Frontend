import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StatusChip from '../components/StatusChip';
import { builds } from '../data/mockData';

const ACCENT = '#FF4D1C';

const branchCodeSx  = { bgcolor: 'rgba(255,77,28,0.07)', color: ACCENT, px: 0.8, py: 0.3, borderRadius: 1, fontSize: 11 };
const workflowCodeSx = { bgcolor: 'rgba(0,0,0,0.05)', color: '#6B7280', px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11 };

export default function Builds() {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} color="#111827" letterSpacing="-0.02em">
          Build <Box component="span" sx={{ color: ACCENT }}>History</Box>
        </Typography>
        <Typography variant="body2" color="#6B7280" mt={0.5}>CI workflow runs across all repositories</Typography>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Repository', 'Branch', 'Workflow', 'Status', 'Duration', 'Triggered At'].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {builds.map((b) => (
                <TableRow key={b.id}>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{b.repo}</TableCell>
                  <TableCell><Box component="code" sx={branchCodeSx}>{b.branch}</Box></TableCell>
                  <TableCell><Box component="code" sx={workflowCodeSx}>{b.workflow}</Box></TableCell>
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
