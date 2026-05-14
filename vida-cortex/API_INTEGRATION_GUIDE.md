# 🚀 API Integration Guide

## Overview

Your VIDA Cortex application is **100% ready for API integration**! The current architecture uses static mock data, but I've created a complete API service layer that you can swap in with minimal changes.

## ✅ What's Already Done

### 1. **Type-Safe API Client** (`src/services/api.ts`)

- Generic HTTP client with TypeScript support
- Automatic JSON serialization
- Error handling
- Easy to extend

### 2. **Service Layer**

- `pipelineService.ts` - All pipeline/approval/build/deployment endpoints
- `workflowService.ts` - Workflow and execution management
- Fully typed with interfaces matching your existing data

### 3. **React Hooks** (`src/hooks/useApi.ts`)

- `useApi` - Fetch data once
- `usePolling` - Auto-refresh data at intervals
- `useMutation` - POST/PUT/DELETE operations
- All with loading/error states built-in

## 🔄 Migration Steps

### Step 1: Set up environment variables

```bash
# Copy the example file
cp .env.example .env

# Update with your API URL
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Step 2: Replace static imports (One-line changes!)

#### Before (Static Data):

```typescript
import { pipelines } from '../data/mockData';

function Dashboard() {
  return <div>{pipelines.map(...)}</div>;
}
```

#### After (API Data):

```typescript
import { useApi } from '../hooks/useApi';
import { fetchPipelines } from '../services/pipelineService';

function Dashboard() {
  const { data: pipelines, loading, error } = useApi(fetchPipelines);

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return <div>{pipelines?.map(...)}</div>;
}
```

### Step 3: Enable Real-time Updates (Optional)

#### For Auto-Refresh (Polling):

```typescript
// Refresh data every 5 seconds
const { data, loading } = usePolling(fetchPipelines, 5000);
```

#### For WebSocket Updates:

```typescript
useEffect(() => {
  const unsubscribe = subscribeToOrchestrationUpdates(
    approvalId,
    (updatedData) => {
      setLogs(updatedData);
    },
  );
  return unsubscribe;
}, [approvalId]);
```

## 📝 Page-by-Page Migration

### ✅ Dashboard.tsx

**What to replace:**

```typescript
// OLD
import { pipelines } from "../data/mockData";

// NEW
import { usePolling } from "../hooks/useApi";
import { fetchPipelines } from "../services/pipelineService";

const { data: pipelines } = usePolling(fetchPipelines, 10000); // Refresh every 10s
```

### ✅ Approvals.tsx

**What to replace:**

```typescript
// OLD
import { approvals } from "../data/mockData";

// NEW
import { useApi } from "../hooks/useApi";
import { fetchApprovals, fetchApprovalById } from "../services/pipelineService";

// For list view
const { data: approvals } = useApi(fetchApprovals);

// For single approval with real-time logs
const { data: approval } = useApi(() => fetchApprovalById(id));

// WebSocket for live orchestration updates
useEffect(() => {
  return subscribeToOrchestrationUpdates(id, setStageLogs);
}, [id]);
```

### ✅ Builds.tsx

```typescript
// OLD
import { pipelines } from "../data/mockData";

// NEW
import { useApi } from "../hooks/useApi";
import { fetchBuilds } from "../services/pipelineService";

const { data: builds, refetch } = useApi(fetchBuilds);

// Trigger new build
const { mutate: triggerBuild } = useMutation(({ repo, branch }) =>
  triggerBuild(repo, branch),
);

await triggerBuild({ repo: "payment-service", branch: "main" });
refetch(); // Refresh the list
```

### ✅ Deployments.tsx

```typescript
// OLD
import { pipelines } from "../data/mockData";

// NEW
import { useApi, useMutation } from "../hooks/useApi";
import {
  fetchDeployments,
  deployToEnvironment,
} from "../services/pipelineService";

const { data: deployments } = useApi(fetchDeployments);

const { mutate: deploy } = useMutation(({ repo, env, version }) =>
  deployToEnvironment(repo, env, version),
);
```

### ✅ Repositories.tsx

```typescript
// OLD
import { repositories } from "../data/mockData";

// NEW
import { useApi } from "../hooks/useApi";
import { fetchRepositories } from "../services/pipelineService";

const { data: repositories } = useApi(fetchRepositories);
```

### ✅ AgentBuilder.tsx / Onboarding.tsx

```typescript
// OLD
import { getWorkflows, saveWorkflow } from '../data/workflowStore';

// NEW
import { useApi, useMutation } from '../hooks/useApi';
import { fetchWorkflows, createWorkflow } from '../services/workflowService';

const { data: workflows } = useApi(fetchWorkflows);

const { mutate: createNew } = useMutation(createWorkflow);

const newWorkflow = await createNew({
  name: 'Deploy Pipeline',
  agents: [...],
});
```

## 🎯 Backend API Requirements

Your backend should provide these endpoints:

### Pipelines

- `GET /api/pipelines` - List all pipelines
- `GET /api/pipelines/:id` - Get single pipeline

### Approvals

- `GET /api/approvals` - List all approvals
- `GET /api/approvals/:id` - Get single approval with logs
- `GET /api/approvals/:id/logs` - Get orchestration logs
- `POST /api/approvals/:id/approve` - Approve workflow
- `POST /api/approvals/:id/reject` - Reject workflow

### Builds

- `GET /api/builds` - List all builds
- `GET /api/builds?repo=xyz` - Filter by repo
- `POST /api/builds/trigger` - Trigger new build

### Deployments

- `GET /api/deployments` - List all deployments
- `POST /api/deployments/deploy` - Deploy to environment

### Workflows

- `GET /api/workflows` - List all workflows
- `GET /api/workflows/:id` - Get single workflow
- `POST /api/workflows` - Create new workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `POST /api/workflows/execute` - Execute workflow

### WebSocket (Optional for Real-time)

- `ws://your-domain/ws/approvals/:id` - Live orchestration updates

## 📊 Data Format Example

Your API should return data in the same format as `mockData.ts`:

```json
// GET /api/pipelines
[
  {
    "id": 1,
    "repo": "payment-service",
    "branch": "main",
    "techStack": "Node.js",
    "stage": "CD Pipeline",
    "status": "Success",
    "appName": "payment-app",
    "deployTarget": "AWS EKS",
    "deployedUrl": "https://payment.vida.io",
    "timestamp": "2024-01-15 10:30"
  }
]

// GET /api/approvals/:id
{
  "id": 1,
  "repo": "payment-service",
  "branch": "main",
  "commitSha": "a1b2c3d",
  "status": "Running",
  "activeStep": 1,
  "stageLogs": [
    {
      "stage": "Tech Detection",
      "status": "done",
      "logs": ["[10:00] Agent triggered...", "..."]
    }
  ],
  "deployedUrl": "https://payment.vida.io"
}
```

## 🔥 Pro Tips

### 1. **Gradual Migration**

You can mix static and API data during migration:

```typescript
// Use API in production, mock in development
const USE_API = import.meta.env.PROD;

const { data: pipelines } = USE_API
  ? useApi(fetchPipelines)
  : { data: mockPipelines, loading: false, error: null };
```

### 2. **Error Boundaries**

Wrap your pages in error boundaries:

```typescript
<ErrorBoundary fallback={<ErrorPage />}>
  <Dashboard />
</ErrorBoundary>
```

### 3. **Loading States**

Use skeleton loaders for better UX:

```typescript
if (loading) return <Skeleton variant="rectangular" height={400} />;
```

### 4. **Caching (Optional)**

For better performance, consider adding React Query:

```bash
npm install @tanstack/react-query
```

## ✨ Summary

**Your application is 100% API-ready!**

All you need to do is:

1. ✅ Set up `.env` with your API URL
2. ✅ Replace `import { data } from mockData` with `useApi(fetchData)`
3. ✅ Handle loading/error states
4. ✅ (Optional) Add WebSocket for real-time updates

The orchestration flow will work **exactly the same** - just with live data instead of static data!

**Estimated migration time per page: 5-10 minutes** 🚀
