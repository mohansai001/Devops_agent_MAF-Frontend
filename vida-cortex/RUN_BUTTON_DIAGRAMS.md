# 🎯 Run Button - Visual Flow Diagram

## Complete Execution Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    USER CLICKS "RUN" BUTTON                  │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│              runSimulation() Function Triggered              │
├──────────────────────────────────────────────────────────────┤
│  1. Clear previous logs (sessionStorage)                     │
│  2. Set waitingForLogs = true (show loading overlay)         │
│  3. Call connectWebSocket()                                  │
│  4. Check if recordId exists                                 │
└────────────────────────┬─────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌───────────────────┐          ┌─────────────────────┐
│  recordId EXISTS  │          │ NO recordId         │
│                   │          │                     │
│ Fetch agents      │          │ Use default/saved   │
│ from API          │          │ workflow agents     │
└────────┬──────────┘          └──────────┬──────────┘
         │                                │
         ▼                                │
┌──────────────────────────────────────┐  │
│ API Call:                            │  │
│ GET /agents/agent/{recordId}         │  │
├──────────────────────────────────────┤  │
│ Response:                            │  │
│ {                                    │  │
│   raw_representation: {              │  │
│     tools: [                         │  │
│       {name: "github_agent", ...},   │  │
│       {name: "yaml_builder", ...}    │  │
│     ]                                │  │
│   }                                  │  │
│ }                                    │  │
└────────┬─────────────────────────────┘  │
         │                                │
         ▼                                │
┌──────────────────────────────────────┐  │
│ buildAgentsArray(fetchedAgents)      │  │
├──────────────────────────────────────┤  │
│ Parse and map to UI format:          │  │
│ {                                    │  │
│   label: "Github Agent",             │  │
│   task: "Analyzes GitHub repo",      │  │
│   color: "#3B82F6",                  │  │
│   icon: SearchIcon,                  │  │
│   key: "github_agent"                │  │
│ }                                    │  │
└────────┬─────────────────────────────┘  │
         │                                │
         └────────────────┬───────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │   WebSocket Connection Setup        │
        ├─────────────────────────────────────┤
        │ ws://localhost:8000/logs/ws/logs    │
        │                                     │
        │ ws.onopen   → Connected ✓           │
        │ ws.onmessage → Receive logs         │
        │ ws.onerror  → Handle errors         │
        │ ws.onclose  → Disconnected          │
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────┐
        │   Initialize Agent States           │
        ├─────────────────────────────────────┤
        │ All agents set to "idle" phase      │
        │ selectedAgentIdx = 0                │
        │ windowStart = 0                     │
        │ started = true                      │
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────┐
        │   UI Updates                        │
        ├─────────────────────────────────────┤
        │ Show agent visualization            │
        │ Display "Waiting for agents..."     │
        │ Button changes: "▶ Run" → "↺ Restart"│
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────┐
        │  WAITING FOR BACKEND EXECUTION      │
        │  (Backend starts running agents)    │
        └──────────────┬──────────────────────┘
                       │
                       ▼
```

## WebSocket Log Processing Flow

```
┌──────────────────────────────────────────────────────────────┐
│           WebSocket Message Received                         │
│  Raw Data: "[github_agent] Called with prompt: Analyze repo" │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  Parse Agent Name from Log     │
        │  Regex: /\[([a-zA-Z0-9_-]+)\]/ │
        │  Extracted: "github_agent"     │
        └────────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │  Match to UI Agent             │
        │  Find agentIndex where:        │
        │  - Exact match: key === name   │
        │  - Contains match              │
        │  - Keyword match (yaml, github)│
        │  Found: agentIndex = 0         │
        └────────────┬───────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌──────────────────┐   ┌─────────────────────┐
│ Add Log to Panel │   │ Update Agent State  │
├──────────────────┤   ├─────────────────────┤
│ setRealTimeLogs  │   │ Detect keywords:    │
│ prev => ({       │   │                     │
│   ...prev,       │   │ "Called with"       │
│   [0]: [         │   │  → working          │
│     ...logs,     │   │                     │
│     newLog       │   │ "Successfully"      │
│   ]              │   │  → done ✓           │
│ })               │   │                     │
│                  │   │ "Error"             │
│                  │   │  → failed ✗         │
└──────────────────┘   └─────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  UI Visual Update      │
                    ├────────────────────────┤
                    │ • Border color change  │
                    │ • Background glow      │
                    │ • Icon animation       │
                    │ • Status badge         │
                    │ • Orchestrator message │
                    │ • Auto-scroll to agent │
                    └────────────────────────┘
```

## Agent State Machine

```
       ┌─────────────────────────────────┐
       │         IDLE                    │
       │  • Gray color                   │
       │  • No animation                 │
       │  • Status: "Idle"               │
       └──────────┬──────────────────────┘
                  │
                  │ WebSocket: "Called with prompt"
                  ▼
       ┌─────────────────────────────────┐
       │      DELEGATING                 │
       │  • Blue glow                    │
       │  • Arrow ↓ animation            │
       │  • Duration: 900ms              │
       │  • Status: "Receiving"          │
       └──────────┬──────────────────────┘
                  │
                  │ Auto-transition
                  ▼
       ┌─────────────────────────────────┐
       │      WORKING                    │
       │  • Shimmer effect               │
       │  • Pulsing ring                 │
       │  • Loading dots ⋯               │
       │  • Duration: 1800ms             │
       │  • Status: "Working"            │
       └──────────┬──────────────────────┘
                  │
                  │ WebSocket: "Successfully" or "Error"
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│    DONE ✓     │   │   FAILED ✗    │
├───────────────┤   ├───────────────┤
│ • Green border│   │ • Red border  │
│ • Checkmark   │   │ • Error icon  │
│ • No animation│   │ • No animation│
│ • Status: Done│   │ • Status: Fail│
└───────────────┘   └───────────────┘
```

## UI Components Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPROVALS PAGE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Loading Overlay (when waitingForLogs = true)           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │   ⋯ Waiting for agents to start...                 │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌────────────────┬───────────────────────────────────────────┐│
│  │  MAIN FLOW     │  AGENT LOGS & STACK                       ││
│  │  (55%)         │  (45%)                                    ││
│  ├────────────────┼───────────────────────────────────────────┤│
│  │                │                                           ││
│  │ [▶ Run]  ◀1-5of10▶                                        ││
│  │                │  ┌──────────────────────────────────┐    ││
│  │ ┌────────────────────┐  │  Agent Stack (scrollable)        │    ││
│  │ │ 🤖 Orchestrator    │  │  ├──────────────────────────────────┤    ││
│  │ │ ✓ All complete!    │  │  │ 📊 Orchestrator                │    ││
│  │ └─────────┬──────────┘  │  │ Delegating to Github Agent →   │    ││
│  │           │             │  ├──────────────────────────────────┤    ││
│  │    ┌──────┴────┬───┐   │  │ 🔍 Github Agent [Working]      │    ││
│  │    │           │   │   │  │ Logs:                          │    ││
│  │ ┌──▼──┐ ┌────▼─┐ ┌▼──┐│  │ › [github_agent] Called...     │    ││
│  │ │Github│ │Yaml  │ │TF ││  │ › Processing files...          │    ││
│  │ │  ✓   │ │ ⋯    │ │   ││  │ › Successfully generated...    │    ││
│  │ │ Done │ │Work..│ │Idle|  ├──────────────────────────────────┤    ││
│  │ └─────┘ └──────┘ └───┘│  │ 🏗️  Yaml Builder [Idle]         │    ││
│  │                │  │ Logs: (none)                   │    ││
│  │                │  └──────────────────────────────────┘    ││
│  │                │                                           ││
│  └────────────────┴───────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Timeline Visualization

```
Time  | Orchestrator Message            | Agent 1    | Agent 2   | Agent 3
━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━┼━━━━━━━━━━┼━━━━━━━━━━
0s    | "Pipeline triggered..."         | IDLE       | IDLE      | IDLE
━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━┼━━━━━━━━━━┼━━━━━━━━━━
1s    | "Delegating to Github Agent →"  | DELEGATING | IDLE      | IDLE
━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━┼━━━━━━━━━━┼━━━━━━━━━━
2s    | "Waiting for Github Agent..."   | WORKING    | IDLE      | IDLE
      |                                 | (shimmer)  |           |
━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━┼━━━━━━━━━━┼━━━━━━━━━━
4s    | "Github Agent ↑"                | RETURNING  | IDLE      | IDLE
━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━┼━━━━━━━━━━┼━━━━━━━━━━
5s    | "✓ Github complete"             | DONE ✓     | IDLE      | IDLE
━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━┼━━━━━━━━━━┼━━━━━━━━━━
6s    | "Delegating to Yaml Builder →"  | DONE ✓     | DELEGATING| IDLE
━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━┼━━━━━━━━━━┼━━━━━━━━━━
7s    | "Waiting for Yaml Builder..."   | DONE ✓     | WORKING   | IDLE
      |                                 |            | (shimmer) |
━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━┼━━━━━━━━━━┼━━━━━━━━━━
9s    | "Yaml Builder ↑"                | DONE ✓     | RETURNING | IDLE
━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━┼━━━━━━━━━━┼━━━━━━━━━━
10s   | "✓ Yaml complete"               | DONE ✓     | DONE ✓    | IDLE
━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━┼━━━━━━━━━━┼━━━━━━━━━━
11s   | "Delegating to Terraform →"     | DONE ✓     | DONE ✓    | DELEGATING
━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━┼━━━━━━━━━━┼━━━━━━━━━━
12s   | "Waiting for Terraform..."      | DONE ✓     | DONE ✓    | WORKING
      |                                 |            |           | (shimmer)
━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━┼━━━━━━━━━━┼━━━━━━━━━━
14s   | "Terraform ↑"                   | DONE ✓     | DONE ✓    | RETURNING
━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━┼━━━━━━━━━━┼━━━━━━━━━━
15s   | "✓ All agents complete!"        | DONE ✓     | DONE ✓    | DONE ✓
━━━━━━┴━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┴━━━━━━━━━━━━┴━━━━━━━━━━┴━━━━━━━━━━
```

## Data Flow Architecture

```
┌─────────────┐
│   FRONTEND  │
│  (React)    │
└──────┬──────┘
       │
       │ 1. Click Run
       ▼
┌────────────────────────┐
│  runSimulation()       │
│  • Clear logs          │
│  • Connect WebSocket   │
│  • Fetch agents        │
└──────┬─────────────────┘
       │
       │ 2. API Request
       ▼
┌────────────────────────┐         ┌─────────────┐
│  Backend API           │◄────────│   BACKEND   │
│  /agents/agent/{id}    │         │  (FastAPI)  │
└──────┬─────────────────┘         └──────┬──────┘
       │                                  │
       │ 3. Return agents config          │ 4. Start execution
       ▼                                  ▼
┌────────────────────────┐         ┌─────────────────────┐
│  Parse & Build Agents  │         │  Agent Orchestrator │
│  • Map to UI format    │         │  • Run agents       │
│  • Set colors/icons    │         │  • Execute prompts  │
└──────┬─────────────────┘         └──────┬──────────────┘
       │                                  │
       │                                  │ 5. Stream logs
       │                                  ▼
       │                           ┌─────────────────────┐
       │                           │  WebSocket Server   │
       │                           │  ws://localhost:8000│
       │                           └──────┬──────────────┘
       │                                  │
       │ 6. WebSocket connection          │ 7. Send logs
       └──────────────────┬───────────────┘
                          ▼
                 ┌─────────────────────┐
                 │  WebSocket onmessage│
                 │  • Parse agent name │
                 │  • Match to UI agent│
                 │  • Update state     │
                 │  • Add to log panel │
                 └──────┬──────────────┘
                        │
                        │ 8. UI updates
                        ▼
                 ┌─────────────────────┐
                 │  React State Updates│
                 │  • agentStates      │
                 │  • realTimeLogs     │
                 │  • orchMsg          │
                 │  • selectedAgentIdx │
                 └──────┬──────────────┘
                        │
                        │ 9. Re-render
                        ▼
                 ┌─────────────────────┐
                 │  Visual Updates     │
                 │  • Animations       │
                 │  • Colors           │
                 │  • Status badges    │
                 │  • Log panels       │
                 └─────────────────────┘
```

## Summary

**When you click RUN:**

1. 🔄 **Initialize** - Clear logs, show loading
2. 🌐 **Connect** - WebSocket to backend
3. 📡 **Fetch** - Get agent configuration from API
4. 🎨 **Build** - Create UI agent array
5. ⏳ **Wait** - Backend starts execution
6. 📨 **Stream** - Receive real-time logs
7. 🎯 **Parse** - Extract agent names from logs
8. 🔄 **Update** - Change agent states (idle → working → done)
9. ✨ **Animate** - Show visual effects
10. ✅ **Complete** - All agents done!

**It's a fully orchestrated, real-time, visual AI agent execution system!** 🚀
