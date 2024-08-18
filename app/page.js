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
import { checkCustomRoutes } from "next/dist/lib/load-custom-routes";

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
  // Create the cards array with your data
  const cards = [
    { id: 1, name: "Masters of Business Administration Student", designation: "University of Georgia", content: "Flasher.io has been a game-changer for my study sessions. The intuitive AI-driven flashcards make learning complex topics much easier and more engaging. I love how I can customize the flashcards to fit my specific research needs." },
    { id: 2, name: "Computer Science Student", designation: "Georgia Institute of Technology", content: "Flasher.io's flashcard tool is incredibly effective. It not only helps me review key concepts but also adapt the content based on my progress. It's become an essential part of my study routine, and the AI features make it stand out from other tools." },
    { id: 3, name: "Electrical Engineering Student", designation: "UC Berkeley", content: "As a student with a busy schedule, Flasher.io has been a lifesaver. The ability to create and manage flashcards easily and the intelligent suggestions for improving my study materials are invaluable. Highly recommended for anyone looking to enhance their learning efficiency!" },
    // Add more cards as needed
  ];

  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: 'http://localhost:3000',
      },
    });

  const checkout_session = await checkoutSession.json();

  if (checkoutSession.statusCode === 500){
    console.error(checkoutSession.message);
    return
  }

  const stripe = await getStripe();
  const { error } = await stripe.redirectToCheckout({
    sessionId: checkout_session.id,
  });

  if (error){
    console.warn(error.message);
  }
  }

  return (
    <Container maxWidth="100vw" sx={{backgroundColor: theme.palette.primary.main, color:theme.palette.primary.contrastText}}>
      <Head maxWidth="100vw">
        <title>Flasher.io</title>
        <meta name = "description" content = "Create Flashcard from your text" />
      </Head>

      <AppBar position="static" sx={{backgroundColor: theme.palette.primary.dark, color:theme.palette.primary.contrastText, borderRadius: 2}}>
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}} sx={{color:theme.palette.primary.contrastText}}><Image src={SmallLogo} alt="Flasher.io Logo" width={25} sx={{textAlign: "center"}}/></Typography>
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
          // backgroundColor: theme.palette.secondary.dark
        }}
      >

        <Image src={Logo} alt="Flasher.io Logo" width="300vw" height="120vh" sx={{textAlign: "center", alignContent: "center", alignItems: "center",}} style={{margin: "0 auto"}} />

        <Typography variant="h6" gutterBottom fontSize={14}>
          {' '}
          Make AI Flashcards from your custom input
        </Typography>

        <Button 
        variant="contained" 
        color = "primary" 
        sx = {{
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
          flexDirection: 'column', // Stack items vertically
          textAlign: 'center',
          maxWidth: '100%', // Prevent overflow
          overflow: 'hidden', // Hide overflow
          boxSizing: 'border-box', // Include padding and border in width/height
          '@media (max-width: 769px)': {
            px: 2, // Adjust horizontal padding
            my: 3, // Adjust vertical margins
            pt: 3, // Adjust top padding
            pb: 3, // Adjust bottom padding
            fontSize: '12px', // Adjust font size if needed
          },
        }}
      >
        {/* Aceternity Card Stack Animation UI */}
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
        <Grid container spacing = {3}>
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
                fontSize: '20px', // Adjust font size if needed
                },
              }} >
                Custom Prompt Creation
              </Typography>  
              
              <Typography
              sx={{
                '@media (max-width: 769px)': {
                fontSize: '12px', // Adjust font size if needed
                },
              }}
              > 
                {' '}
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
                fontSize: '18px', // Adjust font size if needed
                },
              }}>AI-Powered Flashcard Creation</Typography>  
              <Typography
              sx={{
                '@media (max-width: 769px)': {
                fontSize: '12px', // Adjust font size if needed
                },
              }}
              > 
                {' '}
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
                fontSize: '18px', // Adjust font size if needed
                },
              }}>Interactive Learning Experience</Typography>  
              <Typography
              sx={{
                '@media (max-width: 769px)': {
                fontSize: '12px', // Adjust font size if needed
                },
              }}
              > 
                {' '}
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
                fontSize: '16px', // Adjust font size if needed
                },
              }}>Seamless Integration with Firebase</Typography>  
              <Typography
              sx={{
                '@media (max-width: 769px)': {
                fontSize: '12px', // Adjust font size if needed
                },
              }}
              > 
                {' '}
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
        <Grid container spacing = {3}>
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
                fontSize: '12px', // Adjust font size if needed
                },
              }}
              > 
                {' '}
                Access to basic features, text customization, limited storage, and threads.
              </Typography>
              <Button 
              variant="contained" 
              color = "primary" 
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
                fontSize: '12px', // Adjust font size if needed
                },
              }}
              > 
                {' '}
                Unlock advanced AI features, increased storage, 
                and AI support to enhance your learning experience.
              </Typography>
              <Button 
              variant="contained" 
              color = "primary" 
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
        <Typography variant="body1" align="center" width="100" height="auto" fontSize={16} sx={{color: theme.palette.primary.light}}>
          Ryan, Mason, Jeremiah, & Nabit © 2024 Flasher.io. All rights reserved.
        </Typography>
      </footer>
    </Container>
  );
}
