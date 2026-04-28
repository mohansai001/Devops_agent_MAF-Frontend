import { useState } from 'react';
import {
  Box, Card, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Snackbar, Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BugReportIcon from '@mui/icons-material/BugReport';
import { repositories } from '../data/mockData';

export default function Onboarding() {
  const [open, setOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://vida-cortex.io/webhook/');
  const [snack, setSnack] = useState('');
  const [selectedRepo, setSelectedRepo] = useState('');
  const theme = useTheme();

  const handleOnboard = (repoName: string) => { setSelectedRepo(repoName); setOpen(true); };
  const handleConfirm = () => { setOpen(false); setSnack(`Agent registered ${selectedRepo} — webhook configured, pipeline auto-detection active`); };
  const handleOnboardAll = () => setSnack('Agent registered all repositories — autonomous pipeline orchestration enabled');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Register repositories with the VIDA Agent to enable autonomous CI/CD orchestration
        </Typography>
        <Button variant="contained" startIcon={<SmartToyIcon />} onClick={handleOnboardAll}
          sx={{ bgcolor: '#00897b', '&:hover': { bgcolor: '#00796b' }, boxShadow: '0 0 20px rgba(0,137,123,0.3)' }}>
          Register All Repos
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Repository', 'Stars', 'Forks', 'Watchers', 'Open Issues', 'Last Updated', 'Action'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: 11, color: '#00897b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {repositories.map((repo) => (
                <TableRow key={repo.id}>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{repo.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: theme.palette.text.secondary }}>
                      <StarIcon sx={{ fontSize: 13, color: '#f59e0b' }} />{repo.stars}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: theme.palette.text.secondary }}>
                      <ForkRightIcon sx={{ fontSize: 13 }} />{repo.forks}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: theme.palette.text.secondary }}>
                      <VisibilityIcon sx={{ fontSize: 13 }} />{repo.watchers}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BugReportIcon sx={{ fontSize: 13, color: repo.openIssues > 0 ? '#ef4444' : theme.palette.text.secondary }} />
                      <Typography variant="caption" sx={{ color: repo.openIssues > 0 ? '#ef4444' : theme.palette.text.secondary }}>{repo.openIssues}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary, fontSize: 12 }}>{repo.lastUpdated}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" startIcon={<SmartToyIcon sx={{ fontSize: '14px !important' }} />} onClick={() => handleOnboard(repo.name)}
                      sx={{ borderColor: 'rgba(0,137,123,0.4)', color: '#00897b', fontSize: 11, '&:hover': { bgcolor: 'rgba(0,137,123,0.08)', borderColor: '#00897b' } }}>
                      Register
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon sx={{ color: '#00897b', fontSize: 20 }} />
          Register: {selectedRepo}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            The agent will configure this webhook to receive push events and autonomously trigger CI/CD pipelines.
          </Typography>
          <TextField fullWidth label="Webhook Endpoint" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} size="small" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleConfirm} sx={{ bgcolor: '#00897b', '&:hover': { bgcolor: '#00796b' } }}>Activate Agent</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={5000} onClose={() => setSnack('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" onClose={() => setSnack('')} icon={<SmartToyIcon fontSize="small" />}
          sx={{ bgcolor: 'rgba(0,137,123,0.12)', color: '#00695c', border: '1px solid rgba(0,137,123,0.3)', borderRadius: 2, '& .MuiAlert-icon': { color: '#00897b' } }}>
          {snack}
        </Alert>
      </Snackbar>
    </Box>
  );
}
