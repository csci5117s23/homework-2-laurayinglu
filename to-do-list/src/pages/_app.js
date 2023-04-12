// import 'bootstrap/dist/css/bootstrap.css'
import '@/styles/globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import Layout from '@/components/Layout.js';

export default function App({ Component, pageProps }) {

  return (
    <ClerkProvider {...pageProps} >
      
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

