import { apiClient } from './api';

// ========================================
// TYPE DEFINITIONS (matching workflowStore.ts)
// ========================================

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

// ========================================
// API SERVICE FUNCTIONS
// ========================================

// Fetch all workflows
export async function fetchWorkflows(): Promise<Workflow[]> {
  return apiClient.get<Workflow[]>('/workflows');
}

// Fetch a single workflow by ID
export async function fetchWorkflowById(id: string): Promise<Workflow> {
  return apiClient.get<Workflow>(`/workflows/${id}`);
}

// Create a new workflow
export async function createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt'>): Promise<Workflow> {
  return apiClient.post<Workflow>('/workflows', workflow);
}

// Update an existing workflow
export async function updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
  return apiClient.put<Workflow>(`/workflows/${id}`, workflow);
}

// Delete a workflow
export async function deleteWorkflow(id: string): Promise<void> {
  return apiClient.delete<void>(`/workflows/${id}`);
}

// Execute a workflow
export async function executeWorkflow(workflowId: string, repository: string): Promise<WorkflowExecution> {
  return apiClient.post<WorkflowExecution>('/workflows/execute', {
    workflowId,
    repository,
  });
}

// Get current workflow execution
export async function fetchCurrentExecution(): Promise<WorkflowExecution | null> {
  try {
    return await apiClient.get<WorkflowExecution>('/workflows/current-execution');
  } catch (error) {
    return null;
  }
}

// Stop a running workflow execution
export async function stopWorkflowExecution(workflowId: string): Promise<void> {
  return apiClient.post<void>(`/workflows/${workflowId}/stop`, {});
}

// Get execution history for a workflow
export async function fetchWorkflowExecutionHistory(workflowId: string): Promise<WorkflowExecution[]> {
  return apiClient.get<WorkflowExecution[]>(`/workflows/${workflowId}/executions`);
}
