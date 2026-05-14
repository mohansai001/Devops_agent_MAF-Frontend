import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, Typography, Button, Divider, 
  TextField, Box, Alert, Tabs, Tab 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GitHubIcon from '@mui/icons-material/GitHub';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import '../styles/Login.css';
import { ROUTE_PATHS } from '../routes';

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = () => {
    if (username === 'admin' && password === 'admin') {
      // Store admin session
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('isAuthenticated', 'true');
      navigate(ROUTE_PATHS.AGENT_ONBOARDING);
    } else {
      setError('Invalid username or password');
    }
  };

  const handleGitHubLogin = () => {
    // Store regular user session
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('isAuthenticated', 'true');
    navigate(ROUTE_PATHS.DASHBOARD);
  };

  return (
    <div className="login-container">
      <Card className="login-card" sx={{ maxWidth: '450px' }}>
        <CardContent className="login-card-content">
          <div className="login-header">
            <div className="login-logo">
              <CloudUploadIcon className="login-logo-icon" />
            </div>
            <Typography variant="h5" className="login-title">
              VIDA Cortex
            </Typography>
            <Typography variant="body2" className="login-subtitle">
              AI-Powered DevOps Automation Platform
            </Typography>
          </div>

          <Divider className="login-divider" />

          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => {
              setActiveTab(newValue);
              setError('');
              setUsername('');
              setPassword('');
            }}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="User Login" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label="Admin Login" sx={{ textTransform: 'none', fontWeight: 600 }} />
          </Tabs>

          {activeTab === 0 ? (
            // User Login
            <>
              <Typography variant="body2" className="login-description">
                Sign in to continue to your workspace
              </Typography>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<GitHubIcon />}
                onClick={handleGitHubLogin}
                className="login-button"
              >
                Login with GitHub
              </Button>
            </>
          ) : (
            // Admin Login
            <>
              <Typography variant="body2" className="login-description" sx={{ mb: 2 }}>
                Admin access for agent onboarding
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={handleAdminLogin}
                className="login-button"
                sx={{
                  background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)',
                  }
                }}
              >
                Admin Login
              </Button>
            </>
          )}

          <Typography variant="caption" className="login-terms">
            By signing in, you agree to our Terms of Service
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
