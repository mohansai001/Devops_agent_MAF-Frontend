import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StatusChip from '../components/StatusChip';
import { deployments } from '../data/mockData';

export default function Deployments() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const envStyle: Record<string, { bg: string; color: string; border: string }> = {
    Production:  { bg: 'rgba(245,158,11,0.1)',  color: isDark ? '#fbbf24' : '#b45309', border: 'rgba(245,158,11,0.25)' },
    Staging:     { bg: 'rgba(59,130,246,0.1)',   color: isDark ? '#60a5fa' : '#1d4ed8', border: 'rgba(59,130,246,0.25)' },
    Development: { bg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: theme.palette.text.secondary, border: theme.palette.divider },
  };

  const regionCodeSx = isDark
    ? { bgcolor: 'rgba(255,255,255,0.05)', color: '#8b949e' }
    : { bgcolor: 'rgba(0,0,0,0.05)', color: '#374151' };

  return (
    <Box>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['App Name', 'Repository', 'Environment', 'Status', 'Deploy Target', 'Region', 'Deployed URL', 'Timestamp'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: 11, color: '#00897b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {deployments.map((d) => {
                const env = envStyle[d.environment] ?? envStyle.Development;
                return (
                  <TableRow key={d.id}>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{d.appName}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{d.repo}</TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ bgcolor: env.bg, color: env.color, border: `1px solid ${env.border}`, px: 1, py: 0.3, borderRadius: 1, fontWeight: 600 }}>
                        {d.environment}
                      </Typography>
                    </TableCell>
                    <TableCell><StatusChip status={d.status} /></TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{d.deployTarget}</TableCell>
                    <TableCell>
                      <Box component="code" sx={{ px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11, ...regionCodeSx }}>{d.region}</Box>
                    </TableCell>
                    <TableCell>
                      {d.deployedUrl !== '-'
                        ? <Link href={d.deployedUrl} target="_blank" sx={{ fontSize: 12, color: '#00897b' }}>{d.deployedUrl}</Link>
                        : <Typography variant="caption" color="text.secondary">—</Typography>}
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, color: theme.palette.text.secondary }}>{d.timestamp}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
