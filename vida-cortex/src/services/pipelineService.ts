import { apiClient } from './api';

// ========================================
// TYPE DEFINITIONS (matching mockData.ts)
// ========================================

export interface Pipeline {
  id: number;
  repo: string;
  branch: string;
  techStack: string;
  stage: string;
  status: string;
  appName: string;
  deployTarget: string;
  deployedUrl: string;
  timestamp: string;
}

export interface StageLog {
  stage: string;
  status: 'done' | 'active' | 'pending' | 'failed';
  logs: string[];
}

export interface Approval {
  id: number;
  repo: string;
  branch: string;
  commitSha: string;
  status: string;
  activeStep: number;
  stageLogs: StageLog[];
  deployedUrl: string;
}

export interface Repository {
  id: number;
  name: string;
  branch: string;
  language: string;
  lastCommit: string;
  status: string;
  stars: number;
}

export interface Build {
  id: number;
  repo: string;
  branch: string;
  status: string;
  duration: string;
  timestamp: string;
}

export interface Deployment {
  id: number;
  repo: string;
  environment: string;
  status: string;
  version: string;
  timestamp: string;
}

// ========================================
// API SERVICE FUNCTIONS
// ========================================

// Pipelines
export async function fetchPipelines(): Promise<Pipeline[]> {
  return apiClient.get<Pipeline[]>('/pipelines');
}

export async function fetchPipelineById(id: number): Promise<Pipeline> {
  return apiClient.get<Pipeline>(`/pipelines/${id}`);
}

// Approvals
export async function fetchApprovals(): Promise<Approval[]> {
  return apiClient.get<Approval[]>('/approvals');
}

export async function fetchApprovalById(id: number): Promise<Approval> {
  return apiClient.get<Approval>(`/approvals/${id}`);
}

export async function approveWorkflow(id: number): Promise<void> {
  return apiClient.post<void>(`/approvals/${id}/approve`, {});
}

export async function rejectWorkflow(id: number): Promise<void> {
  return apiClient.post<void>(`/approvals/${id}/reject`, {});
}

// Repositories
export async function fetchRepositories(): Promise<Repository[]> {
  return apiClient.get<Repository[]>('/repositories');
}

export async function syncRepository(repoId: number): Promise<void> {
  return apiClient.post<void>(`/repositories/${repoId}/sync`, {});
}

// Builds
export async function fetchBuilds(): Promise<Build[]> {
  return apiClient.get<Build[]>('/builds');
}

export async function fetchBuildsByRepo(repoName: string): Promise<Build[]> {
  return apiClient.get<Build[]>(`/builds?repo=${repoName}`);
}

export async function triggerBuild(repoName: string, branch: string): Promise<void> {
  return apiClient.post<void>('/builds/trigger', { repo: repoName, branch });
}

// Deployments
export async function fetchDeployments(): Promise<Deployment[]> {
  return apiClient.get<Deployment[]>('/deployments');
}

export async function fetchDeploymentsByRepo(repoName: string): Promise<Deployment[]> {
  return apiClient.get<Deployment[]>(`/deployments?repo=${repoName}`);
}

export async function deployToEnvironment(
  repoName: string,
  environment: string,
  version: string
): Promise<void> {
  return apiClient.post<void>('/deployments/deploy', {
    repo: repoName,
    environment,
    version,
  });
}

// Orchestration Logs (for real-time updates)
export async function fetchOrchestrationLogs(approvalId: number): Promise<StageLog[]> {
  return apiClient.get<StageLog[]>(`/approvals/${approvalId}/logs`);
}

// WebSocket for real-time updates (optional)
export function subscribeToOrchestrationUpdates(
  approvalId: number,
  onUpdate: (stageLogs: StageLog[]) => void
): () => void {
  const ws = new WebSocket(`ws://localhost:8000/ws/approvals/${approvalId}`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onUpdate(data.stageLogs);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  // Return cleanup function
  return () => {
    ws.close();
  };
}
