# Generated Content Display - Execution Completion Gate

## Feature Implementation

### ✅ Problem Solved

Previously, the "Generated Output" section would show content immediately when API data was available, even if agents were still executing. This could be confusing as the output might appear before the execution flow completes.

### ✅ Solution

Added execution state tracking to only display generated content **after all agents have completed** their execution.

---

## Implementation Details

### 1. **LiveOrchestration Component**

Added callback to notify parent when execution completes:

```typescript
function LiveOrchestration({
  repoName,
  recordId,
  apiData,
  onExecutionComplete, // ✅ New prop
}: {
  repoName: string;
  recordId?: number;
  apiData?: any;
  onExecutionComplete?: (isComplete: boolean) => void; // ✅ Callback
}) {
  // ...

  const runSimulation = async () => {
    if (!started) {
      // Reset completion state when starting
      onExecutionComplete?.(false); // ✅ Notify: execution starting
      // ...
    }
  };

  const runAgentsWithList = (
    idx: number,
    currentWindow: number,
    agentsList: any[],
  ) => {
    if (idx >= agentsList.length) {
      setDone(true);
      console.log("✅ All agents completed - execution finished");
      onExecutionComplete?.(true); // ✅ Notify: execution complete
      return;
    }
    // ...
  };
}
```

---

### 2. **AgentQueue Component (Parent)**

Added state to track execution completion:

```typescript
export default function AgentQueue() {
  // ...

  // ✅ Track execution completion state
  const [isExecutionComplete, setIsExecutionComplete] = useState(false);

  return (
    <LiveOrchestration
      repoName={currentExecution.repository}
      recordId={currentExecution.recordId}
      apiData={apiData}
      onExecutionComplete={setIsExecutionComplete}  // ✅ Pass callback
    />

    <GeneratedContentDisplay
      recordId={currentExecution.recordId}
      apiData={apiData}
      isExecutionComplete={isExecutionComplete}  // ✅ Pass state
    />
  );
}
```

---

### 3. **GeneratedContentDisplay Component**

Updated to conditionally show content based on execution state:

```typescript
function GeneratedContentDisplay({
  recordId,
  apiData,
  isExecutionComplete  // ✅ New prop
}: {
  recordId: number;
  apiData?: any;
  isExecutionComplete?: boolean;  // ✅ Execution state
}) {
  // ...

  // ✅ Show different states based on execution status
  if (loading) {
    return <Typography>Loading generated content...</Typography>;
  }

  // ✅ If execution is not complete yet, show waiting message
  if (!isExecutionComplete) {
    return (
      <Typography sx={{ color: '#9CA3AF', fontSize: 12, fontStyle: 'italic' }}>
        ⏳ Waiting for agents to complete execution...
      </Typography>
    );
  }

  // ✅ If execution is complete but no content, show empty state
  if (!content) {
    return <Typography>No content generated</Typography>;
  }

  // ✅ Show generated content only when execution is complete
  return <pre>{content}</pre>;
}
```

---

## User Experience Flow

### Before Changes

```
1. User navigates to /approvals?recordId=2
2. API data loads
3. Generated output appears immediately ❌ (confusing!)
4. Agents start executing (logs appear)
5. Agents complete
```

### After Changes

```
1. User navigates to /approvals?recordId=2
2. API data loads
3. Shows: "⏳ Waiting for agents to complete execution..." ✅
4. User clicks "Run"
5. Shows: "⏳ Waiting for agents to complete execution..." ✅
6. Agents execute (logs appear in real-time)
7. All agents complete
8. Generated output appears ✅ (perfect timing!)
```

---

## State Transitions

```
Initial State:
  isExecutionComplete = false
  Display: "⏳ Waiting for agents to complete execution..."

↓ User clicks "Run"

Execution Starting:
  onExecutionComplete(false) called
  isExecutionComplete = false
  Display: "⏳ Waiting for agents to complete execution..."

↓ Agents execute (WebSocket logs drive progress)

Execution in Progress:
  isExecutionComplete = false
  Display: "⏳ Waiting for agents to complete execution..."
  (Real-time logs show in orchestration panel)

↓ Last agent completes

Execution Complete:
  onExecutionComplete(true) called
  isExecutionComplete = true
  Display: Generated YAML workflow content ✅
```

---

## Console Logs

### When execution starts:

```
🚀 Run button clicked
📦 Using agents from shared API data: [...]
⏳ [GeneratedContentDisplay] Waiting for agents to complete execution...
```

### When execution completes:

```
✅ All agents completed - execution finished
📄 [GeneratedContentDisplay] Displaying generated content
```

---

## Testing Checklist

- [x] Navigate to `/approvals?recordId=2`
- [x] Verify "Generated Output" shows waiting message initially
- [x] Click "Run" button
- [x] Verify waiting message persists during execution
- [x] Verify logs appear in real-time
- [x] Wait for all agents to complete
- [x] Verify generated YAML appears after completion
- [x] Click "Run" again
- [x] Verify output hides and waiting message shows again
- [x] Verify output reappears after second execution completes

---

## Benefits

✅ **Better UX** - Users see output at the right time
✅ **No confusion** - Clear waiting state during execution
✅ **Accurate timing** - Output only shown when truly complete
✅ **Clean state management** - Execution state properly tracked
✅ **Reusable** - Can run multiple times, state resets correctly

---

## Files Modified

1. **`src/pages/Approvals.tsx`**
   - `LiveOrchestration`: Added `onExecutionComplete` callback prop
   - `AgentQueue`: Added `isExecutionComplete` state
   - `GeneratedContentDisplay`: Added conditional rendering based on execution state

---

## Edge Cases Handled

1. **Multiple Runs**: State resets on each "Run" click
2. **No Content**: Shows appropriate message if no output generated
3. **Still Loading**: Shows loading state while API data fetches
4. **Execution Not Started**: Shows waiting message before first run
5. **Partial Completion**: Waits for ALL agents to finish, not just some

---

## Future Enhancements (Optional)

- [ ] Add progress percentage (e.g., "2/3 agents complete")
- [ ] Add animated loading spinner during execution
- [ ] Add "View Partial Output" option for debugging
- [ ] Add download button for generated content
- [ ] Add copy-to-clipboard functionality
