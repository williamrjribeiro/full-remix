import type { EmotionCache } from '@emotion/react';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import AppThemeProvider from './theme';

type MuiRemixServerProps = {
  children: React.ReactNode;
  cache: EmotionCache;
}

const MuiRemixServer = ({ children, cache }: MuiRemixServerProps) => (
  <CacheProvider value={cache}>
    <AppThemeProvider>
      {children}
    </AppThemeProvider>
  </CacheProvider>
);

function extractCriticalMUIStyles(cache: EmotionCache, html: string): string {
  const { extractCriticalToChunks } = createEmotionServer(cache);
  const { styles } = extractCriticalToChunks(html);

  let stylesHTML = '';

  styles.forEach(({ key, ids, css }) => {
    const emotionKey = `${key} ${ids.join(' ')}`;
    const newStyleTag = `<style data-emotion="${emotionKey}">${css}</style>`;
    stylesHTML = `${stylesHTML}${newStyleTag}`;
  });

  // Add the Emotion style tags after the insertion point meta tag
  const markup = html.replace(
    /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
    `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${stylesHTML}`,
  );

  return markup;
}

export default MuiRemixServer;
export { extractCriticalMUIStyles };