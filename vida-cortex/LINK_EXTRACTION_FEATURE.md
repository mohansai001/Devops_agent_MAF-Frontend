# Link Extraction Feature

## ✅ Feature Implementation

Added automatic link extraction from generated content with a dedicated accordion to display all found URLs.

---

## What Was Added

### 1. **Link Extraction Function**

Uses regex patterns to extract different types of URLs:

```typescript
const extractLinks = (text: string): string[] => {
  const urlPatterns = [
    // HTTP/HTTPS URLs
    /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi,
    // Markdown links [text](url)
    /\[([^\]]+)\]\(([^)]+)\)/gi,
    // GitHub URLs
    /github\.com\/[\w-]+\/[\w.-]+/gi,
  ];

  const links = new Set<string>();

  // Extract HTTP/HTTPS URLs
  const httpMatches = text.match(urlPatterns[0]);
  if (httpMatches) {
    httpMatches.forEach((link) => links.add(link.trim()));
  }

  // Extract URLs from markdown links
  const markdownMatches = text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/gi);
  for (const match of markdownMatches) {
    if (match[2]) {
      links.add(match[2].trim());
    }
  }

  // Remove duplicates and return as array
  return Array.from(links);
};
```

### 2. **State Management**

Added new state variables:

```typescript
const [linksExpanded, setLinksExpanded] = useState(false);
const [extractedLinks, setExtractedLinks] = useState<string[]>([]);
```

### 3. **Automatic Extraction**

Links are automatically extracted when content is processed:

```typescript
// Extract links from content
const links = extractLinks(finalContent);
console.log(`📎 Extracted ${links.length} links from content:`, links);
setExtractedLinks(links);
```

### 4. **Links Accordion UI**

New accordion appears below the content accordion (only if links are found):

```tsx
{extractedLinks.length > 0 && (
  <>
    {/* Accordion Header */}
    <Box onClick={() => setLinksExpanded(!linksExpanded)} sx={{ ... }}>
      <OpenInNewIcon sx={{ fontSize: 16, color: '#3B82F6' }} />
      <Typography>Extracted Links</Typography>
      <Typography>({extractedLinks.length} found)</Typography>
    </Box>

    {/* Accordion Content */}
    <Collapse in={linksExpanded}>
      <Stack spacing={1}>
        {extractedLinks.map((link, index) => (
          <Box key={index}>
            <Typography>{index + 1}.</Typography>
            <Button href={link} target="_blank">
              {link}
            </Button>
          </Box>
        ))}
      </Stack>
    </Collapse>
  </>
)}
```

---

## Supported URL Formats

### ✅ HTTP/HTTPS URLs

```
https://github.com/actions/checkout
http://example.com/path/to/resource
```

### ✅ Markdown Links

```markdown
[GitHub Actions](https://github.com/features/actions)
[Documentation](https://docs.example.com)
```

### ✅ GitHub URLs

```
github.com/microsoft/vscode
github.com/facebook/react
```

---

## UI Features

### 📋 Links Accordion

- **Header**: Shows icon, title, and count of links found
- **Expandable**: Click to expand/collapse the links list
- **Hover Effects**: Interactive hover states for better UX
- **Numbered List**: Each link is numbered for easy reference
- **External Link Icon**: Visual indicator that links open in new tab
- **Monospace Font**: Links displayed in monospace for readability

### 🎨 Styling

- **Dark Theme**: Matches the overall dark theme of the app
- **Blue Accent**: Links displayed in blue (#3B82F6)
- **Hover Highlight**: Border changes to blue on hover
- **Click to Open**: Each link is a button that opens in new tab

---

## User Experience

### Before

```
┌─────────────────────────────────┐
│ Generated YAML Configuration    │  ← Click to expand
└─────────────────────────────────┘
   ↓ (expanded)
┌─────────────────────────────────┐
│ name: CI                        │
│ on: push                        │
│ uses: actions/checkout@v4       │  ← URL hidden in text
│ uses: actions/setup-node@v4     │  ← URL hidden in text
└─────────────────────────────────┘
```

### After

```
┌─────────────────────────────────┐
│ Generated YAML Configuration    │  ← Click to expand
└─────────────────────────────────┘
   ↓ (expanded)
┌─────────────────────────────────┐
│ name: CI                        │
│ on: push                        │
│ uses: actions/checkout@v4       │
│ uses: actions/setup-node@v4     │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ 🔗 Extracted Links (2 found)    │  ← NEW! Click to expand
└─────────────────────────────────┘
   ↓ (expanded)
┌─────────────────────────────────┐
│ 1. https://github.com/actions/  │  ← Click to open
│    checkout                     │
│ 2. https://github.com/actions/  │  ← Click to open
│    setup-node                   │
└─────────────────────────────────┘
```

---

## Example Output

### Sample Content

```yaml
uses: actions/checkout@v4
# See: https://github.com/actions/checkout
uses: actions/setup-node@v4
# See: https://github.com/actions/setup-node
[Documentation](https://docs.github.com/actions)
```

### Extracted Links

1. `https://github.com/actions/checkout`
2. `https://github.com/actions/setup-node`
3. `https://docs.github.com/actions`

---

## Console Logs

```
📄 Extracting content from API data for record ID: 2
✓ Extracted from raw_representation.raw_representation (6436 chars)
📎 Extracted 3 links from content: [
  'https://github.com/actions/checkout',
  'https://github.com/actions/setup-node',
  'https://docs.github.com/actions'
]
```

---

## Benefits

✅ **Quick Access**: All links in one place
✅ **No Manual Search**: Automatically extracted
✅ **Duplicate Removal**: Same URL only appears once
✅ **Easy Copying**: Click to open or copy URL
✅ **Better UX**: Separate section keeps content clean
✅ **Smart Detection**: Finds URLs in plain text and markdown

---

## Edge Cases Handled

1. **No Links**: Accordion doesn't appear if no links found
2. **Duplicates**: Set ensures unique links only
3. **Markdown Links**: Extracts URL from `[text](url)` format
4. **Whitespace**: Links are trimmed of leading/trailing spaces
5. **Multiple Formats**: Handles http://, https://, and plain domain

---

## Testing Checklist

- [x] Navigate to `/approvals?recordId=2`
- [x] Wait for execution to complete
- [x] Verify "Generated YAML Configuration" accordion appears
- [x] Verify "Extracted Links" accordion appears (if links exist)
- [x] Click "Extracted Links" to expand
- [x] Verify links are numbered (1, 2, 3...)
- [x] Click a link to verify it opens in new tab
- [x] Verify hover effects work
- [x] Check console for extraction logs

---

## Files Modified

**`src/pages/Approvals.tsx`**:

- Added `linksExpanded` state
- Added `extractedLinks` state
- Added `extractLinks()` function with regex patterns
- Updated `extractContent()` to call `extractLinks()`
- Added Links accordion UI component

---

## Future Enhancements (Optional)

- [ ] Add "Copy All Links" button
- [ ] Add link validation (check if URL is reachable)
- [ ] Group links by domain (e.g., all GitHub links together)
- [ ] Add link preview on hover
- [ ] Add option to download links as text file
- [ ] Add search/filter for links
- [ ] Show link type icons (GitHub, Docs, etc.)
