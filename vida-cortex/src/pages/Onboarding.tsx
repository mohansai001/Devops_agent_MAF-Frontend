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

const ACCENT = '#FF4D1C';

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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} color="#111827" letterSpacing="-0.02em">
          Repository <Box component="span" sx={{ color: ACCENT }}>Onboarding</Box>
        </Typography>
        <Typography variant="body2" color="#6B7280" mt={0.5}>
          Register repositories with the VIDA Agent to enable autonomous CI/CD orchestration
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<SmartToyIcon />} onClick={handleOnboardAll}>
          Register All Repos
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Repository', 'Stars', 'Forks', 'Watchers', 'Open Issues', 'Last Updated', 'Action'].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {repositories.map((repo) => (
                <TableRow key={repo.id}>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{repo.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: theme.palette.text.secondary }}>
                      <StarIcon sx={{ fontSize: 13, color: '#D97706' }} />{repo.stars}
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
                      <BugReportIcon sx={{ fontSize: 13, color: repo.openIssues > 0 ? '#DC2626' : theme.palette.text.secondary }} />
                      <Typography variant="caption" sx={{ color: repo.openIssues > 0 ? '#DC2626' : theme.palette.text.secondary }}>{repo.openIssues}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary, fontSize: 12 }}>{repo.lastUpdated}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" startIcon={<SmartToyIcon sx={{ fontSize: '14px !important' }} />} onClick={() => handleOnboard(repo.name)}>
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
          <SmartToyIcon sx={{ color: ACCENT, fontSize: 20 }} />
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
          <Button variant="contained" onClick={handleConfirm}>Activate Agent</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={5000} onClose={() => setSnack('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" onClose={() => setSnack('')} icon={<SmartToyIcon fontSize="small" />}
          sx={{ bgcolor: 'rgba(255,77,28,0.06)', color: ACCENT, border: '1px solid rgba(255,77,28,0.2)', borderRadius: 2, '& .MuiAlert-icon': { color: ACCENT } }}>
          {snack}
        </Alert>
      </Snackbar>
    </Box>
  );
}
