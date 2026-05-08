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
import { neuShadowSm } from '../data/theme';
import '../styles/Dashboard.css';

const ACCENT = '#FF4D1C';

const kpis = [
  { title: 'Total Pipelines', value: 10, icon: AllInclusiveIcon,   color: ACCENT,     bg: 'rgba(255,77,28,0.08)' },
  { title: 'Queued',          value: 2,  icon: HourglassEmptyIcon, color: '#D97706',  bg: 'rgba(245,158,11,0.08)' },
  { title: 'Running',         value: 3,  icon: PlayCircleIcon,     color: '#2563EB',  bg: 'rgba(59,130,246,0.08)' },
  { title: 'Successful',      value: 4,  icon: CheckCircleIcon,    color: '#059669',  bg: 'rgba(16,185,129,0.08)' },
  { title: 'Failed',          value: 1,  icon: CancelIcon,         color: '#DC2626',  bg: 'rgba(239,68,68,0.08)'  },
];

const pieData = [
  { name: 'Success', value: 4 }, { name: 'Running', value: 3 },
  { name: 'Failed',  value: 1 }, { name: 'Queued',  value: 2 },
];
const PIE_COLORS = ['#059669', '#2563EB', '#DC2626', '#D97706'];

const techData   = [{ name: 'Node.js', count: 3 }, { name: 'Python', count: 2 }, { name: 'Java', count: 2 }, { name: 'Go', count: 2 }];
const targetData = [{ name: 'AWS EKS', count: 4 }, { name: 'Azure AKS', count: 2 }, { name: 'GCP GKE', count: 2 }];
const successData = [{ name: 'Success', value: 4 }, { name: 'Failure', value: 1 }];

const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 8,
  color: '#111827',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
};
const tickColor = '#9CA3AF';
const gridColor = 'rgba(0,0,0,0.05)';

const codeTagSx = {
  bgcolor: 'rgba(255,77,28,0.07)',
  color: ACCENT,
  px: 0.8, py: 0.3,
  borderRadius: 1,
  fontSize: 11,
};

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const containerClass = `dashboard-container ${isDark ? 'dark-theme' : 'light-theme'}`;

  return (
    <div className={containerClass}>
      {/* Page heading */}
      <div className="dashboard-header">
        <Typography variant="h4" className={`dashboard-title ${isDark ? 'dark-theme' : 'light-theme'}`}>
          Pipeline <span className="dashboard-title-accent">Overview</span>
        </Typography>
        <Typography variant="body2" className={`dashboard-subtitle ${isDark ? 'dark-theme' : 'light-theme'}`}>
          Real-time status of all autonomous CI/CD pipelines
        </Typography>
      </div>

      {/* KPI row */}
      <div className="kpi-row">
        {kpis.map((k) => <KpiCard key={k.title} {...k} />)}
      </div>

      {/* Main card */}
      <Card>
        <div className="main-card-tabs" style={{ borderBottomColor: theme.palette.divider }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="Pipelines" />
            <Tab label="Reports" />
          </Tabs>
        </div>

        <CardContent className="main-card-content">
          {tab === 0 && (
            <TableContainer className="pipelines-table">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Repository', 'Branch', 'Tech Stack', 'Stage', 'Status', 'App Name', 'Deploy Target', 'Deployed URL', 'Timestamp'].map((h) => (
                      <TableCell key={h}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pipelines.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className={`table-cell-repo ${isDark ? 'dark-theme' : 'light-theme'}`}>{p.repo}</TableCell>
                      <TableCell>
                        <code className="branch-code">{p.branch}</code>
                      </TableCell>
                      <TableCell>{p.techStack}</TableCell>
                      <TableCell className={`table-cell-stage ${isDark ? 'dark-theme' : 'light-theme'}`}>{p.stage}</TableCell>
                      <TableCell><StatusChip status={p.status} /></TableCell>
                      <TableCell>{p.appName}</TableCell>
                      <TableCell>{p.deployTarget}</TableCell>
                      <TableCell>
                        {p.deployedUrl !== '-'
                          ? <Link href={p.deployedUrl} target="_blank" className="table-cell-url">{p.deployedUrl}</Link>
                          : <Typography variant="caption" className={`table-cell-empty ${isDark ? 'dark-theme' : 'light-theme'}`}>—</Typography>}
                      </TableCell>
                      <TableCell className={`table-cell-timestamp ${isDark ? 'dark-theme' : 'light-theme'}`}>{p.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tab === 1 && (
            <div className="reports-grid">
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
                    <Bar dataKey="count" fill={ACCENT} radius={[4, 4, 0, 0]} />
                  </BarChart>
                )},
                { title: 'Deploy Target Breakdown', chart: (
                  <BarChart data={targetData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )},
                { title: 'Success vs Failure', chart: (
                  <PieChart>
                    <Pie data={successData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: tickColor }}>
                      <Cell fill="#059669" /><Cell fill="#DC2626" />
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ color: tickColor, fontSize: 12 }} />
                  </PieChart>
                )},
              ].map(({ title, chart }) => (
                <Paper key={title} className="chart-paper" style={{ boxShadow: neuShadowSm }}>
                  <Typography variant="caption" className="chart-title">
                    {title}
                  </Typography>
                  <ResponsiveContainer className="chart-container">{chart}</ResponsiveContainer>
                </Paper>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
