import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Divider, Collapse, Stack, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ErrorIcon from '@mui/icons-material/Error';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import BuildIcon from '@mui/icons-material/Build';
import StorageIcon from '@mui/icons-material/Storage';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GitHubIcon from '@mui/icons-material/GitHub';

import { approvals } from '../data/mockData';
import { getCurrentExecution, getWorkflows } from '../data/workflowStore';
import '../styles/Approvals.css';

const ACCENT = '#059669';

// ── Agent definitions (dynamic, up to 20) ────────────────────
const AGENT_ICONS = [SearchIcon, BuildIcon, StorageIcon, RocketLaunchIcon, GitHubIcon];

// Simulation phases per agent
// 'idle' → 'delegating' → 'working' → 'returning' → 'done'
type AgentPhase = 'idle' | 'delegating' | 'working' | 'returning' | 'done' | 'failed';

interface AgentState {
  phase: AgentPhase;
  returnMsg: string;
}

// Initial state generator for any agent count (with correct AgentPhase type)
const getInitialStates = (count: number): AgentState[] => Array.from({ length: count }, () => ({ phase: 'idle' as AgentPhase, returnMsg: '' }));

// Timing (ms)
const T_DELEGATE = 900;   // arrow animates down
const T_WORK     = 1800;  // agent works
const T_RETURN   = 800;   // return arrow animates up



// ── Stage stepper + logs ────────────────────────────────────
type StageStatus = 'done' | 'active' | 'pending' | 'failed';
interface StageLog { stage: string; status: StageStatus; logs: string[] }

function logLineColor(line: string): string {
  if (line.includes('✓') || line.includes('passed') || line.includes('complete') || line.includes('SUCCESS') || line.includes('live')) return '#059669';
  if (line.includes('✗') || line.includes('ERROR') || line.includes('failed') || line.includes('aborted')) return '#DC2626';
  if (line.includes('...') || line.includes('progress') || line.includes('Waiting') || line.includes('in progress')) return '#D97706';
  return '#6B7280';
}

function StageStepper({ stageLogs }: { stageLogs: StageLog[] }) {
  const [activeIdx, setActiveIdx] = useState<number>(() => {
    const idx = stageLogs.findIndex((s) => s.status === 'active' || s.status === 'failed');
    if (idx >= 0) return idx;
    let last = 0;
    stageLogs.forEach((s, i) => { if (s.status === 'done') last = i; });
    return last;
  });

  const connectorColor = (idx: number) => {
    const s = stageLogs[idx]?.status;
    if (s === 'done')   return '#059669';
    if (s === 'failed') return '#DC2626';
    if (s === 'active') return ACCENT;
    return 'rgba(0,0,0,0.1)';
  };

  return (
    <Box>
      {/* Step row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, overflowX: 'auto', pb: 1 }}>
        {stageLogs.map((sl, idx) => {
          const isSelected = activeIdx === idx;
          const hasLogs    = sl.logs.length > 0;
          return (
            <Box key={sl.stage} sx={{ display: 'flex', alignItems: 'center', flex: idx < stageLogs.length - 1 ? 1 : 'none' }}>
              <Box
                onClick={() => hasLogs && setActiveIdx(idx)}
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
                  cursor: hasLogs ? 'pointer' : 'default',
                  px: 1, py: 0.5, borderRadius: 2, minWidth: 90,
                  bgcolor: isSelected ? 'rgba(5,150,105,0.07)' : 'transparent',
                  border: isSelected ? '1px solid rgba(5,150,105,0.25)' : '1px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': hasLogs ? { bgcolor: 'rgba(5,150,105,0.05)' } : {},
                }}
              >
                {sl.status === 'done'    && <CheckCircleIcon sx={{ fontSize: 18, color: '#059669' }} />}
                {sl.status === 'failed'  && <ErrorIcon sx={{ fontSize: 18, color: '#DC2626' }} />}
                {sl.status === 'active'  && <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: ACCENT }} />}
                {sl.status === 'pending' && <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: 'rgba(0,0,0,0.2)' }} />}
                <Typography variant="caption" sx={{
                  fontSize: 10, fontWeight: isSelected ? 700 : 500, textAlign: 'center', whiteSpace: 'nowrap',
                  color: sl.status === 'done' ? '#059669' : sl.status === 'failed' ? '#DC2626' : sl.status === 'active' ? ACCENT : 'rgba(0,0,0,0.3)',
                }}>
                  {sl.stage}
                </Typography>
                {sl.status === 'active' && (
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: ACCENT,
                    animation: 'blink 1.2s ease-in-out infinite',
                    '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } },
                  }} />
                )}
              </Box>
              {idx < stageLogs.length - 1 && (
                <Box sx={{ flex: 1, height: 2, mx: 0.5, mt: -2, background: connectorColor(idx), borderRadius: 1, opacity: 0.5 }} />
              )}
            </Box>
          );
        })}
      </Box>

      {/* Log panel */}
      <Collapse in={stageLogs[activeIdx]?.logs.length > 0} timeout={200}>
        <Box sx={{
          bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 2, p: 2, maxHeight: 160, overflowY: 'auto',
          border: `1px solid ${
            stageLogs[activeIdx]?.status === 'failed' ? 'rgba(220,38,38,0.2)'
            : stageLogs[activeIdx]?.status === 'done'   ? 'rgba(5,150,105,0.15)'
            : 'rgba(5,150,105,0.15)'
          }`,
        }}>
          <Typography variant="caption" sx={{
            fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', mb: 1, fontSize: 10,
            color: stageLogs[activeIdx]?.status === 'failed' ? '#DC2626' : stageLogs[activeIdx]?.status === 'done' ? '#059669' : ACCENT,
          }}>
            {stageLogs[activeIdx]?.stage} — Logs
          </Typography>
          {stageLogs[activeIdx]?.logs.map((line, i) => (
            <Typography key={i} component="div" sx={{ fontSize: 11, fontFamily: 'monospace', mb: 0.4, display: 'flex', gap: 1, color: logLineColor(line) }}>
              <Box component="span" sx={{ color: 'rgba(0,0,0,0.2)', userSelect: 'none', flexShrink: 0 }}>›</Box>
              {line}
            </Typography>
          ))}
        </Box>
      </Collapse>

      {stageLogs[activeIdx]?.logs.length === 0 && (
        <Box sx={{ p: 1.5, borderRadius: 2, border: '1px dashed rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.3)', fontStyle: 'italic' }}>Stage not started yet</Typography>
        </Box>
      )}
    </Box>
  );
}

// Generated Content Display
function GeneratedContentDisplay({ recordId, apiData, isExecutionComplete }: { 
  recordId: number; 
  apiData?: any;
  isExecutionComplete?: boolean;
}) {
  const [content, setContent] = useState<string>(() => {
    // Initialize from session storage
    try {
      const stored = sessionStorage.getItem(`generatedContent_${recordId}`);
      return stored || '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [linksExpanded, setLinksExpanded] = useState(false);
  const [extractedLinks, setExtractedLinks] = useState<string[]>([]);
  
  // Extract content when apiData is passed
  useEffect(() => {
    if (apiData) {
      console.log('Using API data for content extraction');
      extractContent(apiData);
    } else {
      console.log('Waiting for API data...');
      // If no API data but we have stored content, stop loading
      if (content) {
        setLoading(false);
      }
    }
  }, [apiData]);
  
  // ✅ Function to extract links from text using regex
  const extractLinks = (text: string): string[] => {
    // Regex patterns for different types of URLs
    const urlPatterns = [
      // HTTP/HTTPS URLs
      /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi,
      // Markdown links [text](url)
      /\[([^\]]+)\]\(([^)]+)\)/gi,
      // GitHub URLs
      /github\.com\/[\w-]+\/[\w.-]+/gi
    ];
    
    const links = new Set<string>();
    
    // Extract HTTP/HTTPS URLs
    const httpMatches = text.match(urlPatterns[0]);
    if (httpMatches) {
      httpMatches.forEach(link => links.add(link.trim()));
    }
    
    // Extract URLs from markdown links
    const markdownMatches = text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/gi);
    for (const match of markdownMatches) {
      if (match[2]) {
        links.add(match[2].trim());
      }
    }
    
    // Remove duplicates and return as array
    return Array.from(links);
  };
  
  const extractContent = (data: any) => {
    try {
      console.log(`Extracting content from API data for record ID: ${recordId}`);
      console.log('Data structure:', data);
      console.log('Output array:', data?.output);
      
      const contentTexts: string[] = [];
      
      // Extract from output array
      if (data?.output && Array.isArray(data.output)) {
        console.log(`Processing ${data.output.length} output items`);
        data.output.forEach((item: any, idx: number) => {
          console.log(`Output item ${idx}:`, item);
          console.log(`  Type: ${item?.type}`);
          
          // Skip reasoning items
          if (item?.type === 'reasoning') {
            console.log(`  Skipping reasoning item`);
            return;
          }
          
          // Check for content array in output items
          if (item?.content && Array.isArray(item.content)) {
            console.log(`  Found content array with ${item.content.length} items`);
            item.content.forEach((contentItem: any, contentIdx: number) => {
              console.log(`    Content item ${contentIdx}:`, contentItem);
              console.log(`    Type: ${contentItem?.type}`);
              
              if (contentItem?.type === 'output_text' && contentItem?.text) {
                console.log(`    ✓ Extracted text (${contentItem.text.length} chars)`);
                contentTexts.push(contentItem.text);
              }
            });
          }
        });
      }
      
      // Also check raw_representation.output if main output is empty
      if (contentTexts.length === 0 && data?.raw_representation?.output && Array.isArray(data.raw_representation.output)) {
        console.log('Checking raw_representation.output');
        data.raw_representation.output.forEach((item: any) => {
          if (item?.type === 'reasoning') return;
          
          if (item?.content && Array.isArray(item.content)) {
            item.content.forEach((contentItem: any) => {
              if (contentItem?.type === 'output_text' && contentItem?.text) {
                console.log(`✓ Extracted from raw_representation (${contentItem.text.length} chars)`);
                contentTexts.push(contentItem.text);
              }
            });
          }
        });
      }
      
      // Check deeper nested structure: raw_representation.raw_representation.output
      if (contentTexts.length === 0 && data?.raw_representation?.raw_representation?.output && Array.isArray(data.raw_representation.raw_representation.output)) {
        console.log('Checking raw_representation.raw_representation.output (nested deeper)');
        data.raw_representation.raw_representation.output.forEach((item: any) => {
          if (item?.type === 'reasoning') {
            console.log('  Skipping reasoning item in nested structure');
            return;
          }
          
          if (item?.content && Array.isArray(item.content)) {
            item.content.forEach((contentItem: any) => {
              if (contentItem?.type === 'output_text' && contentItem?.text) {
                console.log(`✓ Extracted from raw_representation.raw_representation (${contentItem.text.length} chars)`);
                contentTexts.push(contentItem.text);
              }
            });
          }
        });
      }
      
      console.log(`Total texts extracted: ${contentTexts.length}`);
      const finalContent = contentTexts.join('\n\n');
      console.log('Final content length:', finalContent.length);
      
      // ✅ Extract links from content
      const links = extractLinks(finalContent);
      console.log(`📎 Extracted ${links.length} links from content:`, links);
      setExtractedLinks(links);
      
      // Store in session storage
      if (finalContent) {
        sessionStorage.setItem(`generatedContent_${recordId}`, finalContent);
      }
      
      setContent(finalContent);
      setLoading(false);
    } catch (error) {
      console.error('Error extracting content:', error);
      setLoading(false);
    }
  };
  
  // Show different states based on execution status
  if (loading) {
    return (
      <Box sx={{ p: 2, bgcolor: '#18181b', borderRadius: 2, textAlign: 'center' }}>
        <Typography sx={{ color: '#9CA3AF', fontSize: 12 }}>Loading generated content...</Typography>
      </Box>
    );
  }
  
  // If execution is not complete yet, show waiting message
  if (!isExecutionComplete && !content) {
    return (
      <Box sx={{ p: 2, bgcolor: '#18181b', borderRadius: 2, textAlign: 'center' }}>
        <Typography sx={{ color: '#9CA3AF', fontSize: 12, fontStyle: 'italic' }}>
          ⏳ Waiting for agents to complete execution...
        </Typography>
      </Box>
    );
  }
  
  // If execution is complete but no content, show empty state
  if (!content) {
    return (
      <Box sx={{ p: 2, bgcolor: '#18181b', borderRadius: 2, textAlign: 'center' }}>
        <Typography sx={{ color: '#9CA3AF', fontSize: 12, fontStyle: 'italic' }}>
          No content generated
        </Typography>
      </Box>
    );
  }
  
  // Show generated content in accordion
  return (
    <Box sx={{ bgcolor: '#18181b', borderRadius: 2, overflow: 'hidden' }}>
      {/* Accordion Header */}
      <Box 
        onClick={() => setExpanded(!expanded)}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2, 
          cursor: 'pointer',
          bgcolor: '#232326',
          borderBottom: expanded ? '1px solid #27272a' : 'none',
          '&:hover': { bgcolor: '#2a2a2e' },
          transition: 'background-color 0.2s'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon sx={{ fontSize: 16, color: '#059669' }} />
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb' }}>
            Generated YAML Configuration
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#6B7280' }}>
            ({content.length} characters)
          </Typography>
        </Box>
        <Typography sx={{ 
          fontSize: 18, 
          color: '#9CA3AF',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }}>
          ▼
        </Typography>
      </Box>
      
      {/* Accordion Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2, maxHeight: 400, overflowY: 'auto' }}>
          <Box component="pre" sx={{ 
            fontFamily: 'monospace', 
            fontSize: 11, 
            color: '#e5e7eb', 
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {content}
          </Box>
        </Box>
      </Collapse>
      
      {/* ✅ Links Accordion - Only show if links are found */}
      {extractedLinks.length > 0 && (
        <>
          {/* Accordion Header for Links */}
          <Box 
            onClick={() => setLinksExpanded(!linksExpanded)}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              p: 2, 
              cursor: 'pointer',
              bgcolor: '#232326',
              borderTop: '1px solid #27272a',
              borderBottom: linksExpanded ? '1px solid #27272a' : 'none',
              '&:hover': { bgcolor: '#2a2a2e' },
              transition: 'background-color 0.2s'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <OpenInNewIcon sx={{ fontSize: 16, color: '#3B82F6' }} />
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb' }}>
                Extracted Links
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#6B7280' }}>
                ({extractedLinks.length} found)
              </Typography>
            </Box>
            <Typography sx={{ 
              fontSize: 18, 
              color: '#9CA3AF',
              transform: linksExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}>
              ▼
            </Typography>
          </Box>
          
          {/* Accordion Content for Links */}
          <Collapse in={linksExpanded}>
            <Box sx={{ p: 2, bgcolor: '#1a1a1d' }}>
              <Stack spacing={1}>
                {extractedLinks.map((link, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      p: 1.5,
                      bgcolor: '#232326',
                      borderRadius: 1,
                      border: '1px solid #27272a',
                      '&:hover': { 
                        bgcolor: '#2a2a2e',
                        borderColor: '#3B82F6'
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    <Typography sx={{ 
                      fontSize: 11, 
                      color: '#6B7280',
                      minWidth: 24,
                      textAlign: 'right'
                    }}>
                      {index + 1}.
                    </Typography>
                    <Button
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<OpenInNewIcon sx={{ fontSize: '12px !important' }} />}
                      sx={{ 
                        color: '#3B82F6', 
                        fontSize: 11, 
                        p: 0, 
                        minWidth: 0,
                        textTransform: 'none',
                        justifyContent: 'flex-start',
                        fontFamily: 'monospace',
                        '&:hover': { 
                          bgcolor: 'transparent', 
                          textDecoration: 'underline' 
                        } 
                      }}
                    >
                      {link}
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Collapse>
        </>
      )}
    </Box>
  );
}

// ── Live orchestration diagram ───────────────────────────────
function LiveOrchestration({ repoName: _repoName, recordId, onExecutionComplete, onApiDataReceived }: { 
  repoName: string; 
  recordId?: number; 
  onExecutionComplete?: (isComplete: boolean) => void;
  onApiDataReceived?: (data: any) => void;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  // Get current workflow execution
  const currentExecution = getCurrentExecution();
  const currentWorkflow = currentExecution ? getWorkflows().find(w => w.id === currentExecution.workflowId) : null;
  
  // Extract agents from API data
  const extractAgentsFromApiData = (data: any): any[] => {
    if (!data) return [];
    
    console.log('Extracting agents from API data');
    console.log('API Data:', data);
    console.log('API Data Type:', typeof data);
    console.log('API Data Keys:', Object.keys(data));
    
    // Try multiple paths to find agents
    let agentsList = [];
    
    // Path 1: Check tools in raw_representation
    if (data?.raw_representation?.tools) {
      console.log('✓ Found tools in raw_representation:', data.raw_representation.tools);
      agentsList = data.raw_representation.tools;
    }
    // Path 2: Check if data is array
    else if (Array.isArray(data)) {
      console.log('✓ Data is array:', data);
      agentsList = data;
    }
    // Path 3: Check if data has agents property
    else if (data?.agents) {
      console.log('✓ Found agents property:', data.agents);
      agentsList = data.agents;
    }
    // Path 4: Check messages for agent info
    else if (data?.messages) {
      console.log('Found messages:', data.messages);
      // Extract agent names from messages if available
    }
    
    console.log('Extracted agents list:', agentsList);
    
    if (agentsList.length > 0) {
      const parsedAgents = agentsList.map((tool: any, index: number) => ({
        name: tool.name || tool.label || `Agent ${index + 1}`,
        description: tool.description || tool.task || 'Processing task...',
        parameters: tool.parameters
      }));
      
      console.log('✓ Parsed Agents:', parsedAgents);
      return parsedAgents;
    }
    
    console.log('⚠️ No agents found in API data, using fallback');
    return [];
  };

  
  // Build AGENTS array dynamically
  const buildAgentsArray = (fetchedAgents: any[] = []) => {
    if (fetchedAgents.length > 0) {
      return fetchedAgents.map((agent: any, index: number) => ({
        label: agent.name?.replace(/_/g, ' ') || `Agent ${index + 1}`,
        task: agent.description || 'Processing task...',
        success: `${agent.name?.replace(/_/g, ' ') || 'Agent'} completed successfully`,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5],
        icon: AGENT_ICONS[index % AGENT_ICONS.length],
        key: agent.name || `agent-${index}`,
        shortName: (agent.name?.replace(/_/g, ' ') || `Agent ${index + 1}`).split(' ')[0]
      }));
    } else if (currentWorkflow?.agents) {
      return currentWorkflow.agents.map((agent, index) => ({
        label: agent.label,
        task: agent.task,
        success: agent.success || `${agent.label} completed successfully`,
        color: agent.color,
        icon: AGENT_ICONS[index % AGENT_ICONS.length],
        key: agent.label,
        shortName: agent.label.split(' ')[0]
      }));
    } else {
      return [
        { label: 'Github ', task: 'Analyzing code quality and security...', success: 'Code analysis complete — no critical issues found', color: '#3B82F6', icon: SearchIcon, key: 'Github', shortName: 'Code' },
        { label: 'Yaml', task: 'Compiling and building application...', success: 'Build successful — artifacts generated', color: '#10B981', icon: BuildIcon, key: 'Yaml', shortName: 'Build' },
        { label: 'Terraform', task: 'Running automated test suite...', success: 'All tests passed — 98% coverage achieved', color: '#F59E0B', icon: StorageIcon, key: 'Terraform', shortName: 'Test' },
      ];
    }
  };
  
  const [AGENTS, setAGENTS] = useState(buildAgentsArray());
  
  // Color scheme based on theme
  const colors = {
    bg: isDark ? '#1a1a1a' : '#fff',
    text: isDark ? '#e5e7eb' : '#111',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : 'rgba(0,0,0,0.1)',
    orchestratorBg: isDark ? '#1f2937' : '#F0FDF4',
    agentIdleBg: isDark ? '#374151' : '#F9FAFB',
    connectorBg: isDark ? '#374151' : '#D1FAE5',
  };
  
  // Log panel state
  const [selectedAgentIdx, setSelectedAgentIdx] = useState<number | null>(null);

  
  // Real-time logs state with session storage persistence
  const [realTimeLogs, setRealTimeLogs] = useState<{ [key: number]: string[] }>(() => {
    try {
      const stored = sessionStorage.getItem('realTimeLogs');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const wsRef = useRef<WebSocket | null>(null);
  const agentsRef = useRef(AGENTS);
  
  // Keep agentsRef in sync with AGENTS
  useEffect(() => {
    agentsRef.current = AGENTS;
  }, [AGENTS]);
  
  // Persist logs to session storage (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      sessionStorage.setItem('realTimeLogs', JSON.stringify(realTimeLogs));
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [realTimeLogs]);
  
  // Ref for agent stack scrolling
  const agentStackRef = useRef<HTMLDivElement>(null);
  const [agentStates, setAgentStates] = useState<AgentState[]>(() => getInitialStates(AGENTS.length));
  const [orchMsg, setOrchMsg] = useState('Initialising pipeline...');
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const [waitingForLogs, setWaitingForLogs] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);



  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };

  const schedule = (fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timerRef.current.push(t);
  };

  const setPhase = (idx: number, phase: AgentPhase, returnMsg = '') => {
    setAgentStates(prev => prev.map((s, i) => i === idx ? { phase, returnMsg } : s));
    
    // Auto-select currently active agent
    if (phase === 'delegating' || phase === 'working' || phase === 'returning') {
      setSelectedAgentIdx(idx);
      
      // Auto-scroll to the active agent in the stack
      setTimeout(() => {
        if (agentStackRef.current) {
          const agentElement = agentStackRef.current.children[idx + 1] as HTMLElement;
          if (agentElement) {
            agentElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }
      }, 100);
    }
  };

  // Sliding window: always show 5 agents, slide forward as each completes
  const WINDOW_SIZE = 5;
  const [windowStart, setWindowStart] = useState(0);

  const runSimulation = async () => {
    console.log('🚀 Run button clicked');
    
    // Only initialize on first run
    if (!started) {
      // Clear previous session logs and generated content for fresh start
      sessionStorage.removeItem('realTimeLogs');
      if (recordId) {
        sessionStorage.removeItem(`generatedContent_${recordId}`);
      }
      setRealTimeLogs({});
      
      // Show loading state
      setWaitingForLogs(true);
      
      // Connect to WebSocket FIRST
      connectWebSocket();
      
      // ✅ Call the API to trigger backend execution
      if (recordId) {
        console.log(`📡 Calling API to trigger execution: http://127.0.0.1:8000/agents/agent/${recordId}`);
        try {
          const response = await fetch(`http://127.0.0.1:8000/agents/agent/${recordId}`);
          const data = await response.json();
          console.log('✓ API Response:', data);
          
          // Extract agents from API response
          const extractedAgents = extractAgentsFromApiData(data);
          if (extractedAgents.length > 0) {
            const newAgents = buildAgentsArray(extractedAgents);
            setAGENTS(newAgents);
            setAgentStates(getInitialStates(newAgents.length));
          } else {
            setAgentStates(getInitialStates(AGENTS.length));
          }
          
          // Notify parent with API data for content display
          onApiDataReceived?.(data);
        } catch (error) {
          console.error('❌ Error calling API:', error);
          setAgentStates(getInitialStates(AGENTS.length));
        }
      } else {
        setAgentStates(getInitialStates(AGENTS.length));
      }
      
      setDone(false);
      onExecutionComplete?.(false);
      setWindowStart(0);
      setSelectedAgentIdx(0);
      setOrchMsg('Pipeline triggered — waiting for agents...');
      setStarted(true);
      
      console.log('Waiting for WebSocket logs to drive execution...');
    }
  };

  const runAgentsWithList = (idx: number, currentWindow: number, agentsList: any[]) => {
    if (idx >= agentsList.length) { 
      setDone(true);
      console.log('✅ All agents completed - execution finished');
      // Notify parent that execution is complete
      onExecutionComplete?.(true);
      return; 
    }
    const agent = agentsList[idx];
    let offset = 0;
    
    console.log(`Starting agent ${idx + 1}/${agentsList.length}: ${agent.label}`);
    
    schedule(() => { 
      setOrchMsg(`Delegating to ${agent.label} Agent →`); 
      setPhase(idx, 'delegating');
      console.log(`Agent ${idx} - Phase: delegating`);
    }, offset);
    offset += T_DELEGATE;
    
    schedule(() => { 
      setPhase(idx, 'working'); 
      setOrchMsg(`Waiting for ${agent.label} Agent...`);
      console.log(`Agent ${idx} - Phase: working`);
    }, offset);
    offset += T_WORK;
    
    schedule(() => { 
      setPhase(idx, 'returning'); 
      setOrchMsg(`${agent.label} Agent ↑`);
      console.log(`Agent ${idx} - Phase: returning`);
    }, offset);
    offset += T_RETURN;
    
    schedule(() => {
      setPhase(idx, 'done', agent.success);
      setOrchMsg(idx < agentsList.length - 1 ? `✓ ${agent.label} complete` : '✓ All agents complete — pipeline successful!');
      console.log(`Agent ${idx} - Phase: done`);
      const nextWindow = idx >= currentWindow + WINDOW_SIZE - 1 ? currentWindow + 1 : currentWindow;
      if (nextWindow !== currentWindow) setWindowStart(nextWindow);
      schedule(() => runAgentsWithList(idx + 1, nextWindow, agentsList), 400);
    }, offset);
  };


  useEffect(() => { return () => clearTimers(); }, []);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  // Connect to WebSocket for real-time logs
  const connectWebSocket = () => {
    if (wsRef.current) {
      console.log('Closing existing WebSocket connection');
      wsRef.current.close();
    }
    
    console.log('Connecting to WebSocket: ws://localhost:8000/logs/ws/logs');
    const ws = new WebSocket('ws://localhost:8000/logs/ws/logs');
    wsRef.current = ws;
    
    ws.onopen = () => {
      console.log('✓ WebSocket connected successfully');
    };
    
    ws.onmessage = (event) => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📨 WebSocket message received:');
      console.log('Raw data:', event.data);
      
      const logMessage = event.data;
      
      // Parse the log message to extract agent name using regex
      let agentIndex = -1;
      let agentName = '';
      
      // Extract agent name from brackets [agent_name]
      const match = logMessage.match(/\[([a-zA-Z0-9_-]+)\]/);
      
      if (match) {
        const rawAgent = match[1];
        console.log('Extracted agent from log:', rawAgent);
        
        // Try multiple matching strategies
        agentIndex = agentsRef.current.findIndex(a => {
          const agentKey = a.key.toLowerCase();
          const rawAgentLower = rawAgent.toLowerCase();
          
          // Exact match
          if (agentKey === rawAgentLower) return true;
          
          // Contains match
          if (agentKey.includes(rawAgentLower) || rawAgentLower.includes(agentKey)) return true;
          
          // Keyword-based matching for common tool names
          if (rawAgentLower.includes('yaml') || rawAgentLower.includes('ci_builder') || rawAgentLower.includes('builder')) {
            return agentKey.includes('yaml');
          }
          if (rawAgentLower.includes('github') || rawAgentLower.includes('git')) {
            return agentKey.includes('github');
          }
          if (rawAgentLower.includes('terraform') || rawAgentLower.includes('tf')) {
            return agentKey.includes('terraform');
          }
          
          return false;
        });
        
        agentName = rawAgent.replace(/_/g, ' ');
        console.log('Matched agent index:', agentIndex);
      }
      
      // If agent found, use that index, otherwise add to first agent
      const targetIndex = agentIndex >= 0 ? agentIndex : 0;
      
      console.log('Adding log to agent index:', targetIndex);
      
      // Add log to the agent's log panel (avoid duplicates)
      setRealTimeLogs(prev => {
        const existingLogs = prev[targetIndex] || [];
        // Check if this exact log message already exists
        if (existingLogs.includes(logMessage)) {
          console.log('Duplicate log detected, skipping');
          return prev;
        }
        const updated = {
          ...prev,
          [targetIndex]: [...existingLogs, logMessage]
        };
        console.log('Updated logs:', updated);
        
        // First log received, stop waiting state
        setWaitingForLogs(false);
        
        return updated;
      });
      
      // Determine status from log message
      if (logMessage.includes('Called with prompt') || logMessage.includes('Tool called') || logMessage.includes('called with')) {
        console.log(`🔄 Agent ${agentName} started working`);
        if (agentIndex >= 0) {
          setPhase(agentIndex, 'working');
          setOrchMsg(`${agentName} is processing...`);
        }
      } else if (logMessage.includes('Successfully generated') || logMessage.includes('completed') || logMessage.includes('success')) {
        console.log(`✓ Agent ${agentName} completed`);
        if (agentIndex >= 0) {
          setPhase(agentIndex, 'done', `${agentName} completed successfully`);
          setOrchMsg(`✓ ${agentName} complete`);
          
          // Check if all agents are done after state update
          setTimeout(() => {
            setAgentStates(currentStates => {
              const allDone = currentStates.every(s => s.phase === 'done' || s.phase === 'failed');
              if (allDone) {
                console.log('✅ All agents completed - execution finished');
                setDone(true);
                onExecutionComplete?.(true);
              }
              return currentStates;
            });
          }, 100);
        }
      } else if (logMessage.includes('Error') || logMessage.includes('Failed') || logMessage.includes('failed')) {
        console.log(`✗ Agent ${agentName} failed`);
        if (agentIndex >= 0) {
          setPhase(agentIndex, 'failed');
          setOrchMsg(`✗ ${agentName} failed`);
        }
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    };
    
    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };
    
    ws.onclose = (event) => {
      console.log('🔌 WebSocket disconnected');
      console.log('Close code:', event.code);
    };
    
    return ws;
  };

  const visibleAgents = AGENTS.slice(windowStart, windowStart + WINDOW_SIZE);

  return (
  <Box sx={{ width: '100%', height: '70vh', bgcolor: colors.bg, borderRadius: 3, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px #0001', p: 2, display: 'flex', gap: 2, position: 'relative' }}>
    {/* Loading Overlay */}
    {waitingForLogs && (
      <Box sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(4px)',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        zIndex: 10
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#059669', animation: 'loadingDot1 1.4s ease-in-out infinite', '@keyframes loadingDot1': { '0%, 80%, 100%': { transform: 'scale(0)' }, '40%': { transform: 'scale(1)' } } }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#059669', animation: 'loadingDot2 1.4s ease-in-out infinite', '@keyframes loadingDot2': { '0%, 80%, 100%': { transform: 'scale(0)' }, '40%': { transform: 'scale(1)' } }, animationDelay: '0.2s' }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#059669', animation: 'loadingDot3 1.4s ease-in-out infinite', '@keyframes loadingDot3': { '0%, 80%, 100%': { transform: 'scale(0)' }, '40%': { transform: 'scale(1)' } }, animationDelay: '0.4s' }} />
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#059669' }}>Waiting for agents to start...</Typography>
      </Box>
    )}
    
    {/* Main Flow Area - 55% */}
    <Box sx={{ width: '55%', display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Top controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button size="small" variant={started ? 'outlined' : 'contained'} onClick={runSimulation} sx={{ fontSize: 14, py: 0.7, px: 2.5, borderRadius: 999, fontWeight: 700, boxShadow: 'none', color: isDark ? colors.text : 'inherit', borderColor: isDark ? colors.border : 'inherit' }}>
          {!started ? '▶ Run' : done ? '↺ Replay' : '↺ Restart'}
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button size="small" variant="outlined" disabled={windowStart === 0} onClick={() => setWindowStart((w) => Math.max(0, w - 1))} sx={{ fontSize: 13, minWidth: 0, px: 1.5, py: 0.5, borderRadius: 999, fontWeight: 700, boxShadow: 'none' }}>◀</Button>
          <Typography sx={{ fontSize: 11, color: colors.textSecondary, fontWeight: 600, minWidth: 80, textAlign: 'center' }}>
            {windowStart + 1}–{Math.min(windowStart + WINDOW_SIZE, AGENTS.length)} of {AGENTS.length}
          </Typography>
          <Button size="small" variant="outlined" disabled={windowStart + WINDOW_SIZE >= AGENTS.length} onClick={() => setWindowStart((w) => Math.min(AGENTS.length - WINDOW_SIZE, w + 1))} sx={{ fontSize: 13, minWidth: 0, px: 1.5, py: 0.5, borderRadius: 999, fontWeight: 700, boxShadow: 'none' }}>▶</Button>
        </Box>
      </Box>

      {/* Orchestrator node */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 1.5, borderRadius: 3, bgcolor: colors.orchestratorBg, border: '2px solid #059669', boxShadow: isDark ? '0 2px 12px rgba(5,150,105,0.2)' : '0 2px 12px #05966920' }}>
          <SmartToyIcon sx={{ fontSize: 24, color: '#059669' }} />
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 13, color: colors.text, lineHeight: 1.2 }}>Orchestration Agent</Typography>
            <Typography sx={{ fontSize: 11, color: '#059669', fontWeight: 600, lineHeight: 1.3 }}>
              {done ? '✓ All agents complete — pipeline successful!' : orchMsg}
            </Typography>
          </Box>
          {done && <CheckCircleIcon sx={{ fontSize: 20, color: '#059669', ml: 1 }} />}
        </Box>

        {/* Vertical line down from orchestrator */}
        <Box sx={{ width: 2, height: 28, bgcolor: colors.connectorBg }} />

        {/* Horizontal connector bar */}
        <Box sx={{ position: 'relative', width: '100%', height: 2, bgcolor: colors.connectorBg }}>
          {visibleAgents.map((_, i) => (
            <Box key={i} sx={{
              position: 'absolute',
              left: `${(i / (visibleAgents.length - 1 || 1)) * 100}%`,
              top: 0,
              transform: 'translateX(-50%)',
              width: 2,
              height: 28,
              bgcolor: colors.connectorBg,
            }} />
          ))}
        </Box>
      </Box>

      {/* Agent nodes row */}
      <Box sx={{ display: 'flex', gap: 1.5, mt: '28px' }}>
        {visibleAgents.map((agent, i) => {
          const idx = windowStart + i;
          const phase = agentStates[idx]?.phase;
          const isIdle = phase === 'idle';
          const isDelegating = phase === 'delegating';
          const isWorking = phase === 'working';
          const isReturning = phase === 'returning';
          const isDone = phase === 'done';
          const isFailed = phase === 'failed';
          const isActive = isDelegating || isWorking || isReturning;
          const borderColor = isDone ? '#059669' : isFailed ? '#DC2626' : isActive ? agent.color : 'rgba(0,0,0,0.1)';
          const bgColor = isDone ? '#F0FDF4' : isFailed ? '#FEF2F2' : isActive ? `${agent.color}10` : '#FAFAFA';
          const statusColor = isDone ? '#059669' : isFailed ? '#DC2626' : isActive ? agent.color : '#9CA3AF';
          const statusLabel = isDone ? 'Done' : isFailed ? 'Failed' : isDelegating ? 'Receiving' : isWorking ? 'Working' : isReturning ? 'Returning' : 'Idle';
          return (
            <Box
              key={agent.key}
              onClick={() => setSelectedAgentIdx(idx)}
              sx={{
                flex: 1, borderRadius: 2.5, border: `2px solid ${borderColor}`, bgcolor: bgColor,
                p: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.8,
                cursor: 'pointer', transition: 'all 0.3s',
                boxShadow: isActive ? `0 4px 16px ${agent.color}25` : '0 1px 4px rgba(0,0,0,0.06)',
                transform: isActive ? 'translateY(-3px)' : 'none',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* shimmer */}
              {isWorking && (
                <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent, ${agent.color}18, transparent)`, animation: 'shimmer 1.2s ease-in-out infinite', '@keyframes shimmer': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } } }} />
              )}
              {/* Icon */}
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: isIdle ? 'rgba(0,0,0,0.04)' : `${agent.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Box component={agent.icon} sx={{ fontSize: 18, color: isIdle ? '#9CA3AF' : isDone ? '#059669' : isFailed ? '#DC2626' : agent.color }} />
                {isActive && (
                  <Box sx={{ position: 'absolute', inset: -3, borderRadius: '50%', border: `1.5px solid ${agent.color}`, animation: 'ringPulse 1s ease-in-out infinite', '@keyframes ringPulse': { '0%,100%': { opacity: 0.8, transform: 'scale(1)' }, '50%': { opacity: 0.2, transform: 'scale(1.2)' } } }} />
                )}
              </Box>
              {/* Label */}
              <Typography sx={{ fontSize: 11, fontWeight: 700, textAlign: 'center', lineHeight: 1.3, color: isIdle ? '#9CA3AF' : isDone ? '#059669' : isFailed ? '#DC2626' : agent.color }}>
                {agent.label}
              </Typography>
              {/* Task text */}
              {isActive && (
                <Typography sx={{ fontSize: 9, textAlign: 'center', color: '#9CA3AF', lineHeight: 1.3, px: 0.5 }}>
                  {isWorking ? agent.task : isDelegating ? 'Receiving task...' : 'Reporting back...'}
                </Typography>
              )}
              {/* Status badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                {isDone && <CheckCircleIcon sx={{ fontSize: 11, color: '#059669' }} />}
                {isFailed && <ErrorIcon sx={{ fontSize: 11, color: '#DC2626' }} />}
                {isWorking && (
                  <Box sx={{ display: 'flex', gap: 0.3 }}>
                    <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: agent.color, animation: 'dot1 1.4s ease-in-out infinite', '@keyframes dot1': { '0%, 80%, 100%': { opacity: 0 }, '40%': { opacity: 1 } } }} />
                    <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: agent.color, animation: 'dot2 1.4s ease-in-out infinite', '@keyframes dot2': { '0%, 80%, 100%': { opacity: 0 }, '40%': { opacity: 1 } }, animationDelay: '0.2s' }} />
                    <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: agent.color, animation: 'dot3 1.4s ease-in-out infinite', '@keyframes dot3': { '0%, 80%, 100%': { opacity: 0 }, '40%': { opacity: 1 } }, animationDelay: '0.4s' }} />
                  </Box>
                )}
                <Typography sx={{ fontSize: 10, fontWeight: 700, color: statusColor }}>{statusLabel}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>

    {/* Agent Stack - 10% */}
    <Box 
      ref={agentStackRef}
      sx={{ width: '10%', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto', py: 1, scrollBehavior: 'smooth' }}
    >
      <Typography sx={{ fontSize: 9, fontWeight: 700, color: colors.textSecondary, textAlign: 'center', mb: 1 }}>AGENTS</Typography>
      <Stack spacing={0.5}>
        {AGENTS.map((agent, idx) => {
          const phase = agentStates[idx]?.phase;
          const isSelected = selectedAgentIdx === idx;
          const isDone = phase === 'done';
          const isFailed = phase === 'failed';
          const isActive = phase === 'working' || phase === 'delegating' || phase === 'returning';
          return (
            <Box
              key={agent.key}
              data-agent-index={idx}
              onClick={() => setSelectedAgentIdx(idx)}
              sx={{
                height: 32, px: 1, borderRadius: 0,
                bgcolor: isSelected ? `${agent.color}20` : isDone ? '#F0FDF4' : isFailed ? '#FEF2F2' : isActive ? `${agent.color}10` : '#F9FAFB',
                border: `1px solid ${isSelected ? agent.color : isDone ? '#059669' : isFailed ? '#DC2626' : isActive ? agent.color : 'rgba(0,0,0,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            >
              <Typography sx={{ 
                fontSize: 9, 
                fontWeight: isSelected ? 700 : 600,
                color: isDone ? '#059669' : isFailed ? '#DC2626' : isActive ? agent.color : '#9CA3AF',
                textAlign: 'center',
                lineHeight: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {agent.shortName}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>

    {/* Logs Panel - 35% */}
    <Box sx={{ width: '35%', bgcolor: '#18181b', borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #27272a', bgcolor: '#232326' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>
          {selectedAgentIdx !== null ? `${AGENTS[selectedAgentIdx].label} Logs` : 'Select an Agent'}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#18181b' }}>
        {selectedAgentIdx !== null ? (
          (() => {
            const phase = agentStates[selectedAgentIdx]?.phase;
            const isIdle = phase === 'idle';
            const currentLogs = realTimeLogs[selectedAgentIdx] || [];
            
            console.log('Rendering logs panel:');
            console.log('Selected Agent Index:', selectedAgentIdx);
            console.log('Agent Phase:', phase);
            console.log('Current Logs:', currentLogs);
            console.log('Current Logs Length:', currentLogs.length);
            console.log('All Real Time Logs:', realTimeLogs);
            
            if (isIdle && currentLogs.length === 0) return (
              <Typography sx={{ fontSize: 12, color: '#6B7280', fontStyle: 'italic' }}>Agent not dispatched yet</Typography>
            );
            
            return (
              <Box sx={{ fontFamily: 'monospace', fontSize: 11 }}>
                {/* Real-time logs */}
                {currentLogs.map((line, i) => (
                  <Typography key={i} sx={{ 
                    color: line.includes('✓') ? '#22c55e' : line.includes('✗') ? '#ef4444' : '#e5e7eb', 
                    mb: 0.3,
                    opacity: i === currentLogs.length - 1 ? 1 : 0.8
                  }}>
                    {line}
                  </Typography>
                ))}
                
                {/* Show cursor for active agent */}
                {(phase === 'working' || phase === 'delegating' || phase === 'returning') && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Typography sx={{ color: '#6B7280', mr: 1 }}>›</Typography>
                    <Box sx={{ 
                      width: 8, height: 12, bgcolor: '#22c55e', 
                      animation: 'blink 1s infinite',
                      '@keyframes blink': { '0%, 50%': { opacity: 1 }, '51%, 100%': { opacity: 0 } }
                    }} />
                  </Box>
                )}
              </Box>
            );
          })()
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: 12, color: '#6B7280', fontStyle: 'italic' }}>Click ▶ Run to start pipeline</Typography>
          </Box>
        )}
      </Box>
    </Box>
  </Box>
  );
}
// End of LiveOrchestration

// ── Page ─────────────────────────────────────────────────────
export default function AgentQueue() {
  const [searchParams] = useSearchParams();
  const repoFilter = searchParams.get('repo');
  const filtered = repoFilter
    ? approvals.filter((a) => a.repo === repoFilter)
    : approvals;

  // Get current workflow execution
  const currentExecution = getCurrentExecution();
  const currentWorkflow = currentExecution ? getWorkflows().find(w => w.id === currentExecution.workflowId) : null;

  // Shared API data state
  const [apiData, setApiData] = useState<any>(null);

  // Track execution completion state
  const [isExecutionComplete, setIsExecutionComplete] = useState(false);

  // Callback to receive API data from LiveOrchestration
  const handleApiDataReceived = (data: any) => {
    console.log('API data received in parent:', data);
    setApiData(data);
  };

  const branchCodeSx = { bgcolor: 'rgba(5,150,105,0.07)', color: ACCENT, px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11 };
  const shaCodeSx    = { bgcolor: 'rgba(0,0,0,0.05)', color: '#6B7280', px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11 };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Workflow Execution Header */}
      {currentExecution && currentWorkflow && (
  <Card sx={{ bgcolor: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.2)' }}>
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111', mb: 0.5 }}>
                  Executing Workflow: {currentWorkflow.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Repository:</Typography>
                  <Box component="code" sx={branchCodeSx}>{currentExecution.repository}</Box>
                  <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Started:</Typography>
                  <Typography sx={{ fontSize: 12, color: '#6B7280' }}>
                    {new Date(currentExecution.startedAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>
                  Agents ({currentWorkflow.agents.length}):
                </Typography>
                {currentWorkflow.agents.slice(0, 3).map((agent, idx) => (
                  <Box key={idx} sx={{
                    width: 8, height: 8, borderRadius: '50%', bgcolor: agent.color
                  }} />
                ))}
                {currentWorkflow.agents.length > 3 && (
                  <Typography sx={{ fontSize: 11, color: '#6B7280' }}>+{currentWorkflow.agents.length - 3}</Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
      
      {/* Show workflow execution or fallback to mock data */}
      {currentExecution && currentWorkflow ? (
        // Show live workflow execution
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="subtitle1" fontWeight={700}>{currentExecution.repository}</Typography>
                <Box component="code" sx={branchCodeSx}>main</Box>
                <Box component="code" sx={shaCodeSx}>live-exec</Box>
              </Box>
            </Box>

            {/* Live orchestration diagram */}
            <Box sx={{
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.45)',
              border: '1px solid rgba(255,255,255,0.65)',
              backdropFilter: 'blur(8px)',
              overflow: 'hidden',
            }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, p: 2, pb: 0 }}>
                Live Orchestration Flow
              </Typography>
              <LiveOrchestration 
                repoName={currentExecution.repository} 
                recordId={currentExecution.recordId} 
                onExecutionComplete={setIsExecutionComplete}
                onApiDataReceived={handleApiDataReceived}
              />
            </Box>
            
            {/* Generated Content Section */}
            {currentExecution.recordId && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, mb: 1.5 }}>
                  Generated Output
                </Typography>
                <GeneratedContentDisplay 
                  recordId={currentExecution.recordId} 
                  apiData={apiData}
                  isExecutionComplete={isExecutionComplete}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      ) : (
        // Show mock data when no workflow is executing
        <>
          {filtered.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', borderRadius: 2, border: '1px dashed rgba(0,0,0,0.1)' }}>
              <Typography variant="body2" color="text.secondary">
                {repoFilter ? `No pipeline found for ${repoFilter}` : 'No active pipelines. Execute a workflow from the Workflows page to see live orchestration.'}
              </Typography>
            </Box>
          ) : (
            filtered.map((item) => (
              <Card key={item.id}>
                <CardContent>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="subtitle1" fontWeight={700}>{item.repo}</Typography>
                      <Box component="code" sx={branchCodeSx}>{item.branch}</Box>
                      <Box component="code" sx={shaCodeSx}>{item.commitSha}</Box>
                    </Box>
                  </Box>

                  {/* Live orchestration diagram */}
                  <Box sx={{
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.45)',
                    border: '1px solid rgba(255,255,255,0.65)',
                    backdropFilter: 'blur(8px)',
                    overflow: 'hidden',
                  }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, p: 2, pb: 0 }}>
                      Live Orchestration Flow
                    </Typography>
                    <LiveOrchestration repoName={item.repo} recordId={undefined} />
                  </Box>

                  {/* Stage stepper + logs */}
                  <Divider sx={{ my: 2 }} />
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, mb: 1.5 }}>
                    Stage Execution Detail
                  </Typography>
                  <StageStepper stageLogs={item.stageLogs as StageLog[]} />

                  {item.deployedUrl && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Deployed Endpoint:</Typography>
                      <Button size="small" endIcon={<OpenInNewIcon sx={{ fontSize: '12px !important' }} />} href={item.deployedUrl} target="_blank"
                        sx={{ color: ACCENT, fontSize: 12, p: 0, minWidth: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                        {item.deployedUrl}
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </>
      )}
    </Box>
  );
}
