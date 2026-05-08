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
import '../styles/Repositories.css';

const ACCENT = '#FF4D1C';

const branchCodeSx = { bgcolor: 'rgba(255,77,28,0.06)', color: ACCENT, border: 'none', px: 0.7, py: 0.2, borderRadius: 1, fontSize: 10 };

export default function Repositories() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const filtered = repositories.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="repositories-container">
      <div className="repositories-header">
        <Typography variant="h4" className="repositories-title">
          Repository <span className="repositories-title-accent">Explorer</span>
        </Typography>
        <Typography variant="body2" className="repositories-subtitle">
          Browse and manage connected repositories
        </Typography>
      </div>

      <TextField
        placeholder="Search repositories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        className="repositories-search"
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon className="search-icon" /></InputAdornment>,
        }}
      />

      <div className="repositories-grid">
        {filtered.map((repo) => (
          <Card 
            key={repo.id} 
            onClick={() => navigate(`/approvals?repo=${encodeURIComponent(repo.name)}`)}
            className="repository-card"
            style={{ boxShadow: neuShadow }}
          >
            <CardContent>
              <div className="repo-header">
                <Typography variant="subtitle2" className="repo-name">{repo.name}</Typography>
                <Chip
                  icon={repo.visibility === 'Private'
                    ? <LockIcon className="visibility-icon" />
                    : <PublicIcon className="visibility-icon" />}
                  label={repo.visibility}
                  size="small"
                  className={`visibility-chip ${repo.visibility === 'Private' ? 'private' : 'public'}`}
                />
              </div>

              <div className="repo-meta">
                <div className="language-dot" style={{ backgroundColor: langColors[repo.language] ?? '#6b7280' }} />
                <Typography variant="caption" className="language-text">{repo.language}</Typography>
                <code className="branch-code">{repo.branch}</code>
              </div>

              <div className="repo-stats">
                <div className="stat-item">
                  <StarIcon className="star-icon" />
                  <Typography variant="caption" className="stat-text">{repo.stars}</Typography>
                </div>
                <div className="stat-item">
                  <ForkRightIcon className="fork-icon" />
                  <Typography variant="caption" className="stat-text">{repo.forks}</Typography>
                </div>
                <Typography variant="caption" className="last-updated">{repo.lastUpdated}</Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
