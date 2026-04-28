import { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, InputAdornment, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import { repositories, langColors } from '../data/mockData';

export default function Repositories() {
  const [search, setSearch] = useState('');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const filtered = repositories.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  const branchCodeSx = isDark
    ? { bgcolor: 'rgba(94,234,212,0.06)', color: '#5eead4', border: '1px solid rgba(94,234,212,0.12)' }
    : { bgcolor: 'rgba(0,137,123,0.07)', color: '#00695c', border: '1px solid rgba(0,137,123,0.18)' };

  return (
    <Box>
      <TextField
        placeholder="Search repositories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 3, width: 320 }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 18 }} /></InputAdornment>,
        }}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
        {filtered.map((repo) => (
          <Card key={repo.id} sx={{ cursor: 'pointer', transition: 'all 0.2s', '&:hover': { border: '1px solid rgba(0,137,123,0.4)', boxShadow: '0 0 20px rgba(0,137,123,0.1)', transform: 'translateY(-2px)' } }}>
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
                    bgcolor: repo.visibility === 'Private' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
                    color: repo.visibility === 'Private' ? '#d97706' : '#2563eb',
                    border: `1px solid ${repo.visibility === 'Private' ? 'rgba(217,119,6,0.25)' : 'rgba(37,99,235,0.25)'}`,
                    fontSize: 10,
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: langColors[repo.language] ?? '#6b7280', boxShadow: isDark ? `0 0 6px ${langColors[repo.language] ?? '#6b7280'}` : 'none' }} />
                <Typography variant="caption" color="text.secondary">{repo.language}</Typography>
                <Box component="code" sx={{ ml: 1, px: 0.7, py: 0.2, borderRadius: 1, fontSize: 10, ...branchCodeSx }}>{repo.branch}</Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <StarIcon sx={{ fontSize: 13, color: '#f59e0b' }} />
                  <Typography variant="caption" color="text.secondary">{repo.stars}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <ForkRightIcon sx={{ fontSize: 13, color: theme.palette.text.secondary }} />
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
