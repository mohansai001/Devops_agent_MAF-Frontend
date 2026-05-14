// ========================================
// EXAMPLE: Dashboard.tsx with API Integration
// ========================================

import { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import KpiCard from '../components/KpiCard';
import { useApi, usePolling } from '../hooks/useApi';
import { fetchPipelines } from '../services/pipelineService';

export default function Dashboard() {
  // Option 1: Fetch once on mount
  const { data: pipelines, loading, error, refetch } = useApi(fetchPipelines);

  // Option 2: Auto-refresh every 10 seconds (for real-time updates)
  // const { data: pipelines, loading, error } = usePolling(fetchPipelines, 10000);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;
  if (!pipelines) return null;

  // Calculate KPIs from real data
  const successCount = pipelines.filter(p => p.status === 'Success').length;
  const runningCount = pipelines.filter(p => p.status === 'Running').length;
  const failedCount = pipelines.filter(p => p.status === 'Failed').length;
  const totalCount = pipelines.length;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <KpiCard
            title="Total Pipelines"
            value={totalCount.toString()}
            trend="+12%"
            trendUp={true}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard
            title="Successful"
            value={successCount.toString()}
            trend="+8%"
            trendUp={true}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard
            title="Running"
            value={runningCount.toString()}
            trend="Active"
            trendUp={true}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard
            title="Failed"
            value={failedCount.toString()}
            trend="-3%"
            trendUp={false}
          />
        </Grid>
      </Grid>

      {/* Rest of your dashboard UI */}
    </Box>
  );
}
