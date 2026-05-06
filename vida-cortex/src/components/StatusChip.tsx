import { Chip } from '@mui/material';

const colorMap: Record<string, { bg: string; color: string }> = {
  Success:  { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
  Running:  { bg: 'rgba(59,130,246,0.1)',  color: '#2563EB' },
  Failed:   { bg: 'rgba(239,68,68,0.1)',   color: '#DC2626' },
  Pending:  { bg: 'rgba(245,158,11,0.1)',  color: '#D97706' },
  Approved: { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
  Rejected: { bg: 'rgba(239,68,68,0.1)',   color: '#DC2626' },
  Queued:   { bg: 'rgba(139,92,246,0.1)',  color: '#7C3AED' },
};

export default function StatusChip({ status }: { status: string }) {
  const c = colorMap[status] ?? { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' };
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: c.bg,
        color: c.color,
        fontWeight: 700,
        fontSize: '0.72rem',
        border: 'none',
        boxShadow: '2px 2px 6px rgba(0,0,0,0.06), -2px -2px 6px rgba(255,255,255,0.7)',
        transition: 'all 0.2s ease',
        '&:hover': { transform: 'translateY(-1px)', boxShadow: '3px 3px 10px rgba(0,0,0,0.08), -3px -3px 10px rgba(255,255,255,0.8)' },
      }}
    />
  );
}
