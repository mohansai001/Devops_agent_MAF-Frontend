import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Divider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Login() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0d1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated grid background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,137,123,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,137,123,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'gridMove 20s linear infinite',
          '@keyframes gridMove': {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '40px 40px' },
          },
        }}
      />

      {/* Glowing orbs */}
      {[
        { top: '10%', left: '15%', size: 300 },
        { top: '60%', right: '10%', size: 200 },
        { bottom: '5%', left: '40%', size: 250 },
      ].map((orb, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,137,123,0.2) 0%, transparent 70%)',
            ...orb,
            animation: `pulse${i} ${3 + i}s ease-in-out infinite alternate`,
            [`@keyframes pulse${i}`]: {
              '0%': { transform: 'scale(1)', opacity: 0.5 },
              '100%': { transform: 'scale(1.2)', opacity: 1 },
            },
          }}
        />
      ))}

      {/* Login Card */}
      <Card
        sx={{
          width: 400,
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #00897b, #00bfa5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 0 30px rgba(0,137,123,0.5)',
              }}
            >
              <CloudUploadIcon sx={{ color: '#fff', fontSize: 30 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} color="#fff">VIDA Cortex</Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.5)" mt={0.5}>
              AI-Powered DevOps Automation Platform
            </Typography>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

          <Typography variant="body2" color="rgba(255,255,255,0.6)" textAlign="center" mb={2}>
            Sign in to continue to your workspace
          </Typography>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<GitHubIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              bgcolor: '#24292f',
              color: '#fff',
              py: 1.5,
              fontSize: 15,
              fontWeight: 600,
              '&:hover': { bgcolor: '#32383f' },
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            Login with GitHub
          </Button>

          <Typography variant="caption" color="rgba(255,255,255,0.3)" display="block" textAlign="center" mt={3}>
            By signing in, you agree to our Terms of Service
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
