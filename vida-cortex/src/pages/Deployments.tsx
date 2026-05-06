import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StatusChip from '../components/StatusChip';
import { deployments } from '../data/mockData';

const ACCENT = '#FF4D1C';

const envStyle: Record<string, { bg: string; color: string }> = {
  Production:  { bg: 'rgba(245,158,11,0.1)',  color: '#D97706' },
  Staging:     { bg: 'rgba(59,130,246,0.1)',  color: '#2563EB' },
  Development: { bg: 'rgba(107,114,128,0.08)', color: '#6B7280' },
};

const regionCodeSx = { bgcolor: 'rgba(0,0,0,0.05)', color: '#6B7280', px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11 };

export default function Deployments() {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} color="#111827" letterSpacing="-0.02em">
          Deployment <Box component="span" sx={{ color: ACCENT }}>Tracker</Box>
        </Typography>
        <Typography variant="body2" color="#6B7280" mt={0.5}>Live deployment status across all environments</Typography>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['App Name', 'Repository', 'Environment', 'Status', 'Deploy Target', 'Region', 'Deployed URL', 'Timestamp'].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
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
                      <Typography variant="caption" sx={{ bgcolor: env.bg, color: env.color, px: 1, py: 0.3, borderRadius: 1, fontWeight: 600 }}>
                        {d.environment}
                      </Typography>
                    </TableCell>
                    <TableCell><StatusChip status={d.status} /></TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{d.deployTarget}</TableCell>
                    <TableCell><Box component="code" sx={regionCodeSx}>{d.region}</Box></TableCell>
                    <TableCell>
                      {d.deployedUrl !== '-'
                        ? <Link href={d.deployedUrl} target="_blank" sx={{ fontSize: 12, color: ACCENT }}>{d.deployedUrl}</Link>
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
