# Quick Reference: API Call Flow

## 🎯 New Data Flow

```
1. User navigates to /approvals?recordId=2
   ↓
2. AgentQueue component mounts
   ↓
3. useEffect triggers fetchApiData(2) [ONLY ONCE]
   ↓
4. API: GET https://devopsagent-backend-aegmehh9gcetepbf.eastus-01.azurewebsites.net/agents/agent/2
   ↓
5. Response stored in apiData state
   ↓
6. apiData passed to LiveOrchestration (agents extracted)
   ↓
7. apiData passed to GeneratedContentDisplay (output extracted)
   ↓
8. User clicks "Run" button
   ↓
9. Uses already-extracted apiAgents [NO API CALL]
   ↓
10. WebSocket connects and receives real-time logs
```

---

## 📊 Before vs After

### Network Calls

**Before:**

```
Page Load:
  1. LiveOrchestration → GET /agents/agent/2
  2. GeneratedContentDisplay → GET /agents/agent/2

Click "Run":
  3. LiveOrchestration.runSimulation → GET /agents/agent/2

Total: 3 API calls
```

**After:**

```
Page Load:
  1. AgentQueue → GET /agents/agent/2

Click "Run":
  (No API call - uses cached data)

Total: 1 API call
```

---

## 🔍 Console Logs to Watch For

### Success Indicators

```
✅ 📡 [AgentQueue] Fetching API data ONCE for record ID: 2
✅ ✓ [AgentQueue] API Response received
✅ 📦 [LiveOrchestration] Extracting agents from shared API data
✅ ✓ Found tools in raw_representation
✅ ✓ Parsed Agents: [Yaml_Agent, terraform_agent]
✅ 📦 [GeneratedContentDisplay] Using shared API data (no fetch needed)
✅ 📄 Extracting content from API data
✅ ✓ Extracted from raw_representation.raw_representation (6436 chars)
```

### When You Click "Run"

```
✅ 🚀 Run button clicked
✅ 📦 Using agents from shared API data: [{name: 'Yaml_Agent'}, ...]
✅ ✓ Built agents array: [{label: 'Yaml Agent', ...}]
```

### Warning Signs

```
⚠️ ⏳ [GeneratedContentDisplay] Waiting for API data...
   → Means apiData hasn't loaded yet (expected briefly)

❌ [AgentQueue] Error fetching API data
   → Backend is down or endpoint wrong

⚠️ No agents found in API data, using fallback
   → API structure changed or empty response
```

---

## 🧪 Testing Commands

### Check API is called only once

```powershell
# Open DevTools → Network tab
# Navigate to http://localhost:5173/approvals?recordId=2
# Filter by: agents/agent
# Should see: 1 request total

# Click "Run" button multiple times
# Should see: 0 new requests
```

### Verify console logs

```powershell
# Open DevTools → Console
# Clear console
# Refresh page
# Look for: "📡 [AgentQueue] Fetching API data ONCE"
# Count occurrences: Should be 1

# Click "Run" button
# Look for: "📦 Using agents from shared API data"
# Should NOT see: "Calling API: https://devopsagent-backend-aegmehh9gcetepbf.eastus-01.azurewebsites.net/agents/agent/2"
```

---

## 🐛 Troubleshooting

### Problem: "No content generated yet" still showing

**Solution:**

- Check: `data.raw_representation.raw_representation.output` exists
- Check: Content extraction logs in console
- Verify: API returns same structure as trail.json

### Problem: Agents not appearing in flow

**Solution:**

- Check: apiData is passed to LiveOrchestration
- Check: `data.raw_representation.tools` exists
- Verify: Console shows "✓ Parsed Agents"

### Problem: "Waiting for API data" never goes away

**Solution:**

- Check: recordId is present in URL (?recordId=2)
- Check: Backend is running on port 8000
- Check: CORS is configured correctly

---

## 🎨 Component Prop Signatures

```typescript
// Parent
function AgentQueue() {
  const [apiData, setApiData] = useState<any>(null);

  return (
    <LiveOrchestration
      repoName="..."
      recordId={2}
      apiData={apiData}
    />
    <GeneratedContentDisplay
      recordId={2}
      apiData={apiData}
    />
  );
}

// Child 1
function LiveOrchestration({
  repoName,
  recordId,
  apiData
}: {
  repoName: string;
  recordId?: number;
  apiData?: any
}) {
  // Use apiData, don't fetch
}

// Child 2
function GeneratedContentDisplay({
  recordId,
  apiData
}: {
  recordId: number;
  apiData?: any
}) {
  // Use apiData, don't fetch
}
```

---

## ✅ Success Criteria

- [x] Only 1 API call visible in Network tab on page load
- [x] 0 API calls when clicking "Run" button
- [x] Agents display correctly in orchestration flow
- [x] Generated YAML appears in "Generated Output" section
- [x] Console shows "Using shared API data" messages
- [x] No duplicate fetch logs in console
- [x] WebSocket logs still work correctly
- [x] All existing functionality preserved

---

## 📝 Key Takeaways

1. **Fetch once, share everywhere** - Better performance
2. **Props over fetch** - Clearer data flow
3. **Single source of truth** - No inconsistencies
4. **Separation of concerns** - Parent fetches, children consume
5. **Easier to test** - Can mock apiData prop
6. **Better debugging** - Clear console logs with emojis
