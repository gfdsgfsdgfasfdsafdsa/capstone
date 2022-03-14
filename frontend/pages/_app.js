import '../styles/globals.css'
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import { AuthContextProvider } from '../libs/AuthContext'
import { axiosInstance, createEmotionCache, theme } from '../utils/index'
import { SWRConfig } from 'swr'
import { SnackbarProvider } from 'notistack';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    const getLayout = Component.getLayout ?? ((page) => page);
    const fetcher = url => axiosInstance.get(url).then(res => res.data)

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <SWRConfig value={{
                    fetcher,
                    // errorRetryCount: 2,
                }}
                >
                    <AuthContextProvider>
                        <SnackbarProvider maxSnack={3}>
                            {getLayout(<Component {...pageProps} />)}
                        </SnackbarProvider>
                    </AuthContextProvider>
                </SWRConfig>
            </ThemeProvider>
        </CacheProvider>
    );
}

