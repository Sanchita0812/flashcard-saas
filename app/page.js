'use client'

import './globals.css';
import Logo from '../public/assets/logo.png';
import SmallLogo from '../public/assets/SmallHomeScreenLogo.png';

import React from 'react';
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Box, AppBar, Button, Container, Toolbar, Typography, Grid } from "@mui/material";
import Head from "next/head";

import { createTheme } from '@mui/material/styles';
import { CardStack } from '@/components/ui/card-stack';

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
    { id: 1, name: "Masters of Business Administration Student", designation: "IITG", content: "StudyFlash has been a game-changer for my study sessions. The intuitive AI-driven flashcards make learning complex topics much easier and more engaging. I love how I can customize the flashcards to fit my specific research needs." },
    { id: 2, name: "Computer Science Student", designation: "University of Toronto", content: "StudyFlash's flashcard tool is incredibly effective. It not only helps me review key concepts but also adapt the content based on my progress. It's become an essential part of my study routine, and the AI features make it stand out from other tools." },
    { id: 3, name: "Electrical Engineering Student", designation: "National University of Singapore", content: "As a student with a busy schedule, StudyFlash has been a lifesaver. The ability to create and manage flashcards easily and the intelligent suggestions for improving my study materials are invaluable. Highly recommended for anyone looking to enhance their learning efficiency!" },
  ];

  const handleSubmit = async () => {
    try {
      const checkoutSession = await fetch("/api/checkout_session", {
        method: "POST",
        headers: {
          origin: 'http://localhost:3000',
        },
      });

      const checkout_session = await checkoutSession.json();

      if (checkoutSession.statusCode === 500) {
        console.error(checkout_session.message);
        return;
      }

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkout_session.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (err) {
      console.error('Error during checkout session:', err);
    }
  }

  return (
    <Container maxWidth="100vw" sx={{backgroundColor: theme.palette.primary.main, color:theme.palette.primary.contrastText}}>
      <Head>
        <title>StudyFlash</title>
        <meta name="description" content="Create Flashcard from your text" />
      </Head>

      <AppBar position="static" sx={{backgroundColor: theme.palette.primary.dark, color:theme.palette.primary.contrastText, borderRadius: 2}}>
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}} sx={{color:theme.palette.primary.contrastText}}>
            <Image src={SmallLogo} alt="StudyFlash Logo" width={25} />
          </Typography>
          <SignedOut>
            <Button color="inherit" href="sign-in" sx={{color: theme.palette.primary.light}}> Login</Button>
            <Button color="inherit" href="sign-up" sx={{color: theme.palette.primary.light}}> Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box 
        sx={{
          textAlign: "center",
          my: 10,
          py: 4,
          mb: 4,
          borderRadius: 2,
        }}
      >
        <Image src={Logo} alt="StudyFlash Logo" width="300" height="120" style={{margin: "0 auto"}} />

        <Typography variant="h6" gutterBottom fontSize={14}>
          Make AI Flashcards from your custom input
        </Typography>

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
          href="/generate">
          Get Started For Free
        </Button>
      </Box>

      <Box
        sx={{
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
        }}
      >
        <CardStack items={cards} />
      </Box>

      <Box
        sx={{
          my: 2,
          pt: 5,
          pb: 5,
          px: 3,
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: theme.palette.secondary.dark
        }}
      >
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
                height: "160px"
              }}
            >
              <Typography variant="h5" gutterBottom 
                sx={{
                  '@media (max-width: 769px)': {
                    fontSize: '20px',
                  },
                }}>
                Custom Prompt Creation
              </Typography>  
              
              <Typography
                sx={{
                  '@media (max-width: 769px)': {
                    fontSize: '12px',
                  },
                }}
              > 
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
                height: "160px"
              }}
            >
              <Typography variant="h5" gutterBottom sx={{
                '@media (max-width: 769px)': {
                  fontSize: '18px',
                },
              }}>AI-Powered Flashcard Creation</Typography>  
              <Typography
                sx={{
                  '@media (max-width: 769px)': {
                    fontSize: '12px',
                  },
                }}
              > 
                Generate personalized flashcards from your study materials using cutting-edge AI. Upload your notes, and our AI will create questions and answers that help you retain key concepts efficiently.
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
                height: "160px"
              }}
            >
              <Typography variant="h5" gutterBottom sx={{
                '@media (max-width: 769px)': {
                  fontSize: '18px',
                },
              }}>Interactive Learning Experience</Typography>  
              <Typography
                sx={{
                  '@media (max-width: 769px)': {
                    fontSize: '12px',
                  },
                }}
              > 
                Engage with your flashcards in a dynamic, interactive environment. Test yourself with various quiz modes, track your progress, and stay motivated with real-time feedback and performance insights.
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
                height: "160px"
              }}
            >
              <Typography variant="h5" gutterBottom sx={{
                '@media (max-width: 769px)': {
                  fontSize: '16px',
                },
              }}>Seamless Integration with Firebase</Typography>  
              <Typography
                sx={{
                  '@media (max-width: 769px)': {
                    fontSize: '12px',
                  },
                }}
              > 
                Your data is securely stored and easily accessible across all devices, thanks to Firebase's robust cloud infrastructure. Sync your flashcards and study sessions effortlessly, anytime, anywhere.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          my: 4,
          textAlign: "center",
          pt: 5,
          pb: 5,
          px: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.secondary.dark
        }}
      >
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: theme.palette.primary.light,
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2,
                height: "225px"
              }}
            >
              <Typography variant="h5" gutterBottom>Basic</Typography>  
              <Typography variant="h6" gutterBottom>0$ / Month</Typography>  
              <Typography
                sx={{
                  '@media (max-width: 769px)': {
                    fontSize: '12px',
                  },
                }}
              > 
                Access to basic features, text customization, limited storage, and threads.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                href="/generate"
                sx={{
                  mt: 2,
                  backgroundColor: theme.palette.secondary.contrastText, 
                  color: theme.palette.primary.main, 
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.contrastText,
                    color: theme.palette.primary.main,
                  },
                }}>
                Choose Basic
              </Button>
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
                height: "225px"
              }}
            >
              <Typography variant="h5" gutterBottom>Pro</Typography>  
              <Typography variant="h6" gutterBottom>5$ / month</Typography>  
              <Typography
                sx={{
                  '@media (max-width: 769px)': {
                    fontSize: '12px',
                  },
                }}
              > 
                Unlock advanced AI features, increased storage, 
                and AI support to enhance your learning experience.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{
                  mt: 2,
                  backgroundColor: theme.palette.secondary.contrastText, 
                  color: theme.palette.primary.main, 
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.contrastText,
                    color: theme.palette.primary.main,
                  },
                }} 
                onClick={handleSubmit}>
                Choose Pro
              </Button>
            </Box>
          </Grid>

        </Grid>
      </Box>

      <footer>
        <Typography variant="body1" align="center" width="100%" height="auto" fontSize={16} sx={{color: theme.palette.primary.light}}>
          Sanchita, Vansh, Prince, & Leah © 2024 StudyFlash. All rights reserved.
        </Typography>
      </footer>
    </Container>
  );
}
