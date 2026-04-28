import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Tab, Tabs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Link, Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import KpiCard from '../components/KpiCard';
import StatusChip from '../components/StatusChip';
import { pipelines } from '../data/mockData';

const kpis = [
  { title: 'Total Pipelines', value: 10, icon: AllInclusiveIcon, color: '#00897b', bg: 'rgba(0,137,123,0.1)' },
  { title: 'Queued',          value: 2,  icon: HourglassEmptyIcon, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { title: 'Running',         value: 3,  icon: PlayCircleIcon,     color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { title: 'Successful',      value: 4,  icon: CheckCircleIcon,    color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { title: 'Failed',          value: 1,  icon: CancelIcon,         color: '#ef4444', bg: 'rgba(239,68,68,0.1)'  },
];

const pieData = [
  { name: 'Success', value: 4 }, { name: 'Running', value: 3 },
  { name: 'Failed',  value: 1 }, { name: 'Queued',  value: 2 },
];
const PIE_COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b'];

const techData   = [{ name: 'Node.js', count: 3 }, { name: 'Python', count: 2 }, { name: 'Java', count: 2 }, { name: 'Go', count: 2 }];
const targetData = [{ name: 'AWS EKS', count: 4 }, { name: 'Azure AKS', count: 2 }, { name: 'GCP GKE', count: 2 }];
const successData = [{ name: 'Success', value: 4 }, { name: 'Failure', value: 1 }];

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const tooltipStyle = {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    color: theme.palette.text.primary,
  };
  const tickColor   = theme.palette.text.secondary;
  const gridColor   = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const codeTagSx   = isDark
    ? { bgcolor: 'rgba(94,234,212,0.08)', color: '#5eead4', border: '1px solid rgba(94,234,212,0.15)' }
    : { bgcolor: 'rgba(0,137,123,0.08)', color: '#00695c', border: '1px solid rgba(0,137,123,0.2)' };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {kpis.map((k) => <KpiCard key={k.title} {...k} />)}
      </Box>

      <Card>
        <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
            <Tab label="Pipelines" />
            <Tab label="Reports" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {tab === 0 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Repository', 'Branch', 'Tech Stack', 'Stage', 'Status', 'App Name', 'Deploy Target', 'Deployed URL', 'Timestamp'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: 11, color: '#00897b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pipelines.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{p.repo}</TableCell>
                      <TableCell>
                        <Box component="code" sx={{ px: 0.8, py: 0.3, borderRadius: 1, fontSize: 11, ...codeTagSx }}>{p.branch}</Box>
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>{p.techStack}</TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary, fontSize: 12 }}>{p.stage}</TableCell>
                      <TableCell><StatusChip status={p.status} /></TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>{p.appName}</TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>{p.deployTarget}</TableCell>
                      <TableCell>
                        {p.deployedUrl !== '-'
                          ? <Link href={p.deployedUrl} target="_blank" sx={{ fontSize: 12, color: '#00897b' }}>{p.deployedUrl}</Link>
                          : <Typography variant="caption" color="text.secondary">—</Typography>}
                      </TableCell>
                      <TableCell sx={{ fontSize: 11, color: theme.palette.text.secondary }}>{p.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tab === 1 && (
            <Box sx={{ p: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
              {[
                { title: 'Pipeline Status Distribution', chart: (
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: tickColor }}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                )},
                { title: 'Tech Stack Usage', chart: (
                  <BarChart data={techData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="#00897b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )},
                { title: 'Deploy Target Breakdown', chart: (
                  <BarChart data={targetData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )},
                { title: 'Success vs Failure', chart: (
                  <PieChart>
                    <Pie data={successData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: tickColor }}>
                      <Cell fill="#10b981" /><Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ color: tickColor, fontSize: 12 }} />
                  </PieChart>
                )},
              ].map(({ title, chart }) => (
                <Paper key={title} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa', border: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="caption" fontWeight={700} sx={{ color: '#00897b', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 2 }}>{title}</Typography>
                  <ResponsiveContainer width="100%" height={220}>{chart}</ResponsiveContainer>
                </Paper>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
