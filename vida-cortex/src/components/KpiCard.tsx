import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { SvgIconComponent } from '@mui/icons-material';

interface Props {
  title: string;
  value: number;
  icon: SvgIconComponent;
  color: string;
  bg: string;
}

export default function KpiCard({ title, value, icon: Icon, color, bg }: Props) {
  const theme = useTheme();
  return (
    <Card sx={{ flex: 1, minWidth: 140, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ bgcolor: bg, borderRadius: 2, p: 1.5, display: 'flex', border: `1px solid ${color}33` }}>
          <Icon sx={{ color, fontSize: 26 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: theme.palette.text.primary, lineHeight: 1 }}>{value}</Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>{title}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
