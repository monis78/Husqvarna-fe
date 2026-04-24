import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { exchangeTokenWithBackend } from '../../services/authService';
import { GOOGLE_CLIENT_ID } from '../../constants/config';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const LoginContent: React.FC = () => {
  const { setUser, setToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      setError(null);

      // Get the JWT token from Google
      const googleToken = credentialResponse.credential;

      // Exchange token with backend
      const response = await exchangeTokenWithBackend(googleToken);

      // Store the authentication token from backend
      setToken(response.data.token);
      setUser(response.data.user);
      navigate("/");

    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Authentication failed';
      setError(errorMessage);
      console.error('OAuth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            textAlign: 'center',
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
            Welcome
          </Typography>

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 3 }}
          >
            Sign in with your Google account to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
              />
            )}
          </Box>

          <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
            Your credentials are secure and encrypted
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

const Login: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
};

export default Login;
