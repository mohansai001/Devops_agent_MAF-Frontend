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
import '../styles/Onboarding.css';

const ACCENT = '#FF4D1C';

export default function Onboarding() {
  const [open, setOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://vida-cortex.io/webhook/');
  const [snack, setSnack] = useState('');
  const [selectedRepo, setSelectedRepo] = useState('');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const containerClass = `onboarding-container ${isDark ? 'dark-theme' : 'light-theme'}`;

  const handleOnboard = (repoName: string) => { setSelectedRepo(repoName); setOpen(true); };
  const handleConfirm = () => { setOpen(false); setSnack(`Agent registered ${selectedRepo} — webhook configured, pipeline auto-detection active`); };
  const handleOnboardAll = () => setSnack('Agent registered all repositories — autonomous pipeline orchestration enabled');

  return (
    <div className={containerClass}>
      <div className="onboarding-header">
        <Typography variant="h4" className={`onboarding-title ${isDark ? 'dark-theme' : 'light-theme'}`}>
          Repository <span className="onboarding-title-accent">Onboarding</span>
        </Typography>
        <Typography variant="body2" className={`onboarding-subtitle ${isDark ? 'dark-theme' : 'light-theme'}`}>
          Register repositories with the VIDA Agent to enable autonomous CI/CD orchestration
        </Typography>
      </div>

      <div className="onboarding-actions">
        <Button variant="contained" startIcon={<SmartToyIcon />} onClick={handleOnboardAll} className="register-all-button">
          Register All Repos
        </Button>
      </div>

      <Card>
        <TableContainer className="onboarding-table-container">
          <Table className="onboarding-table">
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
                  <TableCell className={`table-cell-repo ${isDark ? 'dark-theme' : 'light-theme'}`}>{repo.name}</TableCell>
                  <TableCell>
                    <div className={`stat-container ${isDark ? 'dark-theme' : 'light-theme'}`}>
                      <StarIcon className="star-icon" />{repo.stars}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`stat-container ${isDark ? 'dark-theme' : 'light-theme'}`}>
                      <ForkRightIcon className="fork-icon" />{repo.forks}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`stat-container ${isDark ? 'dark-theme' : 'light-theme'}`}>
                      <VisibilityIcon className="visibility-icon" />{repo.watchers}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="stat-container">
                      <BugReportIcon className={`bug-icon ${repo.openIssues > 0 ? 'has-issues' : ''}`} />
                      <Typography variant="caption" className={`issues-text ${repo.openIssues > 0 ? 'has-issues' : ''} ${isDark ? 'dark-theme' : 'light-theme'}`}>{repo.openIssues}</Typography>
                    </div>
                  </TableCell>
                  <TableCell className={`table-cell-updated ${isDark ? 'dark-theme' : 'light-theme'}`}>{repo.lastUpdated}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" startIcon={<SmartToyIcon className="register-button-icon" />} onClick={() => handleOnboard(repo.name)} className="register-button">
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
        <DialogTitle className={`register-dialog-title ${isDark ? 'dark-theme' : 'light-theme'}`}>
          <SmartToyIcon className="dialog-agent-icon" />
          Register: {selectedRepo}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" className={`dialog-description ${isDark ? 'dark-theme' : 'light-theme'}`}>
            The agent will configure this webhook to receive push events and autonomously trigger CI/CD pipelines.
          </Typography>
          <TextField fullWidth label="Webhook Endpoint" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} size="small" className="webhook-field" />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setOpen(false)} className="cancel-button">Cancel</Button>
          <Button variant="contained" onClick={handleConfirm} className="activate-button">Activate Agent</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={5000} onClose={() => setSnack('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" onClose={() => setSnack('')} icon={<SmartToyIcon className="snackbar-icon" />}
          className="success-snackbar">
          {snack}
        </Alert>
      </Snackbar>
    </div>
  );
}
