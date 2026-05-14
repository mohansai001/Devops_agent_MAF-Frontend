import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Chip, useTheme, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import BuildIcon from '@mui/icons-material/Build';
import StorageIcon from '@mui/icons-material/Storage';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GitHubIcon from '@mui/icons-material/GitHub';

import { saveWorkflow } from '../data/workflowStore';
import '../styles/AgentBuilder.css';


// Agent definitions
const AGENT_ICONS = [SearchIcon, BuildIcon, StorageIcon, RocketLaunchIcon, GitHubIcon];
const AGENT_COLORS = ['#7C3AED', '#2563EB', '#D97706', '#059669', '#374151'];
const AGENT_LABELS = [
  'Tech Detection', 'CI Pipeline', 'Terraform', 'CD Pipeline', 'GitHub Actions',
  'Security Scan', 'Docker Build', 'Helm Chart', 'Unit Tests', 'Integration Tests',
  'Lint', 'Code Coverage', 'Release', 'Notification', 'Cleanup',
  'Monitoring', 'Rollback', 'Approval', 'Infra Audit', 'Finalizer',
];
const AGENT_TASKS = [
  'Scanning repo & detecting runtime...', 'Running build, lint & unit tests...', 'Provisioning cloud infrastructure...',
  'Deploying to Kubernetes cluster...', 'Running post-deploy smoke tests...',
  'Security scanning...', 'Building Docker image...', 'Packaging Helm chart...', 'Running unit tests...', 'Running integration tests...',
  'Linting code...', 'Calculating coverage...', 'Creating release...', 'Sending notifications...', 'Cleaning up...',
  'Monitoring deployment...', 'Rolling back...', 'Awaiting approval...', 'Auditing infra...', 'Finalizing pipeline...'
];
const AGENT_SUCCESS = [
  'Stack detected ✓ Node.js v18', 'Build passed · 42/42 tests ✓', 'Infra provisioned ✓ EKS ready',
  'Deployed · 3/3 pods running ✓', 'All checks passed ✓ Live!',
  'No vulnerabilities found ✓', 'Image built ✓', 'Chart packaged ✓', 'All unit tests passed ✓', 'Integration tests passed ✓',
  'No lint errors ✓', 'Coverage 98% ✓', 'Release created ✓', 'Notifications sent ✓', 'Cleanup done ✓',
  'Monitoring active ✓', 'Rollback complete ✓', 'Approved ✓', 'Audit passed ✓', 'Pipeline finalized ✓',
];

// Create all available agents
const ALL_AGENTS = Array.from({ length: 20 }, (_, i) => ({
  id: `agent-${i}`,
  key: AGENT_LABELS[i],
  icon: AGENT_ICONS[i % AGENT_ICONS.length],
  color: AGENT_COLORS[i % AGENT_COLORS.length],
  label: AGENT_LABELS[i],
  task: AGENT_TASKS[i],
  success: AGENT_SUCCESS[i],
}));

interface Agent {
  id: string;
  key: string;
  icon: any;
  color: string;
  label: string;
  task: string;
  success: string;
  prompt?: string;
}

// Prompt Dialog Component
function PromptDialog({ 
  open, 
  onClose, 
  agent, 
  onSave 
}: { 
  open: boolean; 
  onClose: () => void; 
  agent: Agent | null; 
  onSave: (prompt: string) => void; 
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (agent) {
      setPrompt(agent.prompt || '');
    }
  }, [agent]);

  const handleSave = () => {
    onSave(prompt);
    onClose();
  };

  if (!agent) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: isDark ? '#e5e7eb' : '#111' }}>
        Configure Prompt for {agent.label}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 12, color: isDark ? '#9ca3af' : '#6b7280', mb: 1 }}>
            Default Task: {agent.task}
          </Typography>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Custom Prompt (Optional)"
          placeholder="Enter custom instructions for this agent..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          helperText="Leave empty to use default task, or provide custom instructions"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: isDark ? '#2a2a2a' : '#fff',
            },
            '& .MuiInputLabel-root': {
              color: isDark ? '#9ca3af' : '#6b7280',
            },
            '& .MuiOutlinedInput-input': {
              color: isDark ? '#e5e7eb' : '#111',
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save Prompt
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Agent Card Component
function AgentCard({ agent, onClick, showAdd = false }: { agent: Agent; onClick?: () => void; showAdd?: boolean }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const Icon = agent.icon;

  const cardClasses = `agent-card ${
    isDark ? 'dark-agent-card' : 'light-agent-card'
  }`;

  const iconContainerStyle = {
    backgroundColor: `${agent.color}18`
  };

  const addIconStyle = {
    backgroundColor: `${agent.color}20`,
    color: agent.color
  };

  return (
    <Card 
      onClick={onClick}
      className={cardClasses}
      style={{
        borderColor: isDark ? '#374151' : 'rgba(0,0,0,0.1)',
        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <CardContent className="agent-card-content">
        <div className="agent-card-inner">
          <div className="agent-card-icon-container" style={iconContainerStyle}>
            <Icon className="agent-card-icon" style={{ color: agent.color }} />
          </div>
          <div className="agent-card-text">
            <Typography className="agent-card-title" style={{ color: isDark ? '#e5e7eb' : '#111' }}>
              {agent.label}
            </Typography>
            <Typography className="agent-card-description" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              {agent.task.substring(0, 40)}...
            </Typography>
          </div>
          {showAdd && (
            <div className="add-icon-container" style={addIconStyle}>
              <AddIcon className="add-icon" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const WINDOW_SIZE = 5;

// Agents Flow with per-agent highlight + sliding window
function AgentsFlow({ selectedAgents }: { selectedAgents: Agent[] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [windowStart, setWindowStart] = useState(0);

  const total = selectedAgents.length;
  const visibleAgents = selectedAgents.slice(windowStart, windowStart + WINDOW_SIZE);

  return (
    <div>
      <div className="agents-flow-header">
        <Typography className="agents-flow-title" style={{ color: isDark ? '#e5e7eb' : '#111' }}>
          Agents Flow
        </Typography>
        <div className="flow-navigation">
          {total > WINDOW_SIZE && (
            <>
              <Button 
                size="small" 
                variant="outlined" 
                disabled={windowStart === 0}
                onClick={() => setWindowStart(w => Math.max(0, w - 1))}
                className="nav-button"
              >
                ◀
              </Button>
              <Typography className="nav-counter" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                {windowStart + 1}–{Math.min(windowStart + WINDOW_SIZE, total)} of {total}
              </Typography>
              <Button 
                size="small" 
                variant="outlined" 
                disabled={windowStart + WINDOW_SIZE >= total}
                onClick={() => setWindowStart(w => Math.min(total - WINDOW_SIZE, w + 1))}
                className="nav-button"
              >
                ▶
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="agents-container">
        {visibleAgents.map((agent, i) => {
          const globalIdx = windowStart + i;
          const Icon = agent.icon;
          const connectorColor = isDark ? '#4B5563' : '#D1D5DB';
          const borderColor = isDark ? '#374151' : 'rgba(0,0,0,0.1)';
          const bgColor = isDark ? '#2a2a2a' : '#fafafa';
          const labelColor = isDark ? '#9ca3af' : '#9CA3AF';
          
          return (
            <div key={agent.id} className="agent-flow-item">
              {i > 0 && (
                <div className="agent-connector">
                  <div className="connector-line" style={{ backgroundColor: connectorColor }} />
                  <div className="connector-arrow" style={{ borderLeftColor: `6px solid ${connectorColor}` }} />
                </div>
              )}
              <div 
                className="agent-flow-box"
                style={{
                  borderColor: borderColor,
                  backgroundColor: bgColor
                }}
              >
                <div className="agent-icon-container" style={{ backgroundColor: `${agent.color}20` }}>
                  <Icon className="agent-icon" style={{ color: agent.color }} />
                </div>
                <Typography className="agent-flow-label" style={{ color: agent.color }}>
                  {agent.label}
                </Typography>
                <div>
                  <Typography className="agent-step-label" style={{ color: labelColor }}>
                    Step {globalIdx + 1}
                  </Typography>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Main Agent Builder Component
export default function AgentBuilder() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [availableAgents, setAvailableAgents] = useState<Agent[]>(ALL_AGENTS);
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);
  const [promptDialog, setPromptDialog] = useState<{ open: boolean; agent: Agent | null }>({ open: false, agent: null });
  const [saveDialog, setSaveDialog] = useState(false);
  const [workflowName, setWorkflowName] = useState('');

  const colors = {
    bg: isDark ? '#0f0f0f' : '#f8fafc',
    cardBg: isDark ? '#1a1a1a' : '#fff',
    text: isDark ? '#e5e7eb' : '#111',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : 'rgba(0,0,0,0.1)',
  };

  const addAgent = (agent: Agent) => {
    setAvailableAgents(prev => prev.filter(a => a.id !== agent.id));
    setSelectedAgents(prev => [...prev, { ...agent, prompt: '' }]);
  };

  const removeAgent = (agentId: string) => {
    const agent = selectedAgents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgents(prev => prev.filter(a => a.id !== agentId));
      const { prompt, ...agentWithoutPrompt } = agent;
      setAvailableAgents(prev => [...prev, agentWithoutPrompt]);
    }
  };

  const openPromptDialog = (agent: Agent) => {
    setPromptDialog({ open: true, agent });
  };

  const closePromptDialog = () => {
    setPromptDialog({ open: false, agent: null });
  };

  const saveAgentPrompt = (prompt: string) => {
    if (promptDialog.agent) {
      console.log('--------------------------------------------');
      console.log('💬 SAVING AGENT PROMPT');
      console.log('--------------------------------------------');
      console.log('Agent:', promptDialog.agent.label);
      console.log('Agent ID:', promptDialog.agent.id);
      if (prompt && prompt.trim()) {
        console.log('✅ Custom Prompt:', prompt);
      } else {
        console.log('⚠️  Prompt cleared (will use default task)');
      }
      console.log('--------------------------------------------\n');

      setSelectedAgents(prev => 
        prev.map(agent => 
          agent.id === promptDialog.agent!.id 
            ? { ...agent, prompt }
            : agent
        )
      );
    }
  };

  const clearPipeline = () => {
    setAvailableAgents(ALL_AGENTS);
    setSelectedAgents([]);
  };

  const handleSaveWorkflow = () => {
    if (!workflowName.trim()) return;
    
    // Prepare workflow data with agent prompts
    const workflowData = {
      name: workflowName,
      agents: selectedAgents.map(a => ({
        id: a.id,
        label: a.label,
        color: a.color,
        task: a.task,
        prompt: a.prompt,
        success: a.success,
      })),
    };

    // 🔍 Print workflow details to console
    console.log('============================================');
    console.log('📝 SAVING WORKFLOW');
    console.log('============================================');
    console.log('Workflow Name:', workflowName);
    console.log('Total Agents:', selectedAgents.length);
    console.log('--------------------------------------------');
    
    // Print each agent with its prompt
    selectedAgents.forEach((agent, index) => {
      console.log(`\n🤖 Agent ${index + 1}: ${agent.label}`);
      console.log(`   ID: ${agent.id}`);
      console.log(`   Color: ${agent.color}`);
      console.log(`   Default Task: ${agent.task}`);
      if (agent.prompt && agent.prompt.trim()) {
        console.log(`   ✅ Custom Prompt: "${agent.prompt}"`);
      } else {
        console.log(`   ⚠️  No custom prompt (using default task)`);
      }
    });
    
    console.log('\n============================================');
    console.log('📦 Complete Workflow Data:');
    console.log(JSON.stringify(workflowData, null, 2));
    console.log('============================================\n');

    // Save the workflow
    saveWorkflow(workflowData);
    
    setSaveDialog(false);
    setWorkflowName('');
    navigate('/workflows');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.bg, p: 2, pt: 1 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Top bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, mb: 2 }}>
          {selectedAgents.length > 0 && (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => setSaveDialog(true)}
              sx={{ borderRadius: 999, boxShadow: 'none' }}
            >
              Save Workflow
            </Button>
          )}
          <Button variant="outlined" size="small" onClick={clearPipeline} sx={{ borderRadius: 999 }}>
            Clear All
          </Button>
        </Box>

        {/* Agents Flow */}
        {selectedAgents.length > 0 && (
          <Card sx={{ bgcolor: colors.cardBg, border: `1px solid ${colors.border}`, mb: 3 }}>
            <CardContent>
              <AgentsFlow selectedAgents={selectedAgents} />
            </CardContent>
          </Card>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, mb: 4 }}>
          {/* Available Agents */}
          <Card sx={{ bgcolor: colors.cardBg, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: colors.text, mb: 2 }}>
                Available Agents ({availableAgents.length})
              </Typography>
              
              <Box sx={{
                minHeight: 400,
                maxHeight: 600,
                overflowY: 'auto',
                p: 1,
                border: `2px dashed ${colors.border}`,
                borderRadius: 2,
              }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  {availableAgents.map((agent) => (
                    <AgentCard 
                      key={agent.id} 
                      agent={agent} 
                      onClick={() => addAgent(agent)}
                      showAdd={true}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Selected Pipeline */}
          <Card sx={{ bgcolor: colors.cardBg, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: colors.text, mb: 2 }}>
                Pipeline Sequence ({selectedAgents.length})
              </Typography>
              
              <Box sx={{
                minHeight: 400,
                maxHeight: 600,
                overflowY: 'auto',
                p: 1,
                border: `2px dashed ${colors.border}`,
                borderRadius: 2,
              }}>
                {selectedAgents.length === 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: 200,
                    color: colors.textSecondary,
                    fontStyle: 'italic'
                  }}>
                    Click agents to add them to your pipeline
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {selectedAgents.map((agent, index) => (
                      <Box key={agent.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ 
                          fontSize: 12, 
                          fontWeight: 700, 
                          color: colors.textSecondary,
                          minWidth: 24,
                          textAlign: 'center'
                        }}>
                          {index + 1}
                        </Typography>
                        <Box sx={{ flex: 1 }}>
                          <Card sx={{
                            bgcolor: isDark ? '#2a2a2a' : '#fff',
                            border: `2px solid ${isDark ? '#374151' : 'rgba(0,0,0,0.1)'}`,
                            borderRadius: 2,
                          }}>
                            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{
                                  width: 32, height: 32, borderRadius: '50%',
                                  bgcolor: `${agent.color}18`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                  <agent.icon sx={{ fontSize: 16, color: agent.color }} />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: isDark ? '#e5e7eb' : '#111', lineHeight: 1.2 }}>
                                    {agent.label}
                                  </Typography>
                                  <Typography sx={{ fontSize: 10, color: isDark ? '#9ca3af' : '#6b7280', lineHeight: 1.3, mt: 0.2 }}>
                                    {agent.prompt ? 'Custom prompt configured' : agent.task.substring(0, 40) + '...'}
                                  </Typography>
                                  {agent.prompt && (
                                    <Chip 
                                      label="Custom Prompt" 
                                      size="small" 
                                      sx={{ 
                                        mt: 0.5, 
                                        height: 16, 
                                        fontSize: 8, 
                                        bgcolor: `${agent.color}20`, 
                                        color: agent.color 
                                      }} 
                                    />
                                  )}
                                </Box>
                                <IconButton
                                  size="small"
                                  onClick={() => openPromptDialog(agent)}
                                  sx={{ color: agent.color }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => removeAgent(agent.id)}
                          sx={{ color: '#DC2626' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Prompt Dialog */}
        <PromptDialog
          open={promptDialog.open}
          onClose={closePromptDialog}
          agent={promptDialog.agent}
          onSave={saveAgentPrompt}
        />

        {/* Save Workflow Dialog */}
        <Dialog open={saveDialog} onClose={() => setSaveDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ color: isDark ? '#e5e7eb' : '#111' }}>Save Workflow</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              autoFocus
              label="Workflow Name"
              placeholder="e.g. My CI/CD Pipeline"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveWorkflow()}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialog(false)} sx={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Cancel</Button>
            <Button onClick={handleSaveWorkflow} variant="contained" disabled={!workflowName.trim()}
              startIcon={<SaveIcon />}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}