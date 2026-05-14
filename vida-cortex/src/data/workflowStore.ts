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
  recordId?: number;
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

export function startWorkflowExecution(workflowId: string, repository: string, recordId?: number): void {
  const execution: WorkflowExecution = {
    workflowId,
    repository,
    startedAt: new Date().toISOString(),
    status: 'running',
    recordId
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

// Fetch workflows from API
export async function fetchWorkflowsFromAPI(): Promise<Workflow[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/sql/sql/get_workflows');
    const data = await response.json();
    
    // Transform API response to Workflow format
    const workflows: Workflow[] = data.map((wf: any) => {
      const detail = wf.details?.[0];
      const agents = detail?.agents || [];
      
      return {
        id: `wf-${wf.id}`,
        name: wf.name,
        createdAt: detail?.created_at || new Date().toISOString(),
        agents: agents.map((agentName: string, index: number) => {
          const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
          const labels: { [key: string]: string } = {
            'github_agent': 'Github',
            'yaml_agent': 'Yaml',
            'terraform_agent': 'Terraform'
          };
          
          return {
            id: `agent-${index}`,
            label: labels[agentName] || agentName.replace(/_agent$/, '').replace(/_/g, ' '),
            color: colors[index % colors.length],
            task: `Processing ${labels[agentName] || agentName}...`,
            success: `${labels[agentName] || agentName} completed successfully`
          };
        })
      };
    });
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    return workflows;
  } catch (error) {
    console.error('Failed to fetch workflows from API:', error);
    return getWorkflows(); // Fallback to localStorage
  }
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
        label: 'Github',
        color: '#3B82F6',
        task: 'Analyzing code quality and security vulnerabilities...',
        success: 'Code analysis complete — no critical issues found'
      },
      {
        id: 'agent-1',
        label: 'Yaml',
        color: '#10B981',
        task: 'Compiling and building application artifacts...',
        success: 'Build successful — artifacts generated'
      },
      {
        id: 'agent-2',
        label: 'Terraform',
        color: '#F59E0B',
        task: 'Running comprehensive test suite...',
        success: 'All tests passed — 98% coverage achieved'
      }
    ]
  };
  
  const workflows = getWorkflows();
  const existingIndex = workflows.findIndex(w => w.id === demoWorkflow.id);
  if (existingIndex >= 0) {
    workflows[existingIndex] = demoWorkflow;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...workflows, demoWorkflow]));
  }
}
