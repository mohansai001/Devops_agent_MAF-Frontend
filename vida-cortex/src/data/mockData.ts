export const pipelines = [
  { id: 1, repo: 'payment-service', branch: 'main', techStack: 'Node.js', stage: 'CD Pipeline', status: 'Success', appName: 'payment-app', deployTarget: 'AWS EKS', deployedUrl: 'https://payment.vida.io', timestamp: '2024-01-15 10:30' },
  { id: 2, repo: 'auth-api', branch: 'develop', techStack: 'Python', stage: 'CI Pipeline', status: 'Running', appName: 'auth-service', deployTarget: 'Azure AKS', deployedUrl: 'https://auth.vida.io', timestamp: '2024-01-15 11:00' },
  { id: 3, repo: 'user-service', branch: 'feature/login', techStack: 'Java', stage: 'Terraform', status: 'Failed', appName: 'user-app', deployTarget: 'GCP GKE', deployedUrl: 'https://user.vida.io', timestamp: '2024-01-15 09:15' },
  { id: 4, repo: 'notification-svc', branch: 'main', techStack: 'Go', stage: 'GitHub Actions', status: 'Success', appName: 'notif-app', deployTarget: 'AWS EKS', deployedUrl: 'https://notif.vida.io', timestamp: '2024-01-15 08:45' },
  { id: 5, repo: 'inventory-api', branch: 'develop', techStack: 'Node.js', stage: 'Tech Detection', status: 'Pending', appName: 'inventory-app', deployTarget: 'Azure AKS', deployedUrl: '-', timestamp: '2024-01-15 12:00' },
  { id: 6, repo: 'order-service', branch: 'main', techStack: 'Python', stage: 'CD Pipeline', status: 'Running', appName: 'order-app', deployTarget: 'AWS EKS', deployedUrl: 'https://order.vida.io', timestamp: '2024-01-15 11:30' },
  { id: 7, repo: 'gateway-api', branch: 'feature/auth', techStack: 'Java', stage: 'CI Pipeline', status: 'Success', appName: 'gateway-app', deployTarget: 'GCP GKE', deployedUrl: 'https://gateway.vida.io', timestamp: '2024-01-15 07:00' },
  { id: 8, repo: 'analytics-svc', branch: 'main', techStack: 'Go', stage: 'Terraform', status: 'Pending', appName: 'analytics-app', deployTarget: 'AWS EKS', deployedUrl: '-', timestamp: '2024-01-15 13:00' },
];

export const approvals = [
  { id: 1, repo: 'payment-service', branch: 'main', commitSha: 'a1b2c3d', status: 'Running', activeStep: 1, logs: ['[10:00] Agent triggered by push event', '[10:01] Tech stack detected: Node.js', '[10:02] CI pipeline initiated autonomously', '[10:03] Tests passed (42/42)', '[10:04] Proceeding to Terraform stage...'], deployedUrl: 'https://payment.vida.io' },
  { id: 2, repo: 'auth-api', branch: 'develop', commitSha: 'e4f5g6h', status: 'Running', activeStep: 3, logs: ['[11:00] Agent triggered by push event', '[11:01] Tech stack detected: Python', '[11:02] CI pipeline complete', '[11:03] Terraform plan applied', '[11:04] Agent deploying to AKS...'], deployedUrl: 'https://auth.vida.io' },
  { id: 3, repo: 'user-service', branch: 'feature/login', commitSha: 'i7j8k9l', status: 'Failed', activeStep: 0, logs: ['[09:00] Agent triggered by push event', '[09:01] Tech stack detected: Java', '[09:02] Build failed: missing dependency — agent flagged for retry'], deployedUrl: '' },
  { id: 4, repo: 'notification-svc', branch: 'main', commitSha: 'm1n2o3p', status: 'Queued', activeStep: 2, logs: ['[08:00] Agent queued pipeline', '[08:01] Tech stack: Go', '[08:02] CI passed', '[08:03] Agent running Terraform plan...'], deployedUrl: '' },
  { id: 5, repo: 'order-service', branch: 'develop', commitSha: 'q4r5s6t', status: 'Success', activeStep: 4, logs: ['[07:00] All stages completed by agent', '[07:01] Agent deployed successfully', '[07:02] Health check passed — endpoint live'], deployedUrl: 'https://order.vida.io' },
];

export const repositories = [
  { id: 1, name: 'payment-service', language: 'Node.js', branch: 'main', visibility: 'Private', stars: 12, forks: 3, watchers: 8, openIssues: 2, lastUpdated: '2024-01-15' },
  { id: 2, name: 'auth-api', language: 'Python', branch: 'develop', visibility: 'Public', stars: 45, forks: 12, watchers: 20, openIssues: 5, lastUpdated: '2024-01-14' },
  { id: 3, name: 'user-service', language: 'Java', branch: 'main', visibility: 'Private', stars: 8, forks: 2, watchers: 5, openIssues: 1, lastUpdated: '2024-01-13' },
  { id: 4, name: 'notification-svc', language: 'Go', branch: 'main', visibility: 'Public', stars: 22, forks: 7, watchers: 15, openIssues: 3, lastUpdated: '2024-01-12' },
  { id: 5, name: 'inventory-api', language: 'Node.js', branch: 'develop', visibility: 'Private', stars: 5, forks: 1, watchers: 3, openIssues: 0, lastUpdated: '2024-01-11' },
  { id: 6, name: 'order-service', language: 'Python', branch: 'main', visibility: 'Public', stars: 31, forks: 9, watchers: 18, openIssues: 4, lastUpdated: '2024-01-10' },
  { id: 7, name: 'gateway-api', language: 'Java', branch: 'feature/auth', visibility: 'Private', stars: 17, forks: 4, watchers: 10, openIssues: 2, lastUpdated: '2024-01-09' },
  { id: 8, name: 'analytics-svc', language: 'Go', branch: 'main', visibility: 'Public', stars: 28, forks: 6, watchers: 14, openIssues: 1, lastUpdated: '2024-01-08' },
];

export const deployments = [
  { id: 1, appName: 'payment-app', repo: 'payment-service', environment: 'Production', status: 'Success', deployTarget: 'AWS EKS', region: 'us-east-1', deployedUrl: 'https://payment.vida.io', timestamp: '2024-01-15 10:30' },
  { id: 2, appName: 'auth-service', repo: 'auth-api', environment: 'Staging', status: 'Running', deployTarget: 'Azure AKS', region: 'eastus', deployedUrl: 'https://auth-stg.vida.io', timestamp: '2024-01-15 11:00' },
  { id: 3, appName: 'user-app', repo: 'user-service', environment: 'Development', status: 'Failed', deployTarget: 'GCP GKE', region: 'us-central1', deployedUrl: '-', timestamp: '2024-01-15 09:15' },
  { id: 4, appName: 'notif-app', repo: 'notification-svc', environment: 'Production', status: 'Success', deployTarget: 'AWS EKS', region: 'eu-west-1', deployedUrl: 'https://notif.vida.io', timestamp: '2024-01-15 08:45' },
  { id: 5, appName: 'inventory-app', repo: 'inventory-api', environment: 'Staging', status: 'Pending', deployTarget: 'Azure AKS', region: 'westeurope', deployedUrl: '-', timestamp: '2024-01-15 12:00' },
  { id: 6, appName: 'order-app', repo: 'order-service', environment: 'Production', status: 'Running', deployTarget: 'AWS EKS', region: 'ap-southeast-1', deployedUrl: 'https://order.vida.io', timestamp: '2024-01-15 11:30' },
];

export const builds = [
  { id: 1, repo: 'payment-service', branch: 'main', workflow: 'ci-pipeline.yml', status: 'Success', duration: '3m 42s', triggeredAt: '2024-01-15 10:00' },
  { id: 2, repo: 'auth-api', branch: 'develop', workflow: 'build-test.yml', status: 'Running', duration: '1m 20s', triggeredAt: '2024-01-15 11:00' },
  { id: 3, repo: 'user-service', branch: 'feature/login', workflow: 'ci-pipeline.yml', status: 'Failed', duration: '0m 55s', triggeredAt: '2024-01-15 09:15' },
  { id: 4, repo: 'notification-svc', branch: 'main', workflow: 'build-test.yml', status: 'Success', duration: '2m 10s', triggeredAt: '2024-01-15 08:45' },
  { id: 5, repo: 'inventory-api', branch: 'develop', workflow: 'ci-pipeline.yml', status: 'Success', duration: '4m 05s', triggeredAt: '2024-01-15 07:30' },
  { id: 6, repo: 'order-service', branch: 'main', workflow: 'deploy.yml', status: 'Running', duration: '2m 30s', triggeredAt: '2024-01-15 11:30' },
  { id: 7, repo: 'gateway-api', branch: 'feature/auth', workflow: 'ci-pipeline.yml', status: 'Success', duration: '3m 15s', triggeredAt: '2024-01-15 07:00' },
];

export const failedPipelines = [
  { id: 1, repo: 'user-service', workflow: 'ci-pipeline.yml', branch: 'feature/login', failedJob: 'build', failedAt: '2024-01-15 09:15', failureReason: 'Missing dependency: spring-boot-starter-web 3.2.0 not found in Maven repository', suggestedFix: 'Update pom.xml to use spring-boot-starter-web 3.1.5 or add the missing repository to settings.xml' },
  { id: 2, repo: 'analytics-svc', workflow: 'deploy.yml', branch: 'main', failedJob: 'terraform-apply', failedAt: '2024-01-15 08:00', failureReason: 'Terraform state lock timeout: another process holds the state lock', suggestedFix: 'Run `terraform force-unlock <LOCK_ID>` to release the stale lock, then retry the pipeline' },
  { id: 3, repo: 'inventory-api', workflow: 'build-test.yml', branch: 'develop', failedJob: 'unit-tests', failedAt: '2024-01-14 16:30', failureReason: 'Test failure: NullPointerException in InventoryServiceTest.testGetItem()', suggestedFix: 'Add null check in InventoryService.getItem() method before accessing the item properties' },
  { id: 4, repo: 'gateway-api', workflow: 'ci-pipeline.yml', branch: 'feature/rate-limit', failedJob: 'docker-build', failedAt: '2024-01-14 14:00', failureReason: 'Docker build failed: COPY failed: file not found in build context', suggestedFix: 'Verify Dockerfile COPY paths match the actual project structure. Check if config/ directory exists' },
  { id: 5, repo: 'payment-service', workflow: 'security-scan.yml', branch: 'develop', failedJob: 'snyk-scan', failedAt: '2024-01-14 12:00', failureReason: 'Critical vulnerability found: CVE-2023-44487 in http2 dependency', suggestedFix: 'Update node http2 to version 0.4.7 or later. Run `npm audit fix` to auto-resolve compatible fixes' },
];

export const langColors: Record<string, string> = {
  'Node.js': '#68a063',
  'Python': '#3572A5',
  'Java': '#b07219',
  'Go': '#00ADD8',
  'TypeScript': '#2b7489',
  'Rust': '#dea584',
};
