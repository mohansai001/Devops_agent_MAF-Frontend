import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StatusChip from '../components/StatusChip';
import { builds } from '../data/mockData';
import '../styles/Builds.css';

const ACCENT = '#FF4D1C';

const branchCodeSx  = { bgcolor: 'rgba(255,77,28,0.07)', color: ACCENT, px: 0.8, py: 0.3, borderRadius: 1, fontSize: 11 };
const workflowCodeSx = { bgcolor: 'rgba(0,0,0,0.05)', color: '#6B7280', px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11 };

export default function Builds() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const containerClass = `builds-container ${isDark ? 'dark-theme' : 'light-theme'}`;

  return (
    <div className={containerClass}>
      <div className="builds-header">
        <Typography variant="h4" className={`builds-title ${isDark ? 'dark-theme' : 'light-theme'}`}>
          Build <span className="builds-title-accent">History</span>
        </Typography>
        <Typography variant="body2" className={`builds-subtitle ${isDark ? 'dark-theme' : 'light-theme'}`}>
          CI workflow runs across all repositories
        </Typography>
      </div>

      <Card>
        <TableContainer className="builds-table-container">
          <Table className="builds-table">
            <TableHead className="table-header">
              <TableRow>
                {['Repository', 'Branch', 'Workflow', 'Status', 'Duration', 'Triggered At'].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {builds.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className={`table-cell-repo ${isDark ? 'dark-theme' : 'light-theme'}`}>{b.repo}</TableCell>
                  <TableCell><code className="branch-code">{b.branch}</code></TableCell>
                  <TableCell><code className={`workflow-code ${isDark ? 'dark-theme' : 'light-theme'}`}>{b.workflow}</code></TableCell>
                  <TableCell><StatusChip status={b.status} /></TableCell>
                  <TableCell className={`table-cell-duration ${isDark ? 'dark-theme' : 'light-theme'}`}>{b.duration}</TableCell>
                  <TableCell className={`table-cell-triggered ${isDark ? 'dark-theme' : 'light-theme'}`}>{b.triggeredAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
}
