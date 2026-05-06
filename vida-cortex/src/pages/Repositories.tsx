import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, InputAdornment, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import { repositories, langColors } from '../data/mockData';
import { neuShadow } from '../data/theme';

const ACCENT = '#FF4D1C';

const branchCodeSx = { bgcolor: 'rgba(255,77,28,0.06)', color: ACCENT, border: 'none', px: 0.7, py: 0.2, borderRadius: 1, fontSize: 10 };

export default function Repositories() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const filtered = repositories.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} color="#111827" letterSpacing="-0.02em">
          Repository <Box component="span" sx={{ color: ACCENT }}>Explorer</Box>
        </Typography>
        <Typography variant="body2" color="#6B7280" mt={0.5}>Browse and manage connected repositories</Typography>
      </Box>

      <TextField
        placeholder="Search repositories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 3, width: 320 }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#9CA3AF', fontSize: 18 }} /></InputAdornment>,
        }}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
        {filtered.map((repo) => (
          <Card key={repo.id} onClick={() => navigate(`/approvals?repo=${encodeURIComponent(repo.name)}`)} sx={{ cursor: 'pointer', boxShadow: neuShadow, '&:hover': { boxShadow: `10px 10px 24px rgba(0,0,0,0.1), -10px -10px 24px rgba(255,255,255,0.85)` } }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.primary">{repo.name}</Typography>
                <Chip
                  icon={repo.visibility === 'Private'
                    ? <LockIcon sx={{ fontSize: '12px !important', color: 'inherit !important' }} />
                    : <PublicIcon sx={{ fontSize: '12px !important', color: 'inherit !important' }} />}
                  label={repo.visibility}
                  size="small"
                  sx={{
                    bgcolor: repo.visibility === 'Private' ? 'rgba(245,158,11,0.1)' : 'rgba(255,77,28,0.08)',
                    color: repo.visibility === 'Private' ? '#D97706' : ACCENT,
                    fontSize: 10, border: 'none',
                    boxShadow: '2px 2px 6px rgba(0,0,0,0.06), -2px -2px 6px rgba(255,255,255,0.7)',
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: langColors[repo.language] ?? '#6b7280' }} />
                <Typography variant="caption" color="text.secondary">{repo.language}</Typography>
                <Box component="code" sx={{ ml: 1, ...branchCodeSx }}>{repo.branch}</Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <StarIcon sx={{ fontSize: 13, color: '#D97706' }} />
                  <Typography variant="caption" color="text.secondary">{repo.stars}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <ForkRightIcon sx={{ fontSize: 13, color: '#6B7280' }} />
                  <Typography variant="caption" color="text.secondary">{repo.forks}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', fontSize: 10 }}>{repo.lastUpdated}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
