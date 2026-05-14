# 🛣️ Routing Architecture

## Overview

Your application now uses a **centralized routing configuration** with `routes.tsx` as the single source of truth for all routes. This makes it easy to manage, maintain, and extend your application's navigation.

## File Structure

```
src/
├── routes.tsx          # ✅ Route configuration (centralized)
├── App.tsx             # Uses routes from routes.tsx
└── layouts/
    └── AppLayout.tsx   # Uses route metadata for page titles
```

## Key Files

### 1. `routes.tsx` - Route Configuration

**What it contains:**

- ✅ All route definitions (paths, components, layouts)
- ✅ Route metadata (titles, icons, permissions)
- ✅ Helper functions (e.g., `getPageTitle()`)

**Example:**

```typescript
export const routes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <AppLayout>
        <Dashboard />
      </AppLayout>
    ),
  },
  // ... more routes
];
```

### 2. `App.tsx` - Route Rendering

**What it does:**

- Imports routes from `routes.tsx`
- Renders routes using `useRoutes()` hook
- Handles theme and global providers

**Example:**

```typescript
import { routes } from "./routes";

function AppRoutes() {
  return useRoutes(routes);
}
```

### 3. `AppLayout.tsx` - Page Titles

**What it does:**

- Uses `getPageTitle()` helper to get current page title
- Displays title in the Header component

**Example:**

```typescript
import { getPageTitle } from "../routes";

const pageTitle = getPageTitle(pathname);
```

## Route Metadata

The `routeMetadata` array provides additional information about each route:

```typescript
export interface RouteMetadata {
  path: string;
  title: string;
  icon?: string;
  protected?: boolean; // Requires authentication
  showInNav?: boolean; // Show in navigation menu
}
```

**Example:**

```typescript
{
  path: '/dashboard',
  title: 'Dashboard',
  protected: true,
  showInNav: true
}
```

## How to Add a New Route

### Step 1: Add to `routes.tsx`

```typescript
// 1. Import the new page component
import MyNewPage from './pages/MyNewPage';

// 2. Add to routes array
{
  path: '/my-new-page',
  element: (
    <AppLayout>
      <MyNewPage />
    </AppLayout>
  ),
}

// 3. Add to routeMetadata
{
  path: '/my-new-page',
  title: 'My New Page',
  protected: true,
  showInNav: true
}
```

### Step 2: Add to Sidebar Navigation (Optional)

If `showInNav: true`, add to `Sidebar.tsx`:

```typescript
import MyNewIcon from "@mui/icons-material/MyNewIcon";

const navItems = [
  // ... existing items
  {
    label: "My New Page",
    icon: MyNewIcon,
    path: "/my-new-page",
  },
];
```

### Step 3: Create the Page Component

```typescript
// src/pages/MyNewPage.tsx
export default function MyNewPage() {
  return (
    <Box>
      <Typography variant="h4">My New Page</Typography>
      {/* Your page content */}
    </Box>
  );
}
```

**That's it!** Your new route is ready. 🎉

## Route Types

### 1. **Public Routes** (No Layout)

```typescript
{
  path: '/login',
  element: <Login />,
}
```

### 2. **Protected Routes** (With AppLayout)

```typescript
{
  path: '/dashboard',
  element: (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  ),
}
```

### 3. **Redirects**

```typescript
{
  path: '/',
  element: <Navigate to="/login" replace />,
}
```

### 4. **404 Catch-All**

```typescript
{
  path: '*',
  element: <Navigate to="/dashboard" replace />,
}
```

## Advanced Features

### 1. **Nested Routes** (Future Enhancement)

```typescript
{
  path: '/settings',
  element: <SettingsLayout />,
  children: [
    { path: 'profile', element: <Profile /> },
    { path: 'security', element: <Security /> },
    { path: 'billing', element: <Billing /> },
  ],
}
```

### 2. **Route Guards** (Authentication)

```typescript
// Create a ProtectedRoute component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Use in routes
{
  path: '/dashboard',
  element: (
    <ProtectedRoute>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </ProtectedRoute>
  ),
}
```

### 3. **Dynamic Routes** (URL Parameters)

```typescript
{
  path: '/approvals/:id',
  element: (
    <AppLayout>
      <ApprovalDetails />
    </AppLayout>
  ),
}

// Access in component
function ApprovalDetails() {
  const { id } = useParams();
  // Use id to fetch approval details
}
```

### 4. **Query Parameters**

```typescript
// Navigate with query params
navigate("/approvals?status=pending&sort=date");

// Access in component
function Approvals() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status"); // 'pending'
  const sort = searchParams.get("sort"); // 'date'
}
```

## Benefits of This Architecture

✅ **Single Source of Truth** - All routes in one file  
✅ **Easy to Maintain** - Add/remove routes in one place  
✅ **Type-Safe** - TypeScript interfaces for route metadata  
✅ **Reusable** - Helper functions like `getPageTitle()`  
✅ **Scalable** - Easy to add nested routes, guards, etc.  
✅ **Clean App.tsx** - No clutter, just route rendering

## Current Routes

| Path                | Title                  | Protected | In Nav |
| ------------------- | ---------------------- | --------- | ------ |
| `/login`            | Login                  | ❌        | ❌     |
| `/dashboard`        | Dashboard              | ✅        | ✅     |
| `/approvals`        | Agent Queue            | ✅        | ✅     |
| `/agent-builder`    | Agent Pipeline Builder | ✅        | ✅     |
| `/workflows`        | Workflows              | ✅        | ✅     |
| `/repos`            | Repositories           | ✅        | ❌     |
| `/onboarding`       | Onboarding             | ✅        | ❌     |
| `/deployments`      | Deployments            | ✅        | ❌     |
| `/builds`           | Builds                 | ✅        | ❌     |
| `/failed-pipelines` | Failed Pipelines       | ✅        | ❌     |

## Summary

Your routing is now **organized, scalable, and maintainable**! 🚀

All routes are centralized in `routes.tsx`, making it easy to:

- Add new pages
- Update metadata
- Implement route guards
- Generate navigation menus
- Handle 404s and redirects

Everything is type-safe and follows React Router v6 best practices!
