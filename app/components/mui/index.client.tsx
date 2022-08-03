import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import AppThemeProvider from './theme';
import createEmotionCache from './createEmotionCache';
import ClientStyleContext from './ClientStyleContext';

export default function MuiRoot ({ children }: { children: React.ReactNode; }) {
  const [cache, setCache] = React.useState(createEmotionCache());

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>
        <AppThemeProvider>
          {children}
        </AppThemeProvider>        
      </CacheProvider>
    </ClientStyleContext.Provider>
  );
}

export { ClientStyleContext }
