import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Divider, Collapse, Drawer, Stack, useTheme } from '@mui/material';
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
import CloseIcon from '@mui/icons-material/Close';
import { approvals } from '../data/mockData';

const ACCENT = '#FF4D1C';

// ── Agent definitions (dynamic, up to 20) ────────────────────
const AGENT_ICONS = [SearchIcon, BuildIcon, StorageIcon, RocketLaunchIcon, GitHubIcon];
const AGENT_COLORS = ['#7C3AED', '#2563EB', '#D97706', '#059669', '#374151'];
const AGENT_LABELS = [
  'Tech Detection', 'CI Pipeline', 'Terraform', 'CD Pipeline', 'GitHub Actions',
  'Security Scan', 'Docker Build', 'Helm Chart', 'Unit Tests', 'Integration Tests',
  'Lint', 'Code Coverage', 'Release', 'Notification', 'Cleanup',
  'Monitoring', 'Rollback', 'Approval', 'Infra Audit', 'Finalizer',
];
const AGENT_SHORT_NAMES = [
  'Tech', 'CI', 'Terraform', 'CD', 'GitHub',
  'Security', 'Docker', 'Helm', 'Tests', 'Integration',
  'Lint', 'Coverage', 'Release', 'Notify', 'Cleanup',
  'Monitor', 'Rollback', 'Approve', 'Audit', 'Final',
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

// Create up to 20 agents dynamically
const AGENTS = Array.from({ length: 20 }, (_, i) => ({
  key: AGENT_LABELS[i],
  icon: AGENT_ICONS[i % AGENT_ICONS.length],
  color: AGENT_COLORS[i % AGENT_COLORS.length],
  label: AGENT_LABELS[i],
  shortName: AGENT_SHORT_NAMES[i],
  task: AGENT_TASKS[i],
  success: AGENT_SUCCESS[i],
}));

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

// ── Animated arrow between orchestrator and agent ────────────
function Arrow({ phase, color }: { phase: AgentPhase; color: string }) {
  const down    = phase === 'delegating' || phase === 'working' || phase === 'returning' || phase === 'done';
  const up      = phase === 'returning' || phase === 'done';
  const animate = phase === 'delegating';
  const animUp  = phase === 'returning';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 52, position: 'relative' }}>
      {/* Down line */}
      <Box sx={{
        width: 2, flex: 1,
        bgcolor: down ? color : 'rgba(0,0,0,0.08)',
        borderRadius: 1, position: 'relative', overflow: 'hidden',
        transition: 'background-color 0.3s',
      }}>
        {animate && (
          <Box sx={{
            position: 'absolute', left: 0, right: 0, height: '40%',
            background: `linear-gradient(180deg, transparent, ${color})`,
            animation: 'arrowDown 0.6s linear infinite',
            '@keyframes arrowDown': { '0%': { top: '-40%' }, '100%': { top: '100%' } },
          }} />
        )}
      </Box>
      {/* Arrowhead down */}
      <Box sx={{
        width: 0, height: 0,
        borderLeft: '4px solid transparent', borderRight: '4px solid transparent',
        borderTop: `6px solid ${down ? color : 'rgba(0,0,0,0.08)'}`,
        transition: 'border-top-color 0.3s',
      }} />

      {/* Return line (up) */}
      {up && (
        <>
          <Box sx={{ width: 0, height: 0, mt: 0.5,
            borderLeft: '4px solid transparent', borderRight: '4px solid transparent',
            borderBottom: `6px solid ${color}`,
          }} />
          <Box sx={{
            width: 2, flex: 1, bgcolor: color, borderRadius: 1,
            position: 'relative', overflow: 'hidden', opacity: 0.6,
          }}>
            {animUp && (
              <Box sx={{
                position: 'absolute', left: 0, right: 0, height: '40%',
                background: `linear-gradient(0deg, transparent, ${color})`,
                animation: 'arrowUp 0.6s linear infinite',
                '@keyframes arrowUp': { '0%': { bottom: '-40%' }, '100%': { bottom: '100%' } },
              }} />
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

// ── Single agent node ────────────────────────────────────────
function AgentNode({ agent, state }: { agent: typeof AGENTS[0]; state: AgentState }) {
  const Icon = agent.icon;
  const { phase } = state;

  const isIdle      = phase === 'idle';
  const isDelegating = phase === 'delegating';
  const isWorking   = phase === 'working';
  const isReturning = phase === 'returning';
  const isDone      = phase === 'done';
  const isFailed    = phase === 'failed';
  const isActive    = isDelegating || isWorking || isReturning;

  const borderColor = isDone ? '#059669' : isFailed ? '#DC2626' : isActive ? agent.color : 'rgba(0,0,0,0.08)';
  const bgColor     = isDone ? 'rgba(5,150,105,0.06)' : isFailed ? 'rgba(220,38,38,0.06)' : isActive ? `${agent.color}10` : 'rgba(255,255,255,0.3)';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 0 }}>
      {/* Arrow */}
      <Arrow phase={phase} color={agent.color} />

      {/* Return message bubble */}
      <Box sx={{
        minHeight: 20, mb: 0.5,
        opacity: (isDone || isFailed || isReturning) ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        <Typography sx={{
          fontSize: 8.5, fontWeight: 700, px: 0.8, py: 0.2, borderRadius: 1,
          bgcolor: isFailed ? 'rgba(220,38,38,0.08)' : 'rgba(5,150,105,0.08)',
          color: isFailed ? '#DC2626' : '#059669',
          border: `1px solid ${isFailed ? 'rgba(220,38,38,0.2)' : 'rgba(5,150,105,0.2)'}`,
          whiteSpace: 'nowrap',
        }}>
          {isFailed ? 'Failed ✗' : state.returnMsg || agent.success}
        </Typography>
      </Box>

      {/* Node box */}
      <Box sx={{
        width: '100%', p: 1, borderRadius: 2,
        border: `2px solid ${borderColor}`,
        bgcolor: bgColor,
        backdropFilter: 'blur(6px)',
        transition: 'all 0.3s ease',
        transform: isActive ? 'translateY(-2px)' : 'none',
        boxShadow: isActive
          ? `0 4px 16px ${agent.color}25, 3px 3px 10px rgba(0,0,0,0.06), -3px -3px 10px rgba(255,255,255,0.7)`
          : `2px 2px 8px rgba(0,0,0,0.05), -2px -2px 8px rgba(255,255,255,0.6)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.4,
        position: 'relative', overflow: 'hidden',
        minHeight: 72,
      }}>
        {/* shimmer when working */}
        {isWorking && (
          <Box sx={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(90deg, transparent, ${agent.color}18, transparent)`,
            animation: 'shimmer 1.2s ease-in-out infinite',
            '@keyframes shimmer': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
          }} />
        )}

        {/* Icon circle */}
        <Box sx={{
          width: 28, height: 28, borderRadius: '50%',
          bgcolor: isIdle ? 'rgba(0,0,0,0.04)' : `${agent.color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <Icon sx={{ fontSize: 14, color: isIdle ? '#9CA3AF' : isDone ? '#059669' : isFailed ? '#DC2626' : agent.color }} />
          {/* pulse ring when active */}
          {isActive && (
            <Box sx={{
              position: 'absolute', inset: -3, borderRadius: '50%',
              border: `1.5px solid ${agent.color}`,
              animation: 'ringPulse 1s ease-in-out infinite',
              '@keyframes ringPulse': { '0%,100%': { opacity: 0.8, transform: 'scale(1)' }, '50%': { opacity: 0.2, transform: 'scale(1.15)' } },
            }} />
          )}
        </Box>

        {/* Label */}
        <Typography sx={{
          fontSize: 9, fontWeight: isActive ? 700 : 600, textAlign: 'center', lineHeight: 1.2,
          color: isIdle ? '#9CA3AF' : isDone ? '#059669' : isFailed ? '#DC2626' : agent.color,
        }}>
          {agent.label}
        </Typography>

        {/* Status line */}
        <Typography sx={{
          fontSize: 8, textAlign: 'center', lineHeight: 1.2, color: '#9CA3AF',
          opacity: isActive ? 1 : 0, transition: 'opacity 0.3s',
          px: 0.3,
        }}>
          {isWorking ? agent.task : isDelegating ? 'Receiving task...' : isReturning ? 'Reporting back...' : ''}
        </Typography>

        {/* Bottom status badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mt: 'auto' }}>
          {isDone    && <CheckCircleIcon sx={{ fontSize: 10, color: '#059669' }} />}
          {isFailed  && <ErrorIcon sx={{ fontSize: 10, color: '#DC2626' }} />}
          {isWorking && <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: agent.color, animation: 'dot 0.8s ease-in-out infinite', '@keyframes dot': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } } }} />}
          <Typography sx={{
            fontSize: 8, fontWeight: 700,
            color: isDone ? '#059669' : isFailed ? '#DC2626' : isActive ? agent.color : '#D1D5DB',
          }}>
            {isDone ? 'Done' : isFailed ? 'Failed' : isDelegating ? 'Receiving' : isWorking ? 'Working' : isReturning ? 'Returning' : 'Idle'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

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
                  bgcolor: isSelected ? 'rgba(255,77,28,0.07)' : 'transparent',
                  border: isSelected ? '1px solid rgba(255,77,28,0.25)' : '1px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': hasLogs ? { bgcolor: 'rgba(255,77,28,0.05)' } : {},
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
            : 'rgba(255,77,28,0.15)'
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

// ── Live orchestration diagram ───────────────────────────────
function LiveOrchestration({ repoName }: { repoName: string }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
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

  // Dummy per-agent logs for demo (replace with real data as needed)
  const agentLogs: StageLog[][] = AGENTS.map((agent, idx) => [
    { stage: 'Initialize', status: 'done', logs: ['Initializing agent...', '✓ Ready'] },
    { stage: 'Run Task', status: 'done', logs: [`${agent.task}`, '✓ Task complete'] },
    { stage: 'Finalize', status: 'done', logs: ['Finalizing...', '✓ Success'] },
  ]);
  
  // Real-time logs state
  const [realTimeLogs, setRealTimeLogs] = useState<{ [key: number]: string[] }>({});
  
  // Ref for agent stack scrolling
  const agentStackRef = useRef<HTMLDivElement>(null);
  const BATCH_SIZE = 5;
  const [batchIdx, setBatchIdx] = useState(0);
  const [agentStates, setAgentStates] = useState<AgentState[]>(getInitialStates(AGENTS.length));
  const [orchMsg, setOrchMsg] = useState('Initialising pipeline...');
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };

  const schedule = (fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timerRef.current.push(t);
  };

  const setPhase = (idx: number, phase: AgentPhase, returnMsg = '') => {
    setAgentStates(prev => prev.map((s, i) => i === idx ? { phase, returnMsg } : s));
    
    // Auto-select currently active agent and add real-time logs
    if (phase === 'delegating' || phase === 'working' || phase === 'returning') {
      setSelectedAgentIdx(idx);
      
      // Auto-scroll to the active agent in the stack
      setTimeout(() => {
        if (agentStackRef.current) {
          const agentElement = agentStackRef.current.children[idx + 1] as HTMLElement; // +1 for the header
          if (agentElement) {
            agentElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }
      }, 100);
      
      // Add real-time log entries
      const agent = AGENTS[idx];
      setRealTimeLogs(prev => ({
        ...prev,
        [idx]: [
          ...(prev[idx] || []),
          phase === 'delegating' ? `[${new Date().toLocaleTimeString()}] Receiving task from orchestrator...` :
          phase === 'working' ? `[${new Date().toLocaleTimeString()}] ${agent.task}` :
          `[${new Date().toLocaleTimeString()}] Reporting results back to orchestrator...`
        ]
      }));
    }
    
    // Add completion log
    if (phase === 'done') {
      const agent = AGENTS[idx];
      setRealTimeLogs(prev => ({
        ...prev,
        [idx]: [
          ...(prev[idx] || []),
          `[${new Date().toLocaleTimeString()}] ✓ ${agent.success}`
        ]
      }));
    }
    
    if (phase === 'failed') {
      setRealTimeLogs(prev => ({
        ...prev,
        [idx]: [
          ...(prev[idx] || []),
          `[${new Date().toLocaleTimeString()}] ✗ Task failed`
        ]
      }));
    }
  };

  // Sliding window: always show 5 agents, slide forward as each completes
  const WINDOW_SIZE = 5;
  const [windowStart, setWindowStart] = useState(0);

  const runSimulation = () => {
    clearTimers();
    setAgentStates(getInitialStates(AGENTS.length));
    setRealTimeLogs({});
    setDone(false);
    setStarted(true);
    setWindowStart(0);
    setSelectedAgentIdx(null);
    setOrchMsg('Pipeline triggered — starting orchestration...');
    runAgents(0, 0);
  };

  const runAgents = (idx: number, currentWindow: number) => {
    if (idx >= AGENTS.length) { setDone(true); return; }
    const agent = AGENTS[idx];
    let offset = 0;
    schedule(() => { setOrchMsg(`Delegating to ${agent.label} Agent →`); setPhase(idx, 'delegating'); }, offset);
    offset += T_DELEGATE;
    schedule(() => { setPhase(idx, 'working'); setOrchMsg(`Waiting for ${agent.label} Agent...`); }, offset);
    offset += T_WORK;
    schedule(() => { setPhase(idx, 'returning'); setOrchMsg(`${agent.label} Agent returning result ↑`); }, offset);
    offset += T_RETURN;
    schedule(() => {
      setPhase(idx, 'done', agent.success);
      setOrchMsg(idx < AGENTS.length - 1 ? `✓ ${agent.label} complete` : '✓ All agents complete — pipeline successful!');
      // Slide window: once agent at position windowStart+WINDOW_SIZE-1 completes, advance window
      const nextWindow = idx >= currentWindow + WINDOW_SIZE - 1 ? currentWindow + 1 : currentWindow;
      if (nextWindow !== currentWindow) setWindowStart(nextWindow);
      schedule(() => runAgents(idx + 1, nextWindow), 400);
    }, offset);
  };

  useEffect(() => { return () => clearTimers(); }, []);

  const visibleAgents = AGENTS.slice(windowStart, windowStart + WINDOW_SIZE);

  return (
  <Box sx={{ width: '100%', height: '70vh', bgcolor: colors.bg, borderRadius: 3, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px #0001', p: 2, display: 'flex', gap: 2 }}>
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
                <agent.icon sx={{ fontSize: 18, color: isIdle ? '#9CA3AF' : isDone ? '#059669' : isFailed ? '#DC2626' : agent.color }} />
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
                {isWorking && <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: agent.color, animation: 'dot 0.8s ease-in-out infinite', '@keyframes dot': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } } }} />}
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

  const branchCodeSx = { bgcolor: 'rgba(255,77,28,0.07)', color: ACCENT, px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11 };
  const shaCodeSx    = { bgcolor: 'rgba(0,0,0,0.05)', color: '#6B7280', px: 0.8, py: 0.2, borderRadius: 1, fontSize: 11 };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {filtered.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center', borderRadius: 2, border: '1px dashed rgba(0,0,0,0.1)' }}>
          <Typography variant="body2" color="text.secondary">No pipeline found for <strong>{repoFilter}</strong></Typography>
        </Box>
      ) : filtered.map((item) => (
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
              <LiveOrchestration repoName={item.repo} />
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
      ))}
    </Box>
  );
}
