import { Card, CardContent, Typography, Box } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import { neuShadow } from '../data/theme';

interface Props {
  title: string;
  value: number;
  icon: SvgIconComponent;
  color: string;
  bg: string;
}

export default function KpiCard({ title, value, icon: Icon, color, bg }: Props) {
  return (
    <Card sx={{ flex: 1, minWidth: 140, cursor: 'default', boxShadow: neuShadow }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '20px !important' }}>
        <Box sx={{
          bgcolor: bg,
          borderRadius: 3,
          p: 1.5,
          display: 'flex',
          boxShadow: '3px 3px 10px rgba(0,0,0,0.08), -3px -3px 10px rgba(255,255,255,0.7)',
        }}>
          <Icon sx={{ color, fontSize: 26 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#111827', lineHeight: 1, fontSize: '1.75rem' }}>
            {value}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 500, fontSize: '0.75rem' }}>
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
