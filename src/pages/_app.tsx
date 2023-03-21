import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';

import theme from '@/constants/theme';
import createEmotionCache from '@/lib/createEmotionCache';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function App({ Component, pageProps, emotionCache }: MyAppProps) {
  return (
    <CacheProvider value={emotionCache ?? clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
