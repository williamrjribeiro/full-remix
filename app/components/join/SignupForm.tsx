import * as React from 'react'
import Icon from '@mui/material/Icon';
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Form as RemixForm, Link as RemixLink } from "@remix-run/react"

type SignupFormProps = { search: string; redirectTo?: string; emailError?: string }

const SignupForm = ({ search, redirectTo, emailError }: SignupFormProps) => {
  const emailRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (emailError) {
      emailRef.current?.focus()
    }
  }, [emailError])

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <Icon>lock</Icon>
        </Avatar>
        <Typography component="h1" variant="h5">
          Email from the Cognito User Pool
        </Typography>
        <Box component={RemixForm} noValidate method="post" sx={{ mt: 3 }}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={emailError ? true : undefined}
            aria-describedby="email-error"
            error={Boolean(emailError)}
            helperText={emailError}
            inputRef={emailRef}
          />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link variant="body2" component={RemixLink} to={{
                pathname: "/login",
                search,
              }}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default SignupForm