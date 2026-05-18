# 🎯 Quick Answer: What Happens When You Click "Run"?

## In Simple Terms

When you click the **"▶ Run"** button in the Approvals page, it starts an **orchestrated AI agent workflow execution** with beautiful real-time visualization.

## The 10-Second Version

1. **Connects to backend** via WebSocket
2. **Fetches agent configuration** from API
3. **Shows visual animation** of agents working
4. **Streams real-time logs** from backend
5. **Updates UI dynamically** as agents complete tasks

---

## What You See

### Before Clicking Run:

```
┌────────────────────────────────────┐
│  🤖 Orchestration Agent            │
│  Initialising pipeline...          │
└─────────────┬──────────────────────┘
              │
    ┌─────────┴──────┬────────┐
    │                │        │
┌───▼───┐      ┌────▼──┐  ┌──▼──┐
│Github │      │ Yaml  │  │ TF  │
│ Idle  │      │ Idle  │  │Idle │
└───────┘      └───────┘  └─────┘
```

### After Clicking Run:

```
┌────────────────────────────────────┐
│  🤖 Orchestration Agent            │
│  Waiting for Github Agent...       │
└─────────────┬──────────────────────┘
              │
    ┌─────────┴──────┬────────┐
    │                │        │
┌───▼───┐      ┌────▼──┐  ┌──▼──┐
│Github │      │ Yaml  │  │ TF  │
│Working│      │ Idle  │  │Idle │
│ ⋯⋯⋯   │      │       │  │     │
└───────┘      └───────┘  └─────┘
```

### When Complete:

```
┌────────────────────────────────────┐
│  🤖 Orchestration Agent            │
│  ✓ All agents complete!            │
└─────────────┬──────────────────────┘
              │
    ┌─────────┴──────┬────────┐
    │                │        │
┌───▼───┐      ┌────▼──┐  ┌──▼──┐
│Github │      │ Yaml  │  │ TF  │
│ Done ✓│      │Done ✓│  │Done✓│
└───────┘      └───────┘  └─────┘
```

---

## Step-by-Step Flow

| Step | Action             | What You See                             |
| ---- | ------------------ | ---------------------------------------- |
| 1    | Click "▶ Run"      | Button changes to "↺ Restart"            |
| 2    | Loading starts     | "Waiting for agents to start..." overlay |
| 3    | WebSocket connects | Console: "✓ WebSocket connected"         |
| 4    | Agents fetched     | Agent cards appear with names/colors     |
| 5    | First agent starts | Github agent glows blue, shimmer effect  |
| 6    | Logs stream in     | Right panel shows real-time logs         |
| 7    | Agent completes    | Green checkmark ✓, border turns green    |
| 8    | Next agent starts  | Yaml agent glows, shimmer effect         |
| 9    | Process repeats    | Each agent: idle → working → done        |
| 10   | All complete       | "✓ All agents complete!" message         |

---

## Key Features

### ✅ Real-Time Visualization

- Animated agent cards
- Color-coded status (gray → blue → green)
- Shimmer effects during work
- Pulsing rings around active agents

### ✅ Live Logging

- WebSocket streaming from backend
- Per-agent log panels
- Color-coded messages (green=success, red=error)
- Auto-scroll to active agent

### ✅ Smart Orchestration

- Agents run in sequence
- Visual flow shows progression
- Status updates in real-time
- Error handling with red indicators

---

## Technical Details

### API Endpoints Used:

1. **GET** `https://devopsagent-backend-aegmehh9gcetepbf.eastus-01.azurewebsites.net/agents/agent/{recordId}`
   - Fetches agent configuration
   - Returns agent names, descriptions, parameters

2. **WebSocket** `ws://localhost:8000/logs/ws/logs`
   - Streams real-time execution logs
   - Updates agent states dynamically

### Data Sources:

Agents come from (in priority order):

1. **API response** (if recordId in URL)
2. **Saved workflow** (from localStorage)
3. **Default agents** (fallback: Github, Yaml, Terraform)

### Agent States:

```
idle → delegating → working → returning → done
                                        ↘ failed
```

---

## Example Log Output

```
Run button clicked
Record ID: abc123
Calling API: https://devopsagent-backend-aegmehh9gcetepbf.eastus-01.azurewebsites.net/agents/agent/abc123
API Response: {raw_representation: {tools: [...]}}
Found tools in raw_representation: [github_agent, yaml_builder, terraform_agent]
Building agents array from API response
New Agents: [{label: "Github Agent", ...}, ...]
Connecting to WebSocket: ws://localhost:8000/logs/ws/logs
✓ WebSocket connected successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📨 WebSocket message received:
[github_agent] Called with prompt: Analyze repository structure
Matched agent index: 0
🔄 Agent github_agent started working
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Quick Reference

### Button States:

- **"▶ Run"** - Start execution (initial state)
- **"↺ Restart"** - Re-run pipeline (during/after execution)
- **"↺ Replay"** - Replay completed pipeline

### Navigation Controls:

- **◀** - View previous agents (sliding window)
- **▶** - View next agents (sliding window)
- **1-5 of 10** - Shows current window position

### Color Meanings:

- **Gray** - Idle (not started)
- **Blue** - Working (processing)
- **Green** - Done (successful)
- **Red** - Failed (error)
- **Orange** - In progress (delegating/returning)

---

## Summary

**In one sentence:**

> Clicking "Run" triggers an orchestrated AI agent workflow that executes in the backend, streams real-time logs via WebSocket, and displays beautiful animated visualizations showing each agent's progress from idle → working → done.

**Perfect for:**

- Watching AI agents work in real-time
- Debugging agent execution
- Understanding workflow orchestration
- Monitoring pipeline progress

📖 **For detailed documentation, see:**

- `RUN_BUTTON_FLOW.md` - Complete step-by-step explanation
- `RUN_BUTTON_DIAGRAMS.md` - Visual flow diagrams
