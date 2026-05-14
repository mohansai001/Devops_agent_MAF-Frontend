# 🔍 Agent Prompts Console Logging

## Overview

The Agent Builder now includes **detailed console logging** to help you track and debug agent prompts as they are saved.

## When Console Logs Appear

### 1. **When Saving Individual Agent Prompt**

Every time you click the **Edit icon** (✏️) on an agent and save a custom prompt, you'll see:

```
--------------------------------------------
💬 SAVING AGENT PROMPT
--------------------------------------------
Agent: Tech Detection
Agent ID: agent-0
✅ Custom Prompt: Scan the repository and detect the technology stack, runtime version, and dependencies
--------------------------------------------
```

**Or if prompt is cleared:**

```
--------------------------------------------
💬 SAVING AGENT PROMPT
--------------------------------------------
Agent: Build Agent
Agent ID: agent-1
⚠️  Prompt cleared (will use default task)
--------------------------------------------
```

### 2. **When Saving Complete Workflow**

When you click **"Save Workflow"** and enter a workflow name, you'll see comprehensive logging:

```
============================================
📝 SAVING WORKFLOW
============================================
Workflow Name: My Custom CI/CD Pipeline
Total Agents: 5
--------------------------------------------

🤖 Agent 1: Tech Detection
   ID: agent-0
   Color: #7C3AED
   Default Task: Scanning repo & detecting runtime...
   ✅ Custom Prompt: "Scan the repository and detect the technology stack, runtime version, and dependencies"

🤖 Agent 2: CI Pipeline
   ID: agent-1
   Color: #2563EB
   Default Task: Running build, lint & unit tests...
   ⚠️  No custom prompt (using default task)

🤖 Agent 3: Terraform
   ID: agent-2
   Color: #D97706
   Default Task: Provisioning cloud infrastructure...
   ✅ Custom Prompt: "Provision AWS EKS cluster with Terraform, include VPC, subnets, and security groups"

🤖 Agent 4: CD Pipeline
   ID: agent-3
   Color: #059669
   Default Task: Deploying to Kubernetes cluster...
   ✅ Custom Prompt: "Deploy application to EKS using Helm charts, ensure rolling update strategy"

🤖 Agent 5: GitHub Actions
   ID: agent-4
   Color: #374151
   Default Task: Running post-deploy smoke tests...
   ⚠️  No custom prompt (using default task)

============================================
📦 Complete Workflow Data:
{
  "name": "My Custom CI/CD Pipeline",
  "agents": [
    {
      "id": "agent-0",
      "label": "Tech Detection",
      "color": "#7C3AED",
      "task": "Scanning repo & detecting runtime...",
      "prompt": "Scan the repository and detect the technology stack, runtime version, and dependencies",
      "success": "Stack detected ✓ Node.js v18"
    },
    {
      "id": "agent-1",
      "label": "CI Pipeline",
      "color": "#2563EB",
      "task": "Running build, lint & unit tests...",
      "prompt": "",
      "success": "Build passed · 42/42 tests ✓"
    },
    {
      "id": "agent-2",
      "label": "Terraform",
      "color": "#D97706",
      "task": "Provisioning cloud infrastructure...",
      "prompt": "Provision AWS EKS cluster with Terraform, include VPC, subnets, and security groups",
      "success": "Infra provisioned ✓ EKS ready"
    },
    {
      "id": "agent-3",
      "label": "CD Pipeline",
      "color": "#059669",
      "task": "Deploying to Kubernetes cluster...",
      "prompt": "Deploy application to EKS using Helm charts, ensure rolling update strategy",
      "success": "Deployed · 3/3 pods running ✓"
    },
    {
      "id": "agent-4",
      "label": "GitHub Actions",
      "color": "#374151",
      "task": "Running post-deploy smoke tests...",
      "prompt": "",
      "success": "All checks passed ✓ Live!"
    }
  ]
}
============================================
```

## How to View Console Logs

### In Browser:

1. **Open Developer Tools**
   - Windows/Linux: Press `F12` or `Ctrl + Shift + I`
   - Mac: Press `Cmd + Option + I`

2. **Click "Console" tab**

3. **Perform actions:**
   - Add agents to pipeline
   - Click edit icon (✏️) on an agent
   - Enter custom prompt
   - Click "Save Prompt"
   - → See individual prompt log

4. **Save workflow:**
   - Click "Save Workflow" button
   - Enter workflow name
   - Click "Save"
   - → See complete workflow log with all agent prompts

## What You Can See

### ✅ Prompts That Are Set:

```
✅ Custom Prompt: "Your custom instructions here"
```

### ⚠️ Prompts That Are Empty:

```
⚠️  No custom prompt (using default task)
```

## Example Use Cases

### 1. **Debugging Workflow Issues**

Check if prompts are being saved correctly:

- Are prompts being persisted?
- Are they in the right format?
- Is the data structure correct?

### 2. **Verifying Agent Configuration**

Ensure each agent has the instructions you intended:

- Review all agent prompts before saving
- Confirm custom prompts vs default tasks
- Validate JSON structure

### 3. **Development & Testing**

Quick reference during development:

- See exact prompt text without opening UI
- Copy JSON data for API testing
- Debug state management issues

## JSON Structure Breakdown

```javascript
{
  "name": "Workflow Name",           // Workflow identifier
  "agents": [                         // Array of agents
    {
      "id": "agent-0",               // Unique agent ID
      "label": "Tech Detection",     // Display name
      "color": "#7C3AED",            // Visual color
      "task": "Default task...",     // Default task description
      "prompt": "Custom prompt",     // ✨ Your custom instructions
      "success": "Success message"   // Success output
    }
  ]
}
```

## Tips

### 💡 Filtering Console Output

In browser console, you can filter logs:

- Type `SAVING` to see only save operations
- Type `Agent` to see agent-specific logs
- Type `Custom Prompt` to see only custom prompts

### 💡 Copying Workflow Data

1. Expand the JSON object in console
2. Right-click → "Copy object"
3. Paste into text editor or API client

### 💡 Clear Console

- Press `Ctrl + L` (Windows/Linux)
- Press `Cmd + K` (Mac)
- Click the 🚫 icon in console toolbar

## Console Log Format

### Individual Prompt Save:

```
--------------------------------------------
💬 SAVING AGENT PROMPT
--------------------------------------------
Agent: <agent name>
Agent ID: <agent id>
<prompt status>
--------------------------------------------
```

### Workflow Save:

```
============================================
📝 SAVING WORKFLOW
============================================
Workflow Name: <name>
Total Agents: <count>
--------------------------------------------
<per-agent details>
============================================
📦 Complete Workflow Data:
<full JSON>
============================================
```

## Benefits

✅ **Transparency** - See exactly what's being saved  
✅ **Debugging** - Identify issues with prompt storage  
✅ **Verification** - Confirm all prompts are captured  
✅ **Development** - Easy testing and validation  
✅ **Documentation** - Copy JSON for API specs

## Next Steps

After saving, you can:

1. Check `localStorage` in browser DevTools
   - Application tab → Local Storage → `vida_workflows`
2. Navigate to Workflows page to see saved workflows
3. Execute workflows from the Workflows page
4. Monitor workflow execution in Agent Queue

---

**Happy Debugging!** 🚀
