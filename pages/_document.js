import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true' />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="description" content="A simulator to get a feel for pull rates of a set. Choose from featured sets or use the search bar to find a set." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}