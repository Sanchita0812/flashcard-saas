export default function SignUpPage(){
  return(
  <Container maxWidth="100vw">
      <AppBar position="static" sx={{backgroundColor: theme.palette.primary.dark}}>
          <Toolbar>
              <Typography variant="h6" sx={{flexGrow: 1}}>
                <Image src={SmallLogo} alt="StudyFlash Logo" width={25} sx={{textAlign: "center"}}/>
              </Typography>
              <Button color="inherit" sx={{color: theme.palette.primary.contrastText}}>
              <Link href="/sign-in" passHref/>
                  Login
              </Button>
          </Toolbar>
      </AppBar>


      <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{textAlign: 'center', my: 4}}
          >
          <Typography variant="h4" component="h1" gutterBottom>
              Sign Up
          </Typography>
          <SignUp />
      </Box>
  </Container>
  );
}

