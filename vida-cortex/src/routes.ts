// Route paths as constants for type safety and consistency
export const ROUTE_PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  APPROVALS: '/approvals',
  AGENT_BUILDER: '/agent-builder',
  WORKFLOWS: '/workflows',
  REPOS: '/repos',
  ONBOARDING: '/onboarding',
  AGENT_ONBOARDING: '/agent-onboarding',
  DEPLOYMENTS: '/deployments',
  BUILDS: '/builds',
  FAILED_PIPELINES: '/failed-pipelines',
} as const;

// Route metadata for navigation, breadcrumbs, and page titles
export interface RouteMetadata {
  path: string;
  title: string;
  showInNav?: boolean;
  protected?: boolean;
  icon?: string;
}

export const routeMetadata: RouteMetadata[] = [
  { 
    path: ROUTE_PATHS.DASHBOARD, 
    title: 'Dashboard', 
    showInNav: true, 
    protected: true 
  },
  { 
    path: ROUTE_PATHS.APPROVALS, 
    title: 'Agent Queue', 
    showInNav: true, 
    protected: true 
  },
  { 
    path: ROUTE_PATHS.AGENT_BUILDER, 
    title: 'Agent Pipeline Builder', 
    showInNav: true, 
    protected: true 
  },
  { 
    path: ROUTE_PATHS.WORKFLOWS, 
    title: 'Workflows', 
    showInNav: true, 
    protected: true 
  },
  { 
    path: ROUTE_PATHS.REPOS, 
    title: 'Repositories', 
    showInNav: false, 
    protected: true 
  },
  { 
    path: ROUTE_PATHS.ONBOARDING, 
    title: 'Onboarding', 
    showInNav: false, 
    protected: true 
  },
  { 
    path: ROUTE_PATHS.AGENT_ONBOARDING, 
    title: 'Agent Onboarding', 
    showInNav: false, 
    protected: true 
  },
  { 
    path: ROUTE_PATHS.DEPLOYMENTS, 
    title: 'Deployments', 
    showInNav: false, 
    protected: true 
  },
  { 
    path: ROUTE_PATHS.BUILDS, 
    title: 'Builds', 
    showInNav: false, 
    protected: true 
  },
  { 
    path: ROUTE_PATHS.FAILED_PIPELINES, 
    title: 'Failed Pipelines', 
    showInNav: false, 
    protected: true 
  },
  { 
    path: ROUTE_PATHS.LOGIN, 
    title: 'Login', 
    showInNav: false, 
    protected: false 
  },
];

// Helper function to get page title by pathname
export function getPageTitle(pathname: string): string {
  const route = routeMetadata.find((r) => r.path === pathname);
  return route?.title ?? 'VIDA Cortex';
}

// Helper function to check if route requires authentication
export function isProtectedRoute(pathname: string): boolean {
  const route = routeMetadata.find((r) => r.path === pathname);
  return route?.protected ?? false;
}

// Helper function to get navigation routes (routes that show in sidebar)
export function getNavigationRoutes(): RouteMetadata[] {
  return routeMetadata.filter((r) => r.showInNav);
}
