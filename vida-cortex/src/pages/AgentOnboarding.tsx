import { useState } from 'react';
import {
  Card, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Snackbar, Alert,
  IconButton, Chip, Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

interface Agent {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'pending';
  registeredDate: string;
}

export default function AgentOnboarding() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Build Agent Alpha',
      type: 'Build',
      capabilities: ['Docker', 'Node.js', 'Python'],
      status: 'active',
      registeredDate: '2026-05-10',
    },
    {
      id: '2',
      name: 'Deploy Agent Beta',
      type: 'Deployment',
      capabilities: ['Kubernetes', 'AWS', 'Azure'],
      status: 'active',
      registeredDate: '2026-05-09',
    },
    {
      id: '3',
      name: 'Test Agent Gamma',
      type: 'Testing',
      capabilities: ['Selenium', 'Jest', 'Cypress'],
      status: 'pending',
      registeredDate: '2026-05-12',
    },
  ]);
  const [open, setOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [snack, setSnack] = useState('');
  
  // Form state
  const [agentName, setAgentName] = useState('');
  const [agentType, setAgentType] = useState('');
  const [agentCapabilities, setAgentCapabilities] = useState('');

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleOpenDialog = (agent?: Agent) => {
    if (agent) {
      setEditingAgent(agent);
      setAgentName(agent.name);
      setAgentType(agent.type);
      setAgentCapabilities(agent.capabilities.join(', '));
    } else {
      setEditingAgent(null);
      setAgentName('');
      setAgentType('');
      setAgentCapabilities('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAgent(null);
    setAgentName('');
    setAgentType('');
    setAgentCapabilities('');
  };

  const handleSaveAgent = () => {
    if (!agentName || !agentType || !agentCapabilities) {
      setSnack('Please fill all fields');
      return;
    }

    const capabilities = agentCapabilities.split(',').map(c => c.trim());
    
    if (editingAgent) {
      // Update existing agent
      setAgents(agents.map(agent => 
        agent.id === editingAgent.id 
          ? { ...agent, name: agentName, type: agentType, capabilities }
          : agent
      ));
      setSnack(`Agent "${agentName}" updated successfully`);
    } else {
      // Add new agent
      const newAgent: Agent = {
        id: String(agents.length + 1),
        name: agentName,
        type: agentType,
        capabilities,
        status: 'pending',
        registeredDate: new Date().toISOString().split('T')[0],
      };
      setAgents([...agents, newAgent]);
      setSnack(`Agent "${agentName}" onboarded successfully`);
    }
    
    handleClose();
  };

  const handleDeleteAgent = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    setAgents(agents.filter(a => a.id !== agentId));
    setSnack(`Agent "${agent?.name}" removed`);
  };

  const handleActivateAgent = (agentId: string) => {
    setAgents(agents.map(agent => 
      agent.id === agentId ? { ...agent, status: 'active' as const } : agent
    ));
    const agent = agents.find(a => a.id === agentId);
    setSnack(`Agent "${agent?.name}" activated`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon fontSize="small" />;
      case 'pending': return <PendingIcon fontSize="small" />;
      default: return null;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600, 
            mb: 1,
            color: isDark ? '#fff' : '#1a1a1a'
          }}
        >
          Agent <span style={{ color: '#2196f3' }}>Onboarding</span>
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}
        >
          Register and manage AI agents for autonomous DevOps orchestration
        </Typography>
      </div>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenDialog()}
          sx={{ 
            textTransform: 'none',
            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
          }}
        >
          Onboard New Agent
        </Button>
      </Box>

      <Card sx={{ 
        background: isDark 
          ? 'rgba(255,255,255,0.05)' 
          : '#fff',
        backdropFilter: 'blur(10px)',
        border: isDark 
          ? '1px solid rgba(255,255,255,0.1)' 
          : '1px solid rgba(0,0,0,0.1)',
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Agent Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Capabilities</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Registered Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SmartToyIcon sx={{ color: '#2196f3' }} />
                      <Typography variant="body2" fontWeight={500}>
                        {agent.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={agent.type} 
                      size="small" 
                      variant="outlined"
                      sx={{ borderRadius: '6px' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {agent.capabilities.map((cap, idx) => (
                        <Chip 
                          key={idx}
                          label={cap} 
                          size="small" 
                          sx={{ 
                            fontSize: '11px',
                            height: '20px',
                            background: isDark 
                              ? 'rgba(33,150,243,0.15)' 
                              : 'rgba(33,150,243,0.1)',
                            color: '#2196f3',
                            border: 'none',
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={getStatusIcon(agent.status)}
                      label={agent.status.toUpperCase()} 
                      size="small" 
                      color={getStatusColor(agent.status)}
                      sx={{ fontWeight: 600, fontSize: '11px' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {agent.registeredDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {agent.status === 'pending' && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleActivateAgent(agent.id)}
                          sx={{ textTransform: 'none', minWidth: '70px' }}
                        >
                          Activate
                        </Button>
                      )}
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(agent)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteAgent(agent.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Agent Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: isDark 
              ? 'rgba(10,14,26,0.95)' 
              : '#fff',
            backdropFilter: 'blur(20px)',
            border: isDark 
              ? '1px solid rgba(255,255,255,0.1)' 
              : '1px solid rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingAgent ? 'Edit Agent' : 'Onboard New Agent'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Agent Name"
            type="text"
            fullWidth
            variant="outlined"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Agent Type"
            type="text"
            fullWidth
            variant="outlined"
            value={agentType}
            onChange={(e) => setAgentType(e.target.value)}
            placeholder="e.g., Build, Deployment, Testing"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Capabilities"
            type="text"
            fullWidth
            variant="outlined"
            value={agentCapabilities}
            onChange={(e) => setAgentCapabilities(e.target.value)}
            placeholder="e.g., Docker, Kubernetes, Python (comma separated)"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAgent} 
            variant="contained"
            sx={{ 
              textTransform: 'none',
              background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
            }}
          >
            {editingAgent ? 'Update Agent' : 'Onboard Agent'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!snack}
        autoHideDuration={4000}
        onClose={() => setSnack('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnack('')} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snack}
        </Alert>
      </Snackbar>
    </div>
  );
}
