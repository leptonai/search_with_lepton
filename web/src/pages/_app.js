// import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
 
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
 
export default MyApp;