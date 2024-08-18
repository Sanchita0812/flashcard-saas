'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography, Box, AppBar, Toolbar } from '@mui/material';
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { createTheme } from '@mui/material/styles';
import SmallLogo from '../../public/assets/SmallHomeScreenLogo.png';

const theme = createTheme({
  palette: {
    primary: {
      light: '#676f8d',
      main: '#424769',
      dark: '#2d3250',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#AD81A7',
      main: '#6C5E82',
      dark: '#2E365A',
      contrastText: '#F8C19B',
    },
  },
});

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Assuming you have a signUp method provided by Clerk or similar
      await signUp({ email, password });
      router.push('/'); // Redirect after successful sign-up
    } catch (err) {
      console.error('Sign-up error:', err);
      setError('Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 4, backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
      <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.dark, color: theme.palette.primary.contrastText }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: theme.palette.primary.contrastText }}>
            <Image src={SmallLogo} alt="Flasher.io Logo" width={25} />
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in" sx={{ color: theme.palette.primary.light }}>Login</Button>
            <Button color="inherit" href="/sign-up" sx={{ color: theme.palette.primary.light }}>Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" my={4} gutterBottom sx={{ color: theme.palette.primary.contrastText, textAlign: 'center' }}>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
            sx={{ backgroundColor: theme.palette.primary.contrastText, color: theme.palette.primary.contrastText }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            sx={{ backgroundColor: theme.palette.primary.contrastText, color: theme.palette.primary.contrastText }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            variant="outlined"
            sx={{ backgroundColor: theme.palette.primary.contrastText, color: theme.palette.primary.contrastText }}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
                color: theme.palette.primary.contrastText,
              },
            }}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </Box>
    </Container>
  );
}
