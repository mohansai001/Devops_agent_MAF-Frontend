# Master Prompt Dialog Feature

## ✅ Feature Implementation

Added a "Master Prompt" dialog that displays all agent prompts in a single consolidated view before saving the workflow. This provides a final review opportunity to see all custom prompts at once.

---

## What Was Added

### 1. **New State Variable**

```typescript
const [masterPromptDialog, setMasterPromptDialog] = useState(false);
```

### 2. **Updated Save Flow**

```typescript
// Before: Direct save
const handleSaveWorkflow = () => {
  if (!workflowName.trim()) return;
  // ... save logic
};

// After: Show master prompt dialog first
const handleSaveWorkflow = () => {
  if (!workflowName.trim()) return;
  setMasterPromptDialog(true); // ← Show review dialog
};

const handleConfirmSaveWorkflow = () => {
  // ... actual save logic (moved here)
};
```

### 3. **Master Prompt Dialog UI**

A comprehensive dialog showing:

- Workflow name and agent count
- All agents in order (#1, #2, #3...)
- Each agent's icon, name, and default task
- Custom prompt (if set) or warning if missing
- Confirm & Save button to proceed

---

## User Flow

### Before

```
1. User adds agents to workflow
2. User sets custom prompts for each agent
3. Click "Save Workflow" button
4. Enter workflow name
5. Click "Save"
6. ✅ Saved (no review of all prompts)
```

### After

```
1. User adds agents to workflow
2. User sets custom prompts for each agent
3. Click "Save Workflow" button
4. Enter workflow name
5. Click "Save"
6. 📋 Master Prompt Dialog appears  ← NEW!
   - Shows all agents
   - Shows all custom prompts
   - Shows warnings for missing prompts
   - Review everything in one view
7. Click "Confirm & Save Workflow"
8. ✅ Saved
```

---

## Master Prompt Dialog Features

### 📋 **Header**

- Title: "Master Prompt - Review Before Saving"
- Subtitle: Shows workflow name and agent count
- Save icon for visual clarity

### 🤖 **Agent Cards**

Each agent displayed with:

- **Agent Number**: #1, #2, #3...
- **Icon**: Colored icon in circle
- **Agent Name**: e.g., "Tech Detection"
- **Default Task**: Shows what the agent does by default
- **Custom Prompt Section**:
  - ✅ Green border if custom prompt exists
  - Shows full prompt text in monospace font
  - ⚠️ Yellow warning if no custom prompt

### 🎨 **Visual Design**

- Alternating row colors for readability
- Scrollable content (max height 60vh)
- Dark mode support
- Color-coded by agent color
- Responsive layout

### 🔘 **Actions**

- **Cancel**: Close dialog without saving
- **Confirm & Save Workflow**: Proceed with save

---

## Example Display

```
┌────────────────────────────────────────────────────┐
│ 💾 Master Prompt - Review Before Saving           │
│ Workflow: My CI/CD Pipeline · 3 Agents            │
├────────────────────────────────────────────────────┤
│                                                    │
│  [🔍]  #1  Tech Detection                          │
│        Default: Scanning repo & detecting runtime  │
│        ┌────────────────────────────────────────┐ │
│        │ Custom Prompt:                         │ │
│        │ Scan the repository and detect the     │ │
│        │ technology stack, runtime version...   │ │
│        └────────────────────────────────────────┘ │
│                                                    │
│  [🔧]  #2  CI Pipeline                             │
│        Default: Running build, lint & unit tests   │
│        ┌────────────────────────────────────────┐ │
│        │ Custom Prompt:                         │ │
│        │ Execute all tests and generate reports │ │
│        └────────────────────────────────────────┘ │
│                                                    │
│  [📦]  #3  Terraform                               │
│        Default: Provisioning cloud infrastructure  │
│        ⚠️ No custom prompt - will use default task │
│                                                    │
├────────────────────────────────────────────────────┤
│                          [Cancel]  [Confirm & Save]│
└────────────────────────────────────────────────────┘
```

---

## Benefits

✅ **Final Review**: See all prompts before committing
✅ **Error Detection**: Spot missing prompts easily
✅ **Better UX**: Consolidated view instead of clicking each agent
✅ **Documentation**: Acts as a summary of what the workflow will do
✅ **Quality Control**: Encourages users to add prompts to all agents
✅ **Visual Clarity**: Color-coded, numbered, easy to scan

---

## Technical Details

### Dialog Structure

```tsx
<Dialog open={masterPromptDialog} onClose={...} maxWidth="md" fullWidth>
  <DialogTitle>
    Master Prompt - Review Before Saving
    Workflow: {workflowName} · {selectedAgents.length} Agents
  </DialogTitle>

  <DialogContent>
    {selectedAgents.map((agent, index) => (
      <Box key={agent.id}>
        <!-- Agent icon, number, name -->
        <!-- Default task -->
        <!-- Custom prompt or warning -->
      </Box>
    ))}
  </DialogContent>

  <DialogActions>
    <Button onClick={cancel}>Cancel</Button>
    <Button onClick={handleConfirmSaveWorkflow}>
      Confirm & Save Workflow
    </Button>
  </DialogActions>
</Dialog>
```

### Prompt Display Logic

```tsx
{
  agent.prompt && agent.prompt.trim() ? (
    // Show custom prompt with green border
    <Box sx={{ bgcolor: "#232326", border: "1px solid {agent.color}40" }}>
      <Typography>Custom Prompt:</Typography>
      <Typography sx={{ fontFamily: "monospace" }}>{agent.prompt}</Typography>
    </Box>
  ) : (
    // Show warning with yellow background
    <Box sx={{ bgcolor: "#fef3c7", border: "1px solid #fbbf24" }}>
      <Typography>⚠️ No custom prompt - will use default task</Typography>
    </Box>
  );
}
```

---

## Console Logs

When reviewing prompts:

```
============================================
📝 SAVING WORKFLOW
============================================
Workflow Name: My CI/CD Pipeline
Total Agents: 3
--------------------------------------------

🤖 Agent 1: Tech Detection
   ID: agent-0
   Color: #7C3AED
   Default Task: Scanning repo & detecting runtime...
   ✅ Custom Prompt: "Scan the repository and detect..."

🤖 Agent 2: CI Pipeline
   ID: agent-1
   Color: #2563EB
   Default Task: Running build, lint & unit tests...
   ✅ Custom Prompt: "Execute all tests and generate..."

🤖 Agent 3: Terraform
   ID: agent-2
   Color: #D97706
   Default Task: Provisioning cloud infrastructure...
   ⚠️  No custom prompt (using default task)

============================================
```

---

## Testing Checklist

- [x] Add agents to workflow
- [x] Set custom prompts for some agents
- [x] Leave some agents without prompts
- [x] Click "Save Workflow" button
- [x] Enter workflow name
- [x] Click "Save" button
- [x] Verify Master Prompt Dialog appears
- [x] Verify all agents are listed in order
- [x] Verify custom prompts display correctly
- [x] Verify warnings for missing prompts
- [x] Verify scrolling works for many agents
- [x] Click "Cancel" to close without saving
- [x] Click "Confirm & Save" to proceed
- [x] Verify navigation to /workflows after save

---

## Files Modified

**`src/pages/AgentBuilder.tsx`**:

- Added `masterPromptDialog` state
- Split `handleSaveWorkflow` into two functions:
  - `handleSaveWorkflow()` - Shows master prompt dialog
  - `handleConfirmSaveWorkflow()` - Actually saves the workflow
- Added Master Prompt Dialog component
- Updated dialog close logic to close both dialogs

---

## Edge Cases Handled

1. **No Custom Prompts**: Shows warning for each agent
2. **Long Prompts**: Scrollable content area
3. **Many Agents**: Alternating colors for readability
4. **Dark Mode**: Full theme support
5. **Cancel Action**: Closes dialog without saving
6. **Empty Workflow Name**: Disabled until name is entered

---

## Future Enhancements (Optional)

- [ ] Add "Edit Prompt" button in master dialog
- [ ] Add "Copy All Prompts" button
- [ ] Export prompts as JSON/text file
- [ ] Add prompt validation (min/max length)
- [ ] Add prompt suggestions based on agent type
- [ ] Add search/filter in master dialog
- [ ] Add expand/collapse for long prompts
- [ ] Add prompt templates library
