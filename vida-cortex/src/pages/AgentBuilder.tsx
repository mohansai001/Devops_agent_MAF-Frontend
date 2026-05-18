import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Box, Typography, Button, useTheme, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
function PromptDialog({ open, onClose, agent, onSave }: { open: boolean; onClose: () => void; agent: Agent | null; onSave: (prompt: string) => void; }) {
  const [prompt, setPrompt] = useState(agent?.prompt || '');
  useEffect(() => {
    setPrompt(agent?.prompt || '');
  }, [agent]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Agent Prompt</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Configure a custom prompt for <b>{agent?.label}</b> (optional):
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder={agent?.task}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => { onSave(prompt); onClose(); }} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

// Main Agent Builder Component
export default function AgentBuilder() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);
  const [promptDialog, setPromptDialog] = useState<{ open: boolean; agent: Agent | null }>({ open: false, agent: null });
  const [saveDialog, setSaveDialog] = useState(false);
  const [masterPromptDialog, setMasterPromptDialog] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [loadingAgents, setLoadingAgents] = useState(true);

  // ✅ Fetch available agents from API on component mount
  useEffect(() => {
    fetchAvailableAgents();
  }, []);

  const fetchAvailableAgents = async () => {
    setLoadingAgents(true);
    try {
      console.log('📡 Fetching available agents from API...');
      const response = await fetch('http://127.0.0.1:8000/sql/sql/get_available_agents');
      const data = await response.json();
      console.log('✓ Received agents:', data);

      // Transform API data to Agent format
      const transformedAgents = data.map((apiAgent: any, index: number) => ({
        id: `agent-${apiAgent.id}`,
        key: apiAgent.agent_name,
        icon: AGENT_ICONS[index % AGENT_ICONS.length],
        color: AGENT_COLORS[index % AGENT_COLORS.length],
        label: formatAgentName(apiAgent.agent_name),
        task: `Processing with ${apiAgent.agent_name}...`,
        success: `${formatAgentName(apiAgent.agent_name)} completed ✓`,
      }));

      setAvailableAgents(transformedAgents);
      console.log('✓ Transformed agents:', transformedAgents);
    } catch (error) {
      console.error('❌ Error fetching agents:', error);
      // Fallback to hardcoded agents
      setAvailableAgents(ALL_AGENTS);
    } finally {
      setLoadingAgents(false);
    }
  };

  // Helper function to format agent name (e.g., "github_agent" -> "GitHub Agent")
  const formatAgentName = (name: string): string => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Drag and Drop Handler
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    console.log('🔄 Drag End:', { source, destination, draggableId });

    // If dropped outside a droppable area
    if (!destination) {
      console.log('❌ Dropped outside droppable area');
      return;
    }

    // If dropped in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      console.log('⚠️ Dropped in same place');
      return;
    }

    // Dragging from Available Agents to Selected Agents (workspace)
    if (source.droppableId === 'available-agents' && destination.droppableId === 'selected-agents') {
      console.log('✅ Moving from Available to Selected');
      const agent = availableAgents.find(a => a.id === draggableId);
      console.log('Found agent:', agent);
      if (agent) {
        console.log('Before:', { availableAgents: availableAgents.length, selectedAgents: selectedAgents.length });
        // Add to selected agents
        const newAgent = { ...agent, prompt: '' };
        setSelectedAgents(prev => {
          const updated = [...prev, newAgent];
          console.log('Updated selectedAgents:', updated);
          return updated;
        });
        // Remove from available agents
        setAvailableAgents(prev => {
          const updated = prev.filter(a => a.id !== agent.id);
          console.log('Updated availableAgents:', updated);
          return updated;
        });
        console.log('✅ Agent moved to workflow');
      } else {
        console.log('❌ Agent not found in availableAgents');
      }
      return;
    }

    // Dragging from Selected Agents back to Available Agents
    if (source.droppableId === 'selected-agents' && destination.droppableId === 'available-agents') {
      console.log('✅ Moving from Selected back to Available');
      const agent = selectedAgents.find(a => a.id === draggableId);
      if (agent) {
        // Create agent without prompt for available agents
        const agentCopy = { ...agent };
        delete agentCopy.prompt;
        
        // Add to available agents
        setAvailableAgents(prev => [...prev, agentCopy]);
        // Remove from selected agents
        setSelectedAgents(prev => prev.filter(a => a.id !== agent.id));
        console.log('✅ Agent moved back to available');
      }
      return;
    }

    // Reordering within Selected Agents
    if (source.droppableId === 'selected-agents' && destination.droppableId === 'selected-agents') {
      console.log('↕️ Reordering within Selected Agents');
      const newSelectedAgents = Array.from(selectedAgents);
      const [moved] = newSelectedAgents.splice(source.index, 1);
      newSelectedAgents.splice(destination.index, 0, moved);
      setSelectedAgents(newSelectedAgents);
      return;
    }

    console.log('⚠️ No matching drag rule');
  };

  const colors = {
    bg: isDark ? '#0f0f0f' : '#f8fafc',
    cardBg: isDark ? '#1a1a1a' : '#fff',
    text: isDark ? '#e5e7eb' : '#111',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : 'rgba(0,0,0,0.1)',
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
    // Move all selected agents back to available agents (no need to refetch from API)
    selectedAgents.forEach(agent => {
      const { prompt, ...agentWithoutPrompt } = agent;
      setAvailableAgents(prev => [...prev, agentWithoutPrompt]);
    });
    setSelectedAgents([]);
  };

  const handleSaveWorkflow = () => {
    if (!workflowName.trim()) return;
    
    // Show master prompt dialog before saving
    setMasterPromptDialog(true);
  };

  const handleConfirmSaveWorkflow = async () => {
    if (!workflowName.trim()) return;
    
    // Get current user from localStorage
    const currentUser = localStorage.getItem('currentUser') || 'admin';
    
    // Prepare workflow data with agent prompts (for localStorage)
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

    // Prepare API payload
    const apiPayload = {
      workflow_id: 0, // New workflow
      version: "1.0",
      data: {
        workflow: workflowData,
      },
      file_name: workflowName.toLowerCase().replace(/\s+/g, '_') + '.json',
      agents: selectedAgents.map(a => a.key), // Use agent keys (agent_name)
      created_at: new Date().toISOString(),
      created_by: currentUser,
      updated_at: new Date().toISOString(),
      updated_by: currentUser,
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
      console.log(`   Key: ${agent.key}`);
      console.log(`   Color: ${agent.color}`);
      console.log(`   Default Task: ${agent.task}`);
      if (agent.prompt && agent.prompt.trim()) {
        console.log(`   ✅ Custom Prompt: "${agent.prompt}"`);
      } else {
        console.log(`   ⚠️  No custom prompt (using default task)`);
      }
    });
    
    console.log('\n============================================');
    console.log('📦 Complete Workflow Data (localStorage):');
    console.log(JSON.stringify(workflowData, null, 2));
    console.log('============================================');
    console.log('📡 API Payload:');
    console.log(JSON.stringify(apiPayload, null, 2));
    console.log('============================================\n');

    try {
      // 📡 Save to API
      console.log('📡 Sending workflow to API...');
      const response = await fetch('http://127.0.0.1:8000/sql/sql/push_workflow_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Response Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Workflow saved to API successfully:', result);

      // Also save to localStorage for offline access
      saveWorkflow(workflowData);
      console.log('✅ Workflow saved to localStorage');

      // Close all dialogs
      setMasterPromptDialog(false);
      setSaveDialog(false);
      setWorkflowName('');
      navigate('/workflows');
    } catch (error) {
      console.error('❌ Error saving workflow to API:', error);
      
      // Check if it's a CORS error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('⚠️ CORS Error: Backend needs to allow requests from http://localhost:5173');
        console.warn('⚠️ Add these headers to your FastAPI backend:');
        console.warn(`
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
        `);
      }
      
      // Fallback: Save to localStorage only
      saveWorkflow(workflowData);
      console.log('⚠️ Workflow saved to localStorage only (API unavailable)');
      
      // Still navigate on fallback
      setMasterPromptDialog(false);
      setSaveDialog(false);
      setWorkflowName('');
      navigate('/workflows');
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ minHeight: '100vh', bgcolor: colors.bg, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, p: 2, pb: 1, borderBottom: `1px solid ${colors.border}` }}>
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

        {/* Main Layout: Left (Agents) + Right (Workflow Canvas) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 0, flex: 1, overflow: 'hidden' }}>
          {/* LEFT: Available Agents Panel */}
          <Box sx={{ borderRight: `1px solid ${colors.border}`, p: 2, overflowY: 'auto', bgcolor: isDark ? '#111' : '#f9fafb' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.text, mb: 2 }}>
              Available Agents ({availableAgents.length})
            </Typography>
            
            <Droppable droppableId="available-agents" type="AGENTS">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                  }}
                >
                  {loadingAgents ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '300px',
                      gap: 2,
                    }}>
                      <Typography sx={{ color: colors.textSecondary, fontSize: 12 }}>
                        Loading agents...
                      </Typography>
                      <Box sx={{ 
                        width: 30, 
                        height: 30, 
                        border: `2px solid ${colors.border}`,
                        borderTop: `2px solid #3b82f6`,
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        }
                      }} />
                    </Box>
                  ) : availableAgents.length === 0 ? (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: 200,
                      color: colors.textSecondary,
                      fontStyle: 'italic',
                      fontSize: 12
                    }}>
                      All agents added!
                    </Box>
                  ) : (
                    <>
                      {availableAgents.map((agent, index) => (
                        <Draggable key={agent.id} draggableId={agent.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                cursor: 'grab',
                                zIndex: snapshot.isDragging ? 9999 : 'auto',
                                ...provided.draggableProps.style,
                              }}
                            >
                              <Box
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1,
                                  bgcolor: snapshot.isDragging ? agent.color : colors.cardBg,
                                  border: `1px solid ${agent.color}`,
                                  padding: '10px',
                                  borderRadius: '8px',
                                  transition: 'all 0.15s ease',
                                  boxShadow: snapshot.isDragging ? `0 10px 25px rgba(0,0,0,0.4)` : '0 1px 2px rgba(0,0,0,0.1)',
                                  transform: snapshot.isDragging ? 'scale(1.05)' : 'scale(1)',
                                  cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                                  '&:hover': { 
                                    boxShadow: `0 4px 12px ${agent.color}40`,
                                  }
                                }}
                              >
                                <Box sx={{ width: 28, height: 28, borderRadius: '6px', bgcolor: snapshot.isDragging ? 'rgba(255,255,255,0.2)' : `${agent.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <agent.icon sx={{ fontSize: 16, color: snapshot.isDragging ? '#fff' : agent.color }} />
                                </Box>
                                <Typography sx={{ fontSize: 12, fontWeight: 600, color: snapshot.isDragging ? '#fff' : colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {agent.label}
                                </Typography>
                              </Box>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </>
                  )}
                </Box>
              )}
            </Droppable>
          </Box>

          {/* RIGHT: Workflow Canvas - Free Placement */}
          <Box sx={{ p: 3, overflowY: 'auto', position: 'relative' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.text, mb: 2 }}>
              Workflow Canvas ({selectedAgents.length})
            </Typography>

            <Droppable droppableId="selected-agents" type="AGENTS">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    minHeight: 'calc(100vh - 150px)',
                    border: `2px dashed ${colors.border}`,
                    borderRadius: 2,
                    bgcolor: isDark ? '#0a0a0a' : '#fafbfc',
                    p: 2,
                    position: 'relative',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignContent: 'flex-start',
                    gap: 2,
                    '&:hover': {
                      bgcolor: isDark ? '#111' : '#f0f4f8',
                    }
                  }}
                >
                  {selectedAgents.length === 0 ? (
                    <Box sx={{ 
                      width: '100%',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      minHeight: '400px',
                      color: colors.textSecondary,
                      fontStyle: 'italic',
                      flexDirection: 'column',
                      gap: 1,
                      fontSize: 14
                    }}>
                      <Typography>📌 Drag agents here to add them</Typography>
                      <Typography sx={{ fontSize: 12 }}>Place them anywhere on the canvas</Typography>
                    </Box>
                  ) : (
                    <>
                      {selectedAgents.map((agent, index) => (
                        <Draggable key={agent.id} draggableId={agent.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                                zIndex: snapshot.isDragging ? 9999 : 'auto',
                                ...provided.draggableProps.style,
                              }}
                            >
                              <Box
                                sx={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: 0.75,
                                  bgcolor: snapshot.isDragging ? agent.color : colors.cardBg,
                                  border: `2px solid ${agent.color}`,
                                  padding: '6px 12px',
                                  borderRadius: '20px',
                                  transition: 'all 0.15s ease',
                                  boxShadow: snapshot.isDragging ? `0 12px 30px rgba(0,0,0,0.4)` : '0 2px 4px rgba(0,0,0,0.1)',
                                  transform: snapshot.isDragging ? 'scale(1.1)' : 'scale(1)',
                                  cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                                  '&:hover': { 
                                    boxShadow: `0 4px 12px ${agent.color}50`,
                                  }
                                }}
                              >
                                {/* Icon */}
                                <Box sx={{ width: 18, height: 18, borderRadius: '4px', bgcolor: snapshot.isDragging ? 'rgba(255,255,255,0.2)' : `${agent.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <agent.icon sx={{ fontSize: 12, color: snapshot.isDragging ? '#fff' : agent.color }} />
                                </Box>

                                {/* Label */}
                                <Typography sx={{ fontSize: 11, fontWeight: 600, color: snapshot.isDragging ? '#fff' : colors.text, whiteSpace: 'nowrap' }}>
                                  {agent.label}
                                </Typography>

                                {/* Edit Button */}
                                <IconButton
                                  size="small"
                                  onClick={() => openPromptDialog(agent)}
                                  sx={{ 
                                    color: snapshot.isDragging ? '#fff' : agent.color, 
                                    p: '2px', 
                                    minWidth: 'auto',
                                    display: 'flex',
                                  }}
                                >
                                  <EditIcon sx={{ fontSize: 12 }} />
                                </IconButton>

                                {/* Remove Button */}
                                <IconButton
                                  size="small"
                                  onClick={() => removeAgent(agent.id)}
                                  sx={{ 
                                    color: snapshot.isDragging ? '#fff' : '#DC2626', 
                                    p: '2px', 
                                    minWidth: 'auto',
                                    display: 'flex',
                                  }}
                                >
                                  <DeleteIcon sx={{ fontSize: 12 }} />
                                </IconButton>
                              </Box>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </>
                  )}
                </Box>
              )}
            </Droppable>
          </Box>
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

        {/* Master Prompt Dialog - Shows all agent prompts */}
        <Dialog 
          open={masterPromptDialog} 
          onClose={() => setMasterPromptDialog(false)} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle sx={{ color: isDark ? '#e5e7eb' : '#111', borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SaveIcon sx={{ color: '#059669' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Master Prompt - Review Before Saving
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: isDark ? '#9ca3af' : '#6b7280', mt: 1, fontWeight: 400 }}>
              Workflow: <strong>{workflowName}</strong> · {selectedAgents.length} Agents
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {selectedAgents.map((agent, index) => {
                const Icon = agent.icon;
                return (
                  <Box 
                    key={agent.id}
                    sx={{ 
                      p: 2, 
                      borderBottom: index < selectedAgents.length - 1 ? `1px solid ${isDark ? '#374151' : '#e5e7eb'}` : 'none',
                      bgcolor: isDark ? (index % 2 === 0 ? '#1a1a1d' : '#111') : (index % 2 === 0 ? '#f9fafb' : '#fff')
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {/* Agent Icon & Number */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <Box 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            bgcolor: `${agent.color}18`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Icon sx={{ fontSize: 20, color: agent.color }} />
                        </Box>
                        <Typography sx={{ fontSize: 10, color: isDark ? '#6b7280' : '#9ca3af', fontWeight: 600 }}>
                          #{index + 1}
                        </Typography>
                      </Box>

                      {/* Agent Details */}
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? '#e5e7eb' : '#111', mb: 0.5 }}>
                          {agent.label}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: isDark ? '#6b7280' : '#9ca3af', mb: 1 }}>
                          Default: {agent.task}
                        </Typography>
                        
                        {/* Prompt Display */}
                        {agent.prompt && agent.prompt.trim() ? (
                          <Box 
                            sx={{ 
                              mt: 1, 
                              p: 1.5, 
                              bgcolor: isDark ? '#232326' : '#f3f4f6',
                              borderRadius: 1,
                              border: `1px solid ${agent.color}40`
                            }}
                          >
                            <Typography sx={{ fontSize: 10, color: agent.color, fontWeight: 600, mb: 0.5, textTransform: 'uppercase' }}>
                              Custom Prompt:
                            </Typography>
                            <Typography 
                              sx={{ 
                                fontSize: 12, 
                                color: isDark ? '#d1d5db' : '#374151',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                              }}
                            >
                              {agent.prompt}
                            </Typography>
                          </Box>
                        ) : (
                          <Box 
                            sx={{ 
                              mt: 1, 
                              p: 1.5, 
                              bgcolor: isDark ? '#1a1a1d' : '#fef3c7',
                              borderRadius: 1,
                              border: `1px solid ${isDark ? '#374151' : '#fbbf24'}`
                            }}
                          >
                            <Typography sx={{ fontSize: 11, color: isDark ? '#9ca3af' : '#92400e', fontStyle: 'italic' }}>
                              ⚠️ No custom prompt - will use default task
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
            <Button 
              onClick={() => setMasterPromptDialog(false)} 
              sx={{ color: isDark ? '#9ca3af' : '#6b7280' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSaveWorkflow} 
              variant="contained" 
              startIcon={<SaveIcon />}
              sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' } }}
            >
              Confirm & Save Workflow
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DragDropContext>
  );
}