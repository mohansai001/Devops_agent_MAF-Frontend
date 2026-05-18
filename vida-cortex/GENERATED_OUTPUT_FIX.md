# Generated Output Fix

## Problem

The "GENERATED OUTPUT" section in the Approvals page was showing "No content generated yet" even though the API response contained generated YAML workflow content.

## Root Cause

The API response has a **deeply nested structure**:

```javascript
data
  └─ raw_representation (level 1)
      └─ raw_representation (level 2)
          └─ output (array with generated content)  ← THIS is where the YAML lives!
```

The existing code was only checking:

- ✅ `data.output`
- ✅ `data.raw_representation.output`
- ❌ **Missing**: `data.raw_representation.raw_representation.output`

## Solution

Added an additional check to extract content from the deeper nested structure:

```typescript
// Check deeper nested structure: raw_representation.raw_representation.output
if (
  contentTexts.length === 0 &&
  data?.raw_representation?.raw_representation?.output &&
  Array.isArray(data.raw_representation.raw_representation.output)
) {
  console.log(
    "Checking raw_representation.raw_representation.output (nested deeper)",
  );

  data.raw_representation.raw_representation.output.forEach((item: any) => {
    if (item?.type === "reasoning") {
      console.log("  Skipping reasoning item in nested structure");
      return;
    }

    if (item?.content && Array.isArray(item.content)) {
      item.content.forEach((contentItem: any) => {
        if (contentItem?.type === "output_text" && contentItem?.text) {
          console.log(
            `✓ Extracted from raw_representation.raw_representation (${contentItem.text.length} chars)`,
          );
          contentTexts.push(contentItem.text);
        }
      });
    }
  });
}
```

## What Gets Displayed

When you navigate to `/approvals?recordId=2` and the API returns data from `https://devopsagent-backend-aegmehh9gcetepbf.eastus-01.azurewebsites.net/agents/agent/2`, the "GENERATED OUTPUT" section will now show:

````yaml
Saved-as: .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
  workflow_dispatch:

permissions:
  contents: read
  security-events: write

# ... (full GitHub Actions workflow YAML)
````

Plus all the notes and requirements explaining the configuration.

## How to Test

1. Navigate to: `http://localhost:5173/approvals?recordId=2`
2. The page will fetch from `https://devopsagent-backend-aegmehh9gcetepbf.eastus-01.azurewebsites.net/agents/agent/2`
3. Look for console logs showing extraction:
   - `Checking raw_representation.raw_representation.output (nested deeper)`
   - `✓ Extracted from raw_representation.raw_representation (XXXX chars)`
4. The "GENERATED OUTPUT" section should now display the full YAML workflow

## Files Modified

- `src/pages/Approvals.tsx` - Added nested extraction logic in `GeneratedContentDisplay` component

## API Response Structure

The trail.json file shows the actual structure:

- `raw_representation.raw_representation.output[0]` = reasoning (skipped)
- `raw_representation.raw_representation.output[1].content[0].text` = **Generated YAML workflow** ✅
