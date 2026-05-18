# 🚀 What Happens When You Click "Run" in Approvals Page

## Overview

The **"Run" button** in the Approvals page triggers an **orchestrated AI agent workflow execution** with real-time visualization and WebSocket-based logging.

## Step-by-Step Flow

### 1. **Button Click** (`runSimulation()`)

When you click the **"▶ Run"** button:

```typescript
const runSimulation = async () => {
  console.log("Run button clicked");

  if (!started) {
    // Clear previous logs
    sessionStorage.removeItem("realTimeLogs");
    setRealTimeLogs({});

    // Show loading state
    setWaitingForLogs(true);

    // Connect to WebSocket
    connectWebSocket();

    // Fetch agents from API
    if (recordId) {
      const fetchedAgents = await fetchAgentsFromAPI();
      // Build agent array from API response
    }

    setStarted(true);
  }
};
```

**What happens:**

- ✅ Clears previous session logs
- ✅ Shows "Waiting for agents to start..." loading overlay
- ✅ Connects to WebSocket (`ws://localhost:8000/logs/ws/logs`)
- ✅ Fetches agents from API if `recordId` is present
- ✅ Initializes agent states

---

### 2. **API Call to Fetch Agents**

If a `recordId` parameter exists in the URL:

```typescript
const fetchAgentsFromAPI = async () => {
  const response = await fetch(
    `https://devopsagent-backend-aegmehh9gcetepbf.eastus-01.azurewebsites.net/agents/agent/${recordId}`,
  );
  const data = await response.json();

  // Extract agents from various possible paths
  let agentsList = [];
  if (data?.raw_representation?.tools) {
    agentsList = data.raw_representation.tools;
  }
  // ... other extraction logic

  return parsedAgents;
};
```

**What happens:**

- 🌐 Calls API: `https://devopsagent-backend-aegmehh9gcetepbf.eastus-01.azurewebsites.net/agents/agent/{recordId}`
- 📦 Receives agent configuration (tools/agents list)
- 🔍 Parses agent names, descriptions, parameters
- 🎨 Maps to UI format with colors and icons

**API Response Example:**

```json
{
  "raw_representation": {
    "tools": [
      {
        "name": "github_agent",
        "description": "Analyzes GitHub repository"
      },
      {
        "name": "yaml_builder",
        "description": "Generates CI/CD YAML configuration"
      },
      {
        "name": "terraform_agent",
        "description": "Provisions infrastructure with Terraform"
      }
    ]
  }
}
```

---

### 3. **Build Agent Array**

Agents are built from one of three sources (priority order):

#### **A. From API Response** (if `recordId` present and API returns agents)

```typescript
{
  label: "Github Agent",
  task: "Analyzes GitHub repository",
  success: "Github Agent completed successfully",
  color: "#3B82F6",
  icon: SearchIcon,
  key: "github_agent"
}
```

#### **B. From Saved Workflow** (if `currentExecution` exists)

```typescript
// Uses workflow saved in localStorage
currentWorkflow.agents.map((agent) => ({
  label: agent.label,
  task: agent.task,
  prompt: agent.prompt, // ✅ Custom prompts from Agent Builder
  success: agent.success,
  color: agent.color,
}));
```

#### **C. Default Fallback Agents**

```typescript
[
  { label: "Github", task: "Analyzing code quality...", color: "#3B82F6" },
  { label: "Yaml", task: "Compiling and building...", color: "#10B981" },
  { label: "Terraform", task: "Running automated tests...", color: "#F59E0B" },
];
```

---

### 4. **WebSocket Connection**

Connects to backend WebSocket for real-time logs:

```typescript
const connectWebSocket = () => {
  const ws = new WebSocket("ws://localhost:8000/logs/ws/logs");

  ws.onopen = () => {
    console.log("✓ WebSocket connected");
  };

  ws.onmessage = (event) => {
    const logMessage = event.data;
    // Parse agent name from log: [agent_name] log message
    // Update agent state based on log content
    // Add log to real-time panel
  };
};
```

**WebSocket Flow:**

1. **Connect** → `ws://localhost:8000/logs/ws/logs`
2. **Receive logs** → Real-time stream from backend
3. **Parse logs** → Extract agent name from `[agent_name]` format
4. **Update UI** → Show logs in agent panels
5. **Update status** → Change agent states (working → done → failed)

**Example Log Messages:**

```
[github_agent] Called with prompt: Analyze repository structure
[github_agent] Processing files...
[github_agent] Successfully generated repository analysis
[yaml_builder] Called with prompt: Generate CI/CD YAML
[yaml_builder] Successfully generated ci-cd.yaml
```

---

### 5. **Agent State Machine**

Each agent goes through these phases:

```
idle → delegating → working → returning → done
                                        ↘ failed
```

**Phase Transitions:**

| Phase          | Visual                          | Duration | Triggered By                |
| -------------- | ------------------------------- | -------- | --------------------------- |
| **idle**       | Gray, no animation              | -        | Initial state               |
| **delegating** | Blue glow, arrow down           | 900ms    | Orchestrator delegates task |
| **working**    | Shimmer animation, pulsing ring | 1800ms   | Agent processing            |
| **returning**  | Arrow up animation              | 800ms    | Agent reports back          |
| **done**       | Green checkmark ✓               | -        | Success message received    |
| **failed**     | Red error icon ✗                | -        | Error in logs               |

**State Updates from WebSocket:**

```typescript
if (logMessage.includes("Called with prompt")) {
  setPhase(agentIndex, "working");
} else if (logMessage.includes("Successfully generated")) {
  setPhase(agentIndex, "done", successMessage);
} else if (logMessage.includes("Error")) {
  setPhase(agentIndex, "failed");
}
```

---

### 6. **Real-Time Log Display**

Logs are displayed in a panel on the right side:

```typescript
const [realTimeLogs, setRealTimeLogs] = useState<{ [key: number]: string[] }>(
  {},
);

// Add log to specific agent
setRealTimeLogs((prev) => ({
  ...prev,
  [agentIndex]: [...(prev[agentIndex] || []), logMessage],
}));
```

**Log Panel Features:**

- ✅ Per-agent log sections
- ✅ Auto-scroll to active agent
- ✅ Color-coded log messages (green=success, red=error, orange=progress)
- ✅ Real-time updates as logs arrive
- ✅ Session persistence (survives page refresh)

---

### 7. **Visual Orchestration**

The UI shows a visual flow:

```
┌─────────────────────────────────────┐
│    🤖 Orchestration Agent           │
│    ✓ All agents complete!           │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────────┬─────────┐
        │                 │         │
    ┌───▼───┐        ┌───▼───┐  ┌───▼───┐
    │Github │        │ Yaml  │  │Terraform│
    │ ✓Done │        │Working│  │ Idle  │
    └───────┘        └───────┘  └───────┘
```

**Animation States:**

- **Idle**: Gray, no animation
- **Delegating**: Blue glow, task arrow animates down
- **Working**: Shimmer effect, pulsing ring, loading dots
- **Returning**: Arrow animates back up
- **Done**: Green border, checkmark icon

---

### 8. **Orchestrator Messages**

The top orchestrator node shows status:

```typescript
const [orchMsg, setOrchMsg] = useState("Initialising pipeline...");

// Updates during execution
setOrchMsg("Delegating to Github Agent →");
setOrchMsg("Waiting for Github Agent...");
setOrchMsg("Github Agent ↑");
setOrchMsg("✓ Github complete");
setOrchMsg("✓ All agents complete — pipeline successful!");
```

---

### 9. **Complete Execution Flow**

```
USER CLICKS RUN
    ↓
Clear Previous Data
    ↓
Show Loading Overlay
    ↓
Connect WebSocket (ws://localhost:8000/logs/ws/logs)
    ↓
Fetch Agents from API (https://devopsagent-backend-aegmehh9gcetepbf.eastus-01.azurewebsites.net/agents/agent/{recordId})
    ↓
Parse Agent Configuration
    ↓
Initialize Agent States (all "idle")
    ↓
Wait for WebSocket Logs
    ↓
[BACKEND STARTS EXECUTION]
    ↓
Receive Log: [github_agent] Called with prompt...
    ↓
Update Agent State: github_agent → "working"
Show shimmer animation, update orchestrator message
    ↓
Receive Log: [github_agent] Successfully generated...
    ↓
Update Agent State: github_agent → "done" ✓
    ↓
Receive Log: [yaml_builder] Called with prompt...
    ↓
Update Agent State: yaml_builder → "working"
    ↓
... (continues for all agents)
    ↓
All Agents Complete
    ↓
Show: "✓ All agents complete — pipeline successful!"
```

---

## Key Features During Execution

### ✅ **Real-Time Visualization**

- Live agent state updates
- Animated transitions between phases
- Color-coded status indicators

### ✅ **Real-Time Logging**

- WebSocket-based log streaming
- Per-agent log panels
- Auto-scroll to active agent
- Color-coded messages

### ✅ **Smart Agent Matching**

- Parses agent names from logs: `[agent_name]`
- Matches to UI agents by key/name
- Handles variations (github_agent → Github)

### ✅ **Session Persistence**

- Logs saved to `sessionStorage`
- Survives page refresh
- Cleared on new execution

### ✅ **Error Handling**

- Detects errors in logs
- Shows "failed" state with red icon
- Displays error messages

### ✅ **Sliding Window**

- Shows 5 agents at a time
- Navigate with ◀ ▶ buttons
- Auto-advances as agents complete

---

## Example Execution Timeline

| Time | Event              | UI Update                        |
| ---- | ------------------ | -------------------------------- |
| 0s   | User clicks Run    | Show loading overlay             |
| 0.1s | WebSocket connects | Console: "✓ WebSocket connected" |
| 0.2s | API fetched agents | Build agent array                |
| 0.3s | Initialize states  | All agents show "Idle"           |
| 1s   | First log arrives  | Agent 1 → "Working" (shimmer)    |
| 3s   | Agent 1 success    | Agent 1 → "Done" ✓               |
| 3.5s | Second log arrives | Agent 2 → "Working"              |
| 5s   | Agent 2 success    | Agent 2 → "Done" ✓               |
| ...  | ...                | ...                              |
| 15s  | All agents done    | "✓ All agents complete!"         |

---

## Console Output

When Run is clicked:

```javascript
Run button clicked
Record ID: abc123
Calling API: https://devopsagent-backend-aegmehh9gcetepbf.eastus-01.azurewebsites.net/agents/agent/abc123
API Response: {...}
Found tools in raw_representation: [...]
Building agents array from API response
New Agents: [{label: "Github", ...}, ...]
Connecting to WebSocket: ws://localhost:8000/logs/ws/logs
✓ WebSocket connected successfully
Waiting for WebSocket logs to drive execution...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📨 WebSocket message received:
Raw data: [github_agent] Called with prompt: Analyze repository
Extracted agent from log: github_agent
Matched agent index: 0
Adding log to agent index: 0
🔄 Agent github_agent started working
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Summary

When you click **"Run"** in the Approvals page:

1. ✅ **Clears previous data** and shows loading
2. ✅ **Connects to WebSocket** for real-time logs
3. ✅ **Fetches agents** from API (or uses saved workflow)
4. ✅ **Initializes visualization** with all agents in "idle"
5. ✅ **Waits for backend** to start execution
6. ✅ **Receives real-time logs** via WebSocket
7. ✅ **Updates agent states** based on log content
8. ✅ **Shows animations** (shimmer, pulsing, arrows)
9. ✅ **Displays logs** in per-agent panels
10. ✅ **Completes pipeline** when all agents finish

**It's a fully orchestrated, real-time, visual AI agent execution system!** 🚀
