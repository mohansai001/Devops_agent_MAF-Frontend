import { Chip } from '@mui/material';

const colorMap: Record<string, { bg: string; color: string; border: string }> = {
  Success:  { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', border: 'rgba(52,211,153,0.3)' },
  Running:  { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
  Failed:   { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', border: 'rgba(248,113,113,0.3)' },
  Pending:  { bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  Approved: { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', border: 'rgba(52,211,153,0.3)' },
  Rejected: { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', border: 'rgba(248,113,113,0.3)' },
  Queued:   { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa', border: 'rgba(167,139,250,0.3)' },
};

export default function StatusChip({ status }: { status: string }) {
  const c = colorMap[status] ?? { bg: 'rgba(255,255,255,0.08)', color: '#8b949e', border: 'rgba(255,255,255,0.1)' };
  return (
    <Chip
      label={status}
      size="small"
      sx={{ bgcolor: c.bg, color: c.color, border: `1px solid ${c.border}`, fontWeight: 700 }}
    />
  );
}
