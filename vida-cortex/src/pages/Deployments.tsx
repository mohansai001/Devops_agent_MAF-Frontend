import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StatusChip from '../components/StatusChip';
import { deployments } from '../data/mockData';
import '../styles/Deployments.css';


const envStyle: Record<string, { bg: string; color: string }> = {
  Production:  { bg: 'rgba(245,158,11,0.1)',  color: '#D97706' },
  Staging:     { bg: 'rgba(59,130,246,0.1)',  color: '#2563EB' },
  Development: { bg: 'rgba(107,114,128,0.08)', color: '#6B7280' },
};


export default function Deployments() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const containerClass = `deployments-container ${isDark ? 'dark-theme' : 'light-theme'}`;

  return (
    <div className={containerClass}>
      <div className="deployments-header">
        <Typography variant="h4" className={`deployments-title ${isDark ? 'dark-theme' : 'light-theme'}`}>
          Deployment <span className="deployments-title-accent">Tracker</span>
        </Typography>
        <Typography variant="body2" className={`deployments-subtitle ${isDark ? 'dark-theme' : 'light-theme'}`}>
          Live deployment status across all environments
        </Typography>
      </div>

      <Card>
        <TableContainer className="deployments-table-container">
          <Table className="deployments-table">
            <TableHead>
              <TableRow>
                {['App Name', 'Repository', 'Environment', 'Status', 'Deploy Target', 'Region', 'Deployed URL', 'Timestamp'].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {deployments.map((d) => {
                return (
                  <TableRow key={d.id}>
                    <TableCell className={`table-cell-app ${isDark ? 'dark-theme' : 'light-theme'}`}>{d.appName}</TableCell>
                    <TableCell className={`table-cell-repo ${isDark ? 'dark-theme' : 'light-theme'}`}>{d.repo}</TableCell>
                    <TableCell>
                      <Typography 
                        variant="caption" 
                        className={`env-badge env-${d.environment.toLowerCase()}`}
                      >
                        {d.environment}
                      </Typography>
                    </TableCell>
                    <TableCell><StatusChip status={d.status} /></TableCell>
                    <TableCell className={`table-cell-target ${isDark ? 'dark-theme' : 'light-theme'}`}>{d.deployTarget}</TableCell>
                    <TableCell><code className={`region-code ${isDark ? 'dark-theme' : 'light-theme'}`}>{d.region}</code></TableCell>
                    <TableCell>
                      {d.deployedUrl !== '-'
                        ? <Link href={d.deployedUrl} target="_blank" className="table-cell-url">{d.deployedUrl}</Link>
                        : <Typography variant="caption" className={`table-cell-empty ${isDark ? 'dark-theme' : 'light-theme'}`}>—</Typography>}
                    </TableCell>
                    <TableCell className={`table-cell-timestamp ${isDark ? 'dark-theme' : 'light-theme'}`}>{d.timestamp}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
}
