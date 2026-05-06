import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Divider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Login() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8eaf0 0%, #f3f4f6 40%, #eef0f5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Card sx={{
          width: 400,
          background: 'rgba(255,255,255,0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.75)',
          boxShadow: '8px 8px 24px rgba(0,0,0,0.09), -8px -8px 24px rgba(255,255,255,0.85)',
          borderRadius: 4,
        }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{
              width: 60, height: 60, borderRadius: 3,
              bgcolor: '#FF4D1C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mb: 2.5,
              boxShadow: '4px 4px 14px rgba(255,77,28,0.35), -2px -2px 8px rgba(255,255,255,0.6)',
            }}>
              <CloudUploadIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} color="#111827" letterSpacing="-0.02em">
              VIDA Cortex
            </Typography>
            <Typography variant="body2" color="#6B7280" mt={0.5} textAlign="center">
              AI-Powered DevOps Automation Platform
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="body2" color="#6B7280" textAlign="center" mb={2.5}>
            Sign in to continue to your workspace
          </Typography>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<GitHubIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ py: 1.5, fontSize: '0.95rem' }}
          >
            Login with GitHub
          </Button>

          <Typography variant="caption" color="#9CA3AF" display="block" textAlign="center" mt={3}>
            By signing in, you agree to our Terms of Service
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
