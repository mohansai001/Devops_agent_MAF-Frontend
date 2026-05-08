export interface WorkflowAgent {
  id: string;
  label: string;
  color: string;
  task: string;
  prompt?: string;
  success?: string;
}

export interface Workflow {
  id: string;
  name: string;
  agents: WorkflowAgent[];
  createdAt: string;
  repository?: string;
}

export interface WorkflowExecution {
  workflowId: string;
  repository: string;
  startedAt: string;
  status: 'running' | 'completed' | 'failed';
}

const STORAGE_KEY = 'vida_workflows';
const EXECUTION_KEY = 'vida_current_execution';

export function getWorkflows(): Workflow[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt'>): Workflow {
  const workflows = getWorkflows();
  const newWorkflow: Workflow = {
    ...workflow,
    id: `wf-${Date.now()}`,
    createdAt: new Date().toLocaleString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...workflows, newWorkflow]));
  return newWorkflow;
}

export function deleteWorkflow(id: string): void {
  const workflows = getWorkflows().filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
}

export function startWorkflowExecution(workflowId: string, repository: string): void {
  const execution: WorkflowExecution = {
    workflowId,
    repository,
    startedAt: new Date().toISOString(),
    status: 'running'
  };
  localStorage.setItem(EXECUTION_KEY, JSON.stringify(execution));
}

export function getCurrentExecution(): WorkflowExecution | null {
  try {
    const execution = localStorage.getItem(EXECUTION_KEY);
    return execution ? JSON.parse(execution) : null;
  } catch {
    return null;
  }
}

export function clearCurrentExecution(): void {
  localStorage.removeItem(EXECUTION_KEY);
}

// Demo workflow for testing
export function createDemoWorkflow(): void {
  const demoWorkflow: Workflow = {
    id: 'demo-workflow-1',
    name: 'Full Stack CI/CD Pipeline',
    createdAt: new Date().toLocaleString(),
    repository: 'frontend-app',
    agents: [
      {
        id: 'agent-0',
        label: 'Code Analysis',
        color: '#3B82F6',
        task: 'Analyzing code quality and security vulnerabilities...',
        success: 'Code analysis complete — no critical issues found'
      },
      {
        id: 'agent-1',
        label: 'Build',
        color: '#10B981',
        task: 'Compiling and building application artifacts...',
        success: 'Build successful — artifacts generated'
      },
      {
        id: 'agent-2',
        label: 'Test Suite',
        color: '#F59E0B',
        task: 'Running comprehensive test suite...',
        success: 'All tests passed — 98% coverage achieved'
      },
      {
        id: 'agent-3',
        label: 'Security Scan',
        color: '#EF4444',
        task: 'Scanning for security vulnerabilities...',
        success: 'Security scan complete — no vulnerabilities detected'
      },
      {
        id: 'agent-4',
        label: 'Deploy',
        color: '#8B5CF6',
        task: 'Deploying to staging environment...',
        success: 'Deployment successful — application is live'
      }
    ]
  };
  
  const workflows = getWorkflows();
  if (!workflows.find(w => w.id === demoWorkflow.id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...workflows, demoWorkflow]));
  }
}
