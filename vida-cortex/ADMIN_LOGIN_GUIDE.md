# 🔐 Admin Login & Agent Onboarding

## Overview

The VIDA Cortex platform now includes **Admin Login** functionality that provides privileged access to the **Agent Onboarding** page.

## Login Credentials

### Admin Login

- **Username:** `admin`
- **Password:** `admin`

### User Login

- GitHub OAuth (simulated)

## Features

### 1. Login Page with Tabs

The login page now has two tabs:

#### User Login Tab

- GitHub OAuth login button
- Redirects to Dashboard (`/dashboard`)
- Role: `user`

#### Admin Login Tab

- Username and password fields
- Admin credentials validation
- Redirects to Agent Onboarding page (`/agent-onboarding`)
- Role: `admin`

### 2. Agent Onboarding Page

**Access:** Admin only

**Features:**

- ✅ View all registered agents in a table
- ✅ Onboard new agents with name, type, and capabilities
- ✅ Edit existing agent details
- ✅ Delete agents from the system
- ✅ Activate pending agents
- ✅ View agent status (Active, Pending, Inactive)
- ✅ Beautiful UI with Material-UI components

**Agent Properties:**

- **Name:** Agent identifier (e.g., "Build Agent Alpha")
- **Type:** Agent category (e.g., Build, Deployment, Testing)
- **Capabilities:** Technologies/tools the agent supports (e.g., Docker, Kubernetes, Python)
- **Status:** Active, Pending, or Inactive
- **Registered Date:** When the agent was onboarded

### 3. Role-Based Sidebar

The sidebar dynamically shows/hides menu items based on user role:

**Regular Users See:**

- Dashboard
- Approvals
- Agent Builder
- Workflows

**Admin Users See:**

- Dashboard
- Approvals
- Agent Builder
- Workflows
- **Agent Onboarding** ⭐ (Admin only)

## How to Use

### Admin Login Flow

1. **Go to Login Page** (`/login`)
2. **Click "Admin Login" tab**
3. **Enter credentials:**
   - Username: `admin`
   - Password: `admin`
4. **Click "Admin Login" button**
5. **Redirected to Agent Onboarding page**

### Onboard a New Agent

1. **Click "Onboard New Agent"** button
2. **Fill in the form:**
   - Agent Name: e.g., "CI/CD Agent Delta"
   - Agent Type: e.g., "CI/CD"
   - Capabilities: e.g., "Jenkins, GitLab CI, CircleCI"
3. **Click "Onboard Agent"**
4. **Agent appears in table with "Pending" status**
5. **Click "Activate"** to make the agent active

### Edit an Agent

1. **Click the edit icon** (pencil) next to an agent
2. **Update the fields** in the dialog
3. **Click "Update Agent"**

### Delete an Agent

1. **Click the delete icon** (trash) next to an agent
2. **Agent is removed** with a confirmation message

## Technical Implementation

### Session Storage

```typescript
// Admin login
localStorage.setItem("userRole", "admin");
localStorage.setItem("isAuthenticated", "true");

// User login
localStorage.setItem("userRole", "user");
localStorage.setItem("isAuthenticated", "true");
```

### Role Check in Sidebar

```typescript
const userRole = localStorage.getItem("userRole");
const isAdmin = userRole === "admin";
const navItems = isAdmin ? [...baseNavItems, ...adminNavItems] : baseNavItems;
```

### Routes

```typescript
// New route in routes.ts
AGENT_ONBOARDING: '/agent-onboarding'

// Route metadata
{
  path: ROUTE_PATHS.AGENT_ONBOARDING,
  title: 'Agent Onboarding',
  showInNav: false,
  protected: true
}

// App.tsx route
<Route
  path={ROUTE_PATHS.AGENT_ONBOARDING}
  element={<AppLayout><AgentOnboarding /></AppLayout>}
/>
```

## File Structure

```
src/
├── pages/
│   ├── Login.tsx              # ✨ Updated with admin login
│   └── AgentOnboarding.tsx    # ✨ New admin page
├── layouts/
│   └── Sidebar.tsx            # ✨ Updated with role-based menu
├── routes.ts                  # ✨ Updated with AGENT_ONBOARDING route
└── App.tsx                    # ✨ Updated with new route
```

## Sample Agents

The Agent Onboarding page comes with 3 sample agents:

1. **Build Agent Alpha**
   - Type: Build
   - Capabilities: Docker, Node.js, Python
   - Status: Active

2. **Deploy Agent Beta**
   - Type: Deployment
   - Capabilities: Kubernetes, AWS, Azure
   - Status: Active

3. **Test Agent Gamma**
   - Type: Testing
   - Capabilities: Selenium, Jest, Cypress
   - Status: Pending

## Future Enhancements

### Suggested Features:

- [ ] Secure password hashing (bcrypt)
- [ ] JWT token-based authentication
- [ ] Protected route guards
- [ ] Logout functionality
- [ ] Session timeout
- [ ] Multi-admin support with role permissions
- [ ] Agent health monitoring
- [ ] Agent logs and metrics
- [ ] Bulk agent operations

## Security Note

⚠️ **Current Implementation:** This is a **frontend-only** authentication system using hardcoded credentials. It is **NOT secure** for production use.

**For Production:**

- Implement backend authentication API
- Use JWT or session tokens
- Hash passwords with bcrypt/argon2
- Add HTTPS/TLS
- Implement RBAC (Role-Based Access Control)
- Add audit logging
- Enable 2FA for admin accounts

## Summary

✅ **Admin Login** with username/password (`admin`/`admin`)  
✅ **Agent Onboarding Page** with full CRUD operations  
✅ **Role-Based Sidebar** showing admin-only menu items  
✅ **Beautiful UI** with Material-UI components  
✅ **Session Management** with localStorage

Your admin can now onboard and manage AI agents! 🚀
