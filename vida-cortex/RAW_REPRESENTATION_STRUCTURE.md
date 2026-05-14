# Complete raw_representation Structure

## What You Showed (Partial)

You shared the **`output`** section of `raw_representation`, which contains:

- Response ID
- Creation timestamp
- Model info
- Output text (the generated YAML file)

## What's Missing: THE TOOLS ARRAY! 🎯

The most important part for the Approvals page is **`raw_representation.tools`**, which comes **after** the output section.

## Complete Structure

````json
{
  "raw_representation": {
    "id": "resp_...",
    "created_at": 1778737434,
    "model": "gpt-5-mini",
    "object": "response",

    // ⬇️ This is what you showed
    "output": [
      {
        "type": "reasoning",
        "content": null
      },
      {
        "type": "text",
        "text": "Saved-as: .github/workflows/ci.yml\n\n```yaml\n..."
      }
    ],

    // ⬇️ THIS IS WHAT'S MISSING - THE IMPORTANT PART!
    "tools": [
      {
        "name": "Yaml_Agent",
        "type": "function",
        "parameters": {
          "properties": {
            "prompt": {
              "description": "Full prompt including original request...",
              "type": "string"
            }
          },
          "required": ["prompt"]
        }
      },
      {
        "name": "terraform_agent",
        "type": "function",
        "description": "An agent dedicated to Terraform responsibilities...",
        "parameters": {
          "properties": {
            "prompt": {
              "description": "Full prompt including original request...",
              "type": "string"
            }
          },
          "required": ["prompt"]
        }
      }
    ],

    // Other fields...
    "temperature": 1.0,
    "top_p": 1.0,
    "usage": {...}
  }
}
````

## Why the `tools` Array Matters

The Approvals page code specifically looks for this:

```typescript
// In Approvals.tsx - fetchAgentsFromAPI()
if (data?.raw_representation?.tools) {
  console.log(
    "Found tools in raw_representation:",
    data.raw_representation.tools,
  );
  agentsList = data.raw_representation.tools; // ✅ THIS IS WHAT WE NEED!
}
```

## How to Get the Complete Response

Run this PowerShell command to save the **full** response:

```powershell
$response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/agents/agent/2" -Method GET
$response.Content | Out-File -FilePath ".\full_api_response.json" -Encoding UTF8
```

Then open `full_api_response.json` and scroll down to find the `tools` array.

## What to Look For

Search for this pattern in the full response:

```json
"tools": [
  {
    "name": "...",
    "type": "function",
    ...
  }
]
```

This array contains the agent definitions that will be displayed in the UI!

## Summary

✅ **What you showed**: The `output` section with generated YAML content  
❌ **What's missing**: The `tools` array with agent definitions  
🎯 **What we need**: `raw_representation.tools` to populate the agent cards

The `tools` array should be somewhere else in the `raw_representation` object - keep scrolling through the response to find it!
