'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getStripe from "@/utils/get-stripe";
import { useSearchParams } from "next/navigation";
import { Container, Typography, CircularProgress, Box, Button } from "@mui/material";
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#676f8d', // Fixed typo here
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

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return;

      try {
        const res = await fetch(`/api/checkout_session?session_id=${session_id}`);
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error || "An error occurred");
        }
      } catch (err) {
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutSession();
  }, [session_id]);

  if (loading) {
    return (
      <Container maxWidth="100vw" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="100vw" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" sx={{ mt: 2 }}>{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="100vw" sx={{ textAlign: 'center', mt: 4 }}>
      {session?.payment_status === "paid" ? (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>Success! Your purchase was successful.</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Session ID: {session_id}</Typography>
            <Typography variant="body1">
              We have received your payment and you can now access the premium features of Flasher.io!
            </Typography>
            <Button
              my={4}
              href="/"
              sx={{
                mt: 4,
                backgroundColor: theme.palette.secondary.contrastText,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.contrastText,
                  color: theme.palette.primary.main,
                },
              }}
            >
              Back to Home Page
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h3" sx={{ mt: 4 }}>Payment Failed.</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              We were unable to process your payment. Please try again later.
            </Typography>
            <Button
              my={4}
              href="/"
              sx={{
                mt: 4,
                backgroundColor: theme.palette.secondary.contrastText,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.contrastText,
                  color: theme.palette.primary.main,
                },
              }}
            >
              Back to Home Page
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default ResultPage;
