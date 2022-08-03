import * as React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { red } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const createEmotionCache = () => createCache({ key: 'css' });

interface ClientStyleContextData {
  reset: () => void;
}

const ClientStyleContext = React.createContext<ClientStyleContextData>({
  reset: () => {},
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

export default function MuiRoot ({ children }: { children: React.ReactNode; }) {
  const [cache, setCache] = React.useState(createEmotionCache());

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CacheProvider>
    </ClientStyleContext.Provider>
  );
}
