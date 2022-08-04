import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

function Hero() {
  const heroImage = 'https://user-images.githubusercontent.com/1500684/158276318-61064670-06c3-43f3-86e3-d624785b8ff7.jpg'
  return (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: '#fff',
        mb: 4,
        mt: 2,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${heroImage})`,
      }}
    >
      {/* Increase the priority of the hero background image */}
      {<img style={{ display: 'none' }} src={heroImage} alt="Nirvana playing on stage with Kurt's jagstang guitar" />}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.3)',
        }}
      />
      <Grid container>
        <Grid item>
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 20 },
            }}
          >
            <Typography component="h1" variant="h1" color="inherit" gutterBottom sx={{ m: 0 }}>
              MUI 5 + Remix Grunge
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default function Index() {
  const user = useOptionalUser();

  return (
    <Container component="main">
      <Hero />

      <Box display="flex" justifyContent="center" mb={4}>
        {user ? (
          <Link to="/notes">View Notes for {user.email}</Link>
        ) : (
          <Stack spacing={2} direction="row">
            <Button variant="outlined" component={Link} to="/join">Sign up</Button>
            <Button variant="contained" component={Link} to="/login">Log in</Button>
          </Stack>
        )}
      </Box>

      <Box display="flex" justifyContent="center">
        {[
          {
            src: "https://user-images.githubusercontent.com/1500684/157991167-651c8fc5-2f72-4afa-94d8-2520ecbc5ebc.svg",
            alt: "AWS",
            href: "https://aws.com",
          },
          {
            src: "https://user-images.githubusercontent.com/1500684/157991935-26c0d587-b866-49f5-af34-8f04be1c9df2.svg",
            alt: "DynamoDB",
            href: "https://aws.amazon.com/dynamodb/",
          },
          {
            src: "https://user-images.githubusercontent.com/1500684/157990874-31f015c3-2af7-4669-9d61-519e5ecfdea6.svg",
            alt: "Architect",
            href: "https://arc.codes",
          },
          {
            src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
            alt: "Cypress",
            href: "https://www.cypress.io",
          },
          {
            src: "https://user-images.githubusercontent.com/1500684/157772386-75444196-0604-4340-af28-53b236faa182.svg",
            alt: "MSW",
            href: "https://mswjs.io",
          },
          {
            src: "https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg",
            alt: "Vitest",
            href: "https://vitest.dev",
          },
          {
            src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
            alt: "Testing Library",
            href: "https://testing-library.com",
          },
          {
            src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
            alt: "Prettier",
            href: "https://prettier.io",
          },
          {
            src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
            alt: "ESLint",
            href: "https://eslint.org",
          },
          {
            src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
            alt: "TypeScript",
            href: "https://typescriptlang.org",
          },
        ].map((img) => (
          <MuiLink component={IconButton} key={img.href} href={img.href}>
            <img alt={`${img.alt} logo`} src={img.src} width={64} height={64} />
          </MuiLink>
        ))}
      </Box>
    </Container >
  );
}
