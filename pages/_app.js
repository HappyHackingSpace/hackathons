import React from 'react'
import Head from 'next/head'

import Meta from '@happyhackingspace/meta'
import '@happyhackingspace/theme/fonts/reg-bold.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import theme from '../lib/theme'
import { ThemeProvider } from 'theme-ui'
import NProgress from '../components/nprogress'
import Nav from '../components/nav'
import Footer from '../components/footer'
import Analytics from '../components/analytics'

const App = ({ Component, pageProps }) => (
  <ThemeProvider theme={theme}>
    <Meta
      as={Head}
      title="Happy Hacking Space Hackathons"
      name="Happy Hacking Space Hackathons"
      description="A curated list of online and in-person hackathons organized by and for high school students."
      image="/card.png"
    />
    <Analytics />
    <NProgress color={theme.colors.primary} />
    <Nav app />
    <Component {...pageProps} />
    <Footer />
  </ThemeProvider>
)

export default App
