"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";

import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Button,
  ThemeProvider,
  createTheme,
} from "@mui/material";

// Custom theme for MUI components
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

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [matched, setMatched] = useState({});
  const [matchMode, setMatchMode] = useState(false);
  const [highlighted, setHighlighted] = useState({});
  const [hidden, setHidden] = useState({});
  const [red, setRed] = useState({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    const getFlashcards = async () => {
      if (!search || !user) return;

      try {
        const userDocRef = doc(db, "users", user.id);
        const colRef = collection(userDocRef, search);
        const docSnap = await getDocs(colRef);

        const fetchedFlashcards = docSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (matchMode) {
          const doubledCards = fetchedFlashcards.flatMap((flashcard) => [
            { ...flashcard, type: "front" },
            { ...flashcard, type: "back" },
          ]);
          setFlashcards(shuffleFlashcards(doubledCards));
        } else {
          setFlashcards(fetchedFlashcards);
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };

    getFlashcards();
  }, [user, search, matchMode]);

  const shuffleFlashcards = (flashcards) => {
    const shuffledArray = [...flashcards];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[randomIndex]] = [
        shuffledArray[randomIndex],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleHighlightClick = (id) => {
    if (highlighted[id]) {
      setHighlighted((prev) => ({
        ...prev,
        [id]: false,
      }));
      return;
    }

    const highlightedIds = Object.keys(highlighted).filter(
      (key) => highlighted[key]
    );

    if (highlightedIds.length === 1) {
      const first = highlightedIds[0];
      const second = id;

      if (
        flashcards[first].type !== flashcards[second].type &&
        flashcards[first].front === flashcards[second].front
      ) {
        setMatched((prev) => ({
          ...prev,
          [first]: true,
          [second]: true,
        }));
        setHidden((prev) => ({
          ...prev,
          [first]: true,
          [second]: true,
        }));

        setHighlighted({});
        if (Object.keys(matched).length + 2 === flashcards.length) {
          setTimeout(() => {
            resetGame();
          }, 1000);
        }
      } else {
        setRed((prev) => ({
          ...prev,
          [first]: true,
          [second]: true,
        }));

        setTimeout(() => {
          setRed({});
          setHighlighted({
            [first]: false,
            [second]: false,
          });
        }, 500);
      }
    } else {
      setHighlighted((prev) => ({
        ...prev,
        [id]: true,
      }));
    }
  };

  const resetGame = () => {
    setRed({});
    setMatched({});
    setHidden({});
    setHighlighted({});
    setFlashcards(shuffleFlashcards(flashcards));
  };

  const toggleMatchMode = () => {
    setMatchMode((prev) => !prev);
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          sx={{ mt: 4, textAlign: "center", position: "relative" }}
          gutterBottom
        >
          {matchMode ? "Match Flashcards" : "Generated Flashcard Preview"}
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  color: theme.palette.primary.main,
                  borderColor: highlighted[index]
                    ? theme.palette.secondary.light
                    : "transparent",
                  borderWidth: highlighted[index] ? "5px" : "0px",
                  borderStyle: "solid",
                  transition: "border-color 0.3s",
                }}
              >
                <CardActionArea
                  onClick={
                    matchMode
                      ? () => handleHighlightClick(index)
                      : () => handleCardClick(index)
                  }
                >
                  <CardContent>
                    <Box
                      sx={{
                        perspective: "1000px",
                        "& > div": {
                          position: "relative",
                          width: "100%",
                          height: "200px",
                          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                          transition: matchMode
                            ? "background-color 0.3s, border 0.3s"
                            : "transform 0.6s",
                          transformStyle: "preserve-3d",
                          transform: flipped[index]
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        },
                        "& > div > div": {
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 2,
                          boxSizing: "border-box",
                          backfaceVisibility: "hidden",
                          backgroundColor: hidden[index]
                            ? "#90EE90"
                            : red[index]
                            ? "#FF6347"
                            : "white",
                        },
                        "& > div > div:nth-of-type(2)": {
                          transform: "rotateY(180deg)",
                        },
                      }}
                    >
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.type === "front"
                            ? flashcard.front
                            : flashcard.back}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.type === "back"
                            ? flashcard.back
                            : flashcard.front}
                        </Typography>
                      </div>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            onClick={toggleMatchMode}
            sx={{
              textAlign: "center",
              backgroundColor: theme.palette.secondary.contrastText,
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.secondary.contrastText,
                color: theme.palette.primary.main,
              },
              mr: 2,
            }}
          >
            {matchMode ? "Back to Preview" : "Match"}
          </Button>
          <Button
            onClick={() => setFlashcards(shuffleFlashcards(flashcards))}
            sx={{
              textAlign: "center",
              backgroundColor: theme.palette.secondary.contrastText,
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.secondary.contrastText,
                color: theme.palette.primary.main,
              },
            }}
          >
            Shuffle
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
