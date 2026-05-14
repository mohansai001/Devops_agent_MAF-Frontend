import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Chip, useTheme, Button, Dialog, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';
import { getWorkflows, deleteWorkflow, startWorkflowExecution, fetchWorkflowsFromAPI, Workflow } from '../data/workflowStore';
import '../styles/Workflows.css';

interface TriggeredRecord {
  id: number;
  repo: string;
  branch: string;
  commit_sha: string;
  status: string;
}


export default function Workflows() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executeDialog, setExecuteDialog] = useState<{ open: boolean; workflow: Workflow | null }>({ open: false, workflow: null });
  const [selectedRepo, setSelectedRepo] = useState('');
  const [repositories, setRepositories] = useState<TriggeredRecord[]>([]);

  const containerClass = `workflows-container ${isDark ? 'dark-theme' : 'light-theme'}`;

  useEffect(() => {
    loadWorkflows();
    fetchRepositories();
  }, []);

  const loadWorkflows = async () => {
    const apiWorkflows = await fetchWorkflowsFromAPI();
    setWorkflows(apiWorkflows);
  };

  const fetchRepositories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sql/sql/get_all_triggered_records');
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      setRepositories([]);
    }
  };

  const handleDelete = (id: string) => {
    deleteWorkflow(id);
    setWorkflows(getWorkflows());
  };

  const handleExecute = (workflow: Workflow) => {
    setExecuteDialog({ open: true, workflow });
    setSelectedRepo('');
  };

  const handleConfirmExecute = async () => {
    if (executeDialog.workflow && selectedRepo) {
      const selectedRecord = repositories.find(r => r.repo === selectedRepo);
      if (selectedRecord) {
        startWorkflowExecution(executeDialog.workflow.id, selectedRepo, selectedRecord.id);
        setExecuteDialog({ open: false, workflow: null });
        navigate('/approvals');
      }
    }
  };

  return (
    <div className={containerClass}>
      <div className="workflows-content">
        <Typography variant="h5" className="workflows-title">
          Saved Workflows
        </Typography>

        {workflows.length === 0 ? (
          <Card className={`workflows-empty-card ${isDark ? 'dark-theme' : 'light-theme'}`}>
            <CardContent>
              <Typography className={`workflows-empty-text ${isDark ? 'dark-theme' : 'light-theme'}`}>
                No workflows saved yet. Create one in Agent Builder.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <div className="workflows-list">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className={`workflow-card ${isDark ? 'dark-theme' : 'light-theme'}`}>
                <CardContent>
                  <div className="workflow-header">
                    <div className="workflow-info">
                      <Typography className={`workflow-name ${isDark ? 'dark-theme' : 'light-theme'}`}>
                        {workflow.name}
                      </Typography>
                      <Typography className={`workflow-created ${isDark ? 'dark-theme' : 'light-theme'}`}>
                        Created: {workflow.createdAt}
                      </Typography>
                    </div>
                    <div className="workflow-actions">
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => handleExecute(workflow)}
                        className="execute-button"
                      >
                        Execute
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(workflow.id)}
                        className="delete-button"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>

                  <div className="workflow-agents">
                    <Typography className={`agents-label ${isDark ? 'dark-theme' : 'light-theme'}`}>
                      Agents ({workflow.agents.length}):
                    </Typography>
                    {workflow.agents.map((agent, idx) => (
                      <Chip
                        key={idx}
                        label={agent.label}
                        size="small"
                        className="agent-chip"
                        style={{
                          backgroundColor: 'rgba(5,150,105,0.07)',
                          color: '#059669',
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Execute Dialog */}
      <Dialog open={executeDialog.open} onClose={() => setExecuteDialog({ open: false, workflow: null })} maxWidth="sm" fullWidth>
        <DialogContent className="execute-dialog-content">
          <TextField
            select
            fullWidth
            label="Select Repository"
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="repo-select"
          >
            {repositories.map((record) => (
              <MenuItem key={record.id} value={record.repo}>
                {record.repo}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions className="execute-dialog-actions">
          <Button onClick={() => setExecuteDialog({ open: false, workflow: null })} className="cancel-button">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmExecute}
            variant="contained"
            disabled={!selectedRepo}
            className="confirm-execute-button"
          >
            Execute
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
