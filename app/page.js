'use client';

import './globals.css';
import Logo from '../public/assets/logo.png';
import SmallLogo from '../public/assets/SmallHomeScreenLogo.png';

import React from 'react';
import Image from 'next/image';
import getStripe from '@/utils/get-stripe';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Box, AppBar, Button, Container, Toolbar, Typography, Grid } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { CardStack } from '@/components/ui/card-stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create theme directly here, assuming this is a client component
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

export default function Home() {
  const cards = [
    { id: 1, name: 'Data Science Student', designation: 'IITG', content: 'Flasher.io has been a game-changer for my study sessions. The intuitive AI-driven flashcards make learning complex topics much easier and more engaging. I love how I can customize the flashcards to fit my specific research needs.' },
    { id: 2, name: 'Computer Science Student', designation: 'McMaster University', content: 'Flasher.io\'s flashcard tool is incredibly effective. It not only helps me review key concepts but also adapts the content based on my progress. It\'s become an essential part of my study routine, and the AI features make it stand out from other tools.' },
    { id: 3, name: 'Electrical Engineering Student', designation: 'Georgia Tech', content: 'As a student with a busy schedule, Flasher.io has been a lifesaver. The ability to create and manage flashcards easily and the intelligent suggestions for improving my study materials are invaluable. Highly recommended for anyone looking to enhance their learning efficiency!' },
  ];

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to create checkout session');
        return;
      }

      const checkoutSession = await response.json();

      if (checkoutSession.statusCode === 500) {
        console.error(checkoutSession.message);
        return;
      }

      const stripe = await getStripe();
      if (!stripe) {
        console.error('Stripe failed to initialize.');
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      if (error) {
        console.warn('Stripe checkout error:', error.message);
      }
    } catch (error) {
      console.error('Error during checkout process:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
        <Head>
          <title>Flasher.io</title>
          <meta name="description" content="Create Flashcards from your text" />
        </Head>

        <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.dark, color: theme.palette.primary.contrastText, borderRadius: 2 }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Image src={SmallLogo} alt="Flasher.io Logo" width={25} height={25} />
            </Box>
            <SignedOut>
              <Link href="/sign-in" passHref>
                <Button color="inherit" sx={{ color: theme.palette.primary.light }}>Login</Button>
              </Link>
              <Link href="/sign-up" passHref>
                <Button color="inherit" sx={{ color: theme.palette.primary.light }}>Sign Up</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box sx={{ textAlign: 'center', my: 10, py: 4, mb: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', margin: '0 auto' }}>
            <Image src={Logo} alt="Flasher.io Logo" width={300} height={120} />
          </Box>

          <Typography variant="h6" gutterBottom fontSize={14}>
            Make AI Flashcards from your custom input
          </Typography>

          <Link href="/generate" passHref>
            <Button
              variant="contained"
              color="primary"
              sx={{
                my: 2,
                mt: 2,
                backgroundColor: theme.palette.secondary.contrastText,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.contrastText,
                  color: theme.palette.primary.main,
                },
              }}
            >
              Get Started For Free
            </Button>
          </Link>
        </Box>

        <Box sx={{
          my: 5,
          pt: 5,
          pb: 5,
          px: 3,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          maxWidth: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box',
          '@media (max-width: 769px)': {
            px: 2,
            my: 3,
            pt: 3,
            pb: 3,
            fontSize: '12px',
          },
        }}>
          <CardStack items={cards} />
        </Box>

        <Box sx={{
          my: 2,
          pt: 5,
          pb: 5,
          px: 3,
          borderRadius: 2,
          textAlign: 'center',
          backgroundColor: theme.palette.secondary.dark,
        }}>
          <Typography variant="h4" gutterBottom>Features</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: theme.palette.primary.light,
                  backgroundColor: theme.palette.primary.light,
                  borderRadius: 2,
                  height: '160px',
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ '@media (max-width: 769px)': { fontSize: '20px' } }}>
                  Custom Prompt Creation
                </Typography>
                <Typography sx={{ '@media (max-width: 769px)': { fontSize: '12px' } }}>
                  Create personalized flashcards by inputting your own prompts. Our AI adapts to your specific needs, generating content that perfectly aligns with your study goals.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: theme.palette.primary.light,
                  backgroundColor: theme.palette.primary.light,
                  borderRadius: 2,
                  height: '160px',
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ '@media (max-width: 769px)': { fontSize: '18px' } }}>
                  AI-Powered Flashcard Creation
                </Typography>
                <Typography sx={{ '@media (max-width: 769px)': { fontSize: '12px' } }}>
                  Generate personalized flashcards from your study materials using cutting-edge AI. Upload your notes, and our AI will create questions and answers that help you retain key concepts efficiently.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
