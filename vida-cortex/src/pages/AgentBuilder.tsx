import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Chip, useTheme, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import BuildIcon from '@mui/icons-material/Build';
import StorageIcon from '@mui/icons-material/Storage';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GitHubIcon from '@mui/icons-material/GitHub';

const ACCENT = '#FF4D1C';

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

  return (
    <Card 
      onClick={onClick}
      sx={{
        minHeight: 80,
        bgcolor: isDark ? '#2a2a2a' : '#fff',
        border: `2px solid ${isDark ? '#374151' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: 2,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 16px ${agent.color}30`,
          borderColor: agent.color,
        } : {}
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '50%',
            bgcolor: `${agent.color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon sx={{ fontSize: 16, color: agent.color }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: isDark ? '#e5e7eb' : '#111', lineHeight: 1.2 }}>
              {agent.label}
            </Typography>
            <Typography sx={{ fontSize: 10, color: isDark ? '#9ca3af' : '#6b7280', lineHeight: 1.3, mt: 0.2 }}>
              {agent.task.substring(0, 40)}...
            </Typography>
          </Box>
          {showAdd && (
            <Box sx={{
              width: 24, height: 24, borderRadius: '50%',
              bgcolor: `${agent.color}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <AddIcon sx={{ fontSize: 14, color: agent.color }} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

const WINDOW_SIZE = 5;

// Agents Flow with per-agent highlight + sliding window
function AgentsFlow({ selectedAgents }: { selectedAgents: Agent[] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [windowStart, setWindowStart] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
  const schedule = (fn: () => void, delay: number) => { const t = setTimeout(fn, delay); timerRef.current.push(t); };

  const run = () => {
    if (selectedAgents.length === 0) return;
    clearTimers();
    setIsRunning(true);
    setAllDone(false);
    setDoneIds(new Set());
    setCurrentIdx(null);
    setWindowStart(0);

    selectedAgents.forEach((agent, i) => {
      const start = i * 2000;
      schedule(() => {
        setCurrentIdx(i);
        // auto-slide window when active agent goes beyond visible range
        setWindowStart(w => {
          const end = w + WINDOW_SIZE - 1;
          if (i > end) return i - WINDOW_SIZE + 1;
          return w;
        });
      }, start);
      schedule(() => {
        setDoneIds(prev => new Set([...prev, agent.id]));
        if (i === selectedAgents.length - 1) { setCurrentIdx(null); setIsRunning(false); setAllDone(true); }
      }, start + 1800);
    });
  };

  useEffect(() => () => clearTimers(), []);

  const total = selectedAgents.length;
  const visibleAgents = selectedAgents.slice(windowStart, windowStart + WINDOW_SIZE);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: isDark ? '#e5e7eb' : '#111' }}>Agents Flow</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {total > WINDOW_SIZE && (
            <>
              <Button size="small" variant="outlined" disabled={windowStart === 0}
                onClick={() => setWindowStart(w => Math.max(0, w - 1))}
                sx={{ minWidth: 0, px: 1.2, py: 0.4, borderRadius: 999, fontWeight: 700, boxShadow: 'none' }}>◀</Button>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: isDark ? '#9ca3af' : '#6b7280', minWidth: 70, textAlign: 'center' }}>
                {windowStart + 1}–{Math.min(windowStart + WINDOW_SIZE, total)} of {total}
              </Typography>
              <Button size="small" variant="outlined" disabled={windowStart + WINDOW_SIZE >= total}
                onClick={() => setWindowStart(w => Math.min(total - WINDOW_SIZE, w + 1))}
                sx={{ minWidth: 0, px: 1.2, py: 0.4, borderRadius: 999, fontWeight: 700, boxShadow: 'none' }}>▶</Button>
            </>
          )}
          <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={run} disabled={isRunning}
            sx={{ borderRadius: 999, fontWeight: 700, boxShadow: 'none' }}>
            {isRunning ? 'Running...' : allDone ? 'Re-run' : 'Run'}
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {visibleAgents.map((agent, i) => {
          const globalIdx = windowStart + i;
          const Icon = agent.icon;
          const isActive = currentIdx === globalIdx;
          const isDone = doneIds.has(agent.id);
          const isPast = currentIdx !== null && globalIdx < currentIdx;
          const connectorColor = isDone || isPast ? '#059669' : (isDark ? '#4B5563' : '#D1D5DB');
          const borderColor = isDone ? '#059669' : isActive ? agent.color : (isDark ? '#374151' : 'rgba(0,0,0,0.1)');
          const bgColor = isDone ? 'rgba(5,150,105,0.08)' : isActive ? `${agent.color}18` : (isDark ? '#2a2a2a' : '#fafafa');
          const labelColor = isDone ? '#059669' : isActive ? agent.color : (isDark ? '#9ca3af' : '#9CA3AF');
          return (
            <Box key={agent.id} sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              {i > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mx: 0.5, flexShrink: 0 }}>
                  <Box sx={{ width: 20, height: 2, bgcolor: connectorColor, transition: 'background 0.3s' }} />
                  <Box sx={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `6px solid ${connectorColor}`, transition: 'border-left-color 0.3s' }} />
                </Box>
              )}
              <Box sx={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
                px: 1, py: 1, borderRadius: 2,
                border: `2px solid ${borderColor}`,
                bgcolor: bgColor,
                transition: 'all 0.3s ease',
                transform: isActive ? 'translateY(-4px)' : 'none',
                boxShadow: isActive ? `0 6px 20px ${agent.color}40` : 'none',
                position: 'relative', overflow: 'hidden',
              }}>
                {isActive && (
                  <Box sx={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(90deg, transparent, ${agent.color}25, transparent)`,
                    animation: 'shimmer 1.2s ease-in-out infinite',
                    '@keyframes shimmer': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
                  }} />
                )}
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: `${agent.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Icon sx={{ fontSize: 14, color: isDone ? '#059669' : isActive ? agent.color : '#9CA3AF' }} />
                  {isActive && (
                    <Box sx={{ position: 'absolute', inset: -3, borderRadius: '50%', border: `1.5px solid ${agent.color}`, animation: 'ringPulse 1s ease-in-out infinite', '@keyframes ringPulse': { '0%,100%': { opacity: 0.9, transform: 'scale(1)' }, '50%': { opacity: 0.2, transform: 'scale(1.2)' } } }} />
                  )}
                </Box>
                <Typography sx={{ fontSize: 9, fontWeight: 700, color: labelColor, textAlign: 'center', lineHeight: 1.2 }}>
                  {agent.label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                  {isDone && <CheckCircleIcon sx={{ fontSize: 10, color: '#059669' }} />}
                  {isActive && <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: agent.color, animation: 'dot 0.8s ease-in-out infinite', '@keyframes dot': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } } }} />}
                  <Typography sx={{ fontSize: 8, fontWeight: 700, color: isDone ? '#059669' : isActive ? agent.color : (isDark ? '#6B7280' : '#D1D5DB') }}>
                    {isDone ? 'Done' : isActive ? 'Running' : `Step ${globalIdx + 1}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// Main Agent Builder Component
export default function AgentBuilder() {
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const repoName = searchParams.get('repo') || 'Select Repository';
  
  const [availableAgents, setAvailableAgents] = useState<Agent[]>(ALL_AGENTS);
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);

  const [promptDialog, setPromptDialog] = useState<{ open: boolean; agent: Agent | null }>({ open: false, agent: null });

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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.bg, p: 2, pt: 1 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Top bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, mb: 2 }}>
          <Chip
            label={repoName}
            sx={{ bgcolor: `${ACCENT}20`, color: ACCENT, fontWeight: 700, '& .MuiChip-label': { px: 1.5 } }}
          />
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
      </Box>
    </Box>
  );
}