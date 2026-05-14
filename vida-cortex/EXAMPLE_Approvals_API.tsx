// ========================================
// EXAMPLE: Approvals.tsx with API Integration & Real-time Updates
// ========================================

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useApi, usePolling } from '../hooks/useApi';
import { 
  fetchApprovals, 
  fetchApprovalById, 
  subscribeToOrchestrationUpdates 
} from '../services/pipelineService';

export default function Approvals() {
  const [searchParams] = useSearchParams();
  const approvalId = searchParams.get('id');

  // If specific approval ID is provided, fetch that one
  // Otherwise, fetch all approvals
  const { data, loading, error } = approvalId
    ? useApi(() => fetchApprovalById(Number(approvalId)))
    : usePolling(fetchApprovals, 5000); // Poll every 5 seconds

  // For real-time orchestration updates via WebSocket
  const [stageLogs, setStageLogs] = useState(data?.stageLogs || []);

  useEffect(() => {
    if (!approvalId || !data) return;

    // Subscribe to real-time updates
    const unsubscribe = subscribeToOrchestrationUpdates(
      Number(approvalId),
      (updatedLogs) => {
        setStageLogs(updatedLogs);
      }
    );

    // Cleanup on unmount
    return unsubscribe;
  }, [approvalId, data]);

  if (loading) return <Typography>Loading approvals...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;
  if (!data) return null;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Pipeline Approvals
      </Typography>

      {/* Your existing UI components */}
      {/* Pass stageLogs to LiveOrchestration component */}
      <LiveOrchestration stageLogs={stageLogs} repoName={data.repo} />
    </Box>
  );
}

function LiveOrchestration({ stageLogs, repoName }: { stageLogs: any[]; repoName: string }) {
  // Your existing LiveOrchestration component
  // Now it receives real-time stageLogs from WebSocket
  return <Box>{/* Your orchestration diagram */}</Box>;
}
