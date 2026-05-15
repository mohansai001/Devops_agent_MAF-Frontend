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
      console.log('📡 Fetched repositories from API:', data);
      console.log('📋 Repository IDs:', data.map((r: any) => ({ repo: r.repo, id: r.id })));
      
      // 🔍 Check for duplicate IDs
      const ids = data.map((r: any) => r.id);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.warn('⚠️⚠️⚠️ WARNING: DUPLICATE IDs DETECTED! ⚠️⚠️⚠️');
        console.warn('All repositories have the same ID. This is a BACKEND DATABASE ISSUE.');
        console.warn('Total repositories:', ids.length);
        console.warn('Unique IDs:', uniqueIds.size);
        console.warn('The ID value is:', Array.from(uniqueIds)[0]);
        console.warn('Expected: Each repository should have a unique ID (1, 2, 3, 4, ...)');
        console.warn('Actual: All repositories have ID:', Array.from(uniqueIds)[0]);
        console.warn('\n🛠️ BACKEND FIX NEEDED:');
        console.warn('Check your database query in get_all_triggered_records endpoint');
        console.warn('Make sure it returns the correct unique ID for each record.');
      }
      
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
      // selectedRepo now contains the record ID (as string)
      const selectedRecord = repositories.find(r => r.id.toString() === selectedRepo);
      if (selectedRecord) {
        console.log('🚀 Executing workflow:', executeDialog.workflow.name);
        console.log('📦 Selected repository:', selectedRecord.repo);
        console.log('🔢 Record ID from API:', selectedRecord.id);
        console.log('➡️ Will call: http://127.0.0.1:8000/agents/agent/' + selectedRecord.id);
        
        startWorkflowExecution(executeDialog.workflow.id, selectedRecord.repo, selectedRecord.id);
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
            label="Select Repository Record"
            value={selectedRepo}
            onChange={(e) => {
              const recordId = e.target.value;
              setSelectedRepo(recordId);
              
              // 🔍 Log selected repository details
              const selectedRecord = repositories.find(r => r.id.toString() === recordId);
              if (selectedRecord) {
                console.log('============================================');
                console.log('📦 REPOSITORY SELECTED');
                console.log('============================================');
                console.log('Repository Name:', selectedRecord.repo);
                console.log('Record ID:', selectedRecord.id);
                console.log('Full Record:', selectedRecord);
                console.log('============================================\n');
              }
            }}
            className="repo-select"
          >
            {repositories.map((record) => (
              <MenuItem key={record.id} value={record.id.toString()}>
                ID: {record.id} - {record.repo}
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
