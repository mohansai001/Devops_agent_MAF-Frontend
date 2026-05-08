import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Divider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GitHubIcon from '@mui/icons-material/GitHub';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <Card className="login-card">
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

          <Typography variant="body2" className="login-description">
            Sign in to continue to your workspace
          </Typography>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<GitHubIcon />}
            onClick={() => navigate('/dashboard')}
            className="login-button"
          >
            Login with GitHub
          </Button>

          <Typography variant="caption" className="login-terms">
            By signing in, you agree to our Terms of Service
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
