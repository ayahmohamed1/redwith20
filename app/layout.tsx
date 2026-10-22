import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://loveyouuu-lyart.vercel.app'),
  title: 'A Special Gift For You 🎁',
  description: 'A heartfelt birthday message just for you.',
  openGraph: {
    title: 'A Special Gift For You 🎁',
    description: 'A heartfelt birthday message just for you.',
    url: 'https://loveyouuu-lyart.vercel.app',
    siteName: 'Birthday Gift',
    type: 'website',
    images: [
      {
        url: '/images/share-cover.png',
        width: 1200,
        height: 630,
        alt: 'A Special Gift',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A Special Gift For You 🎁',
    description: 'A heartfelt birthday message just for you.',
    images: ['/images/share-cover.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Nunito:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
