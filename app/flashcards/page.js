"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#676f8d",
      main: "#424769",
      dark: "#2d3250",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#AD81A7",
      main: "#6C5E82",
      dark: "#2E365A",
      contrastText: "#F8C19B",
    },
  },
});

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getFlashcards = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    };

    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const handleRemoveSet = async (name) => {
    if (!user) return;
    const docRef = doc(db, "users", user.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentFlashcards = docSnap.data().flashcards || [];
      const updatedFlashcards = currentFlashcards.filter(
        (flashcard) => flashcard.name !== name
      );
      await updateDoc(docRef, { flashcards: updatedFlashcards });
      setFlashcards(updatedFlashcards);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Button
          onClick={() => router.push("/")}
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            backgroundColor: theme.palette.secondary.contrastText,
            color: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.primary.dark,
            },
          }}
        >
          Back Page
        </Button>

        <Typography
          variant="h2"
          component="h1"
          sx={{ mt: 4, textAlign: "center", color: theme.palette.primary.main }}
        >
          Saved Flashcard Sets
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{
            my: 3,
            pt: 3,
            pb: 3,
            px: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.dark,
          }}
        >
          {flashcards.length > 0 ? (
            flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: theme.palette.primary.contrastText,
                    color: theme.palette.primary.main,
                  }}
                >
                  <CardActionArea
                    onClick={() => handleCardClick(flashcard.name)}
                  >
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <Button
                    onClick={() => handleRemoveSet(flashcard.name)}
                    sx={{
                      my: 2,
                      mx: 2,
                      textAlign: "center",
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.primary.contrastText,
                      "&:hover": {
                        backgroundColor: theme.palette.secondary.dark,
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    Remove Set
                  </Button>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.primary.contrastText,
                width: "100%",
                textAlign: "center",
                mt: 4,
              }}
            >
              No flashcard sets found.
            </Typography>
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
