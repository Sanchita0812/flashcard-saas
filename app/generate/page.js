'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { db } from '@/firebase';
import { doc, collection, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default function Generate() {
  const { isLoading, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return (
      <Typography
        variant="h5"
        my={50}
        sx={{ position: 'relative', textAlign: 'center', color: theme.palette.primary.contrastText }}
      >
        Loading...
      </Typography>
    );
  }

  if (!isSignedIn) {
    return (
      <Container maxWidth="100vw" sx={{ backgroundColor: theme.palette.primary.main }}>
        <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.dark }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Image src={SmallLogo} alt="Flasher.io Logo" width={25} height={25} />
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in" sx={{ color: theme.palette.primary.contrastText }}>
                Login
              </Button>
              <Button color="inherit" href="/sign-up" sx={{ color: theme.palette.primary.contrastText }}>
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        <Typography variant="h5" my={50} sx={{ position: 'relative', textAlign: 'center' }}>
          You must be signed in to generate flashcards.
        </Typography>
      </Container>
    );
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Error generating flashcards:', error);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRefresh = () => {
    setFlashcards([]);
    handleSubmit();
  };

  const saveFlashcards = async () => {
    if (!isSignedIn || isLoading) {
      alert('User is not logged in');
      return;
    }

    if (!name) {
      alert('Please enter a name');
      return;
    }

    if (!user?.id) {
      console.error('User ID is not available');
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(db, 'users', user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert('Flashcard collection with the same name already exists');
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push('/flashcards');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="100vw" sx={{ backgroundColor: theme.palette.primary.main }}>
        <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.dark }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Image src={SmallLogo} alt="Flasher.io Logo" width={25} height={25} />
            </Typography>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Button
          href="/"
          sx={{
            mt: 2,
            backgroundColor: theme.palette.secondary.contrastText,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.secondary.contrastText,
              color: theme.palette.primary.main,
            },
          }}
        >
          Back Page
        </Button>
        <Button
          href="/flashcards"
          sx={{
            mt: 2,
            position: 'absolute',
            right: 25,
            backgroundColor: theme.palette.secondary.contrastText,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.secondary.contrastText,
              color: theme.palette.primary.main,
            },
          }}
        >
          View Flashcard Sets
        </Button>

        <Box sx={{ my: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            my={10}
            gutterBottom
            sx={{ color: theme.palette.primary.contrastText, textAlign: 'center' }}
          >
            Generate Flashcards
          </Typography>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            sx={{
              mb: 2,
              backgroundColor: theme.palette.primary.contrastText,
              color: theme.palette.primary.contrastText,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: theme.palette.secondary.contrastText,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.secondary.contrastText,
                color: theme.palette.primary.main,
              },
            }}
            onClick={handleSubmit}
            fullWidth
          >
            Submit
          </Button>
        </Box>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Generated Flashcard Preview
            </Typography>
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardActionArea onClick={() => handleCardClick(index)}>
                      <CardContent>
                        <Box
                          sx={{
                            perspective: '1000px',
                            '& > div': {
                              transition: 'transform 0.6s',
                              transformStyle: 'preserve-3d',
                              position: 'relative',
                              width: '100%',
                              height: '200px',
                              boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                              transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            },
                            '& > div > div': {
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '16px',
                              boxSizing: 'border-box',
                            },
                            '& > div > div.back': {
                              transform: 'rotateY(180deg)',
                              backgroundColor: theme.palette.primary.light,
                            },
                          }}
                        >
                          <div>
                            <div>{flashcard.front}</div>
                            <div className="back">{flashcard.back}</div>
                          
                            <div>{flashcard.front}</div>
                            <div className="back">{flashcard.back}</div>
                          </div>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleRefresh}
            sx={{
              mt: 2,
              mr: 2,
              backgroundColor: theme.palette.secondary.contrastText,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.secondary.contrastText,
                color: theme.palette.primary.main,
              },
            }}
          >
            Refresh Flashcards
          </Button>

          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              mt: 2,
              backgroundColor: theme.palette.secondary.contrastText,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.secondary.contrastText,
                color: theme.palette.primary.main,
              },
            }}
          >
            Save Flashcards
          </Button>
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcard set.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveFlashcards}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
