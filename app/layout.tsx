import type { Metadata } from 'next'
import { Roboto, Share_Tech_Mono } from 'next/font/google'
import './globals.css'

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--sans',
})

const shareTechMono = Share_Tech_Mono({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--mono',
})

export const metadata: Metadata = {
  title: 'Code4Life — We Build The Future',
  description: 'Code4Life - We Build The Future of Digital Products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${shareTechMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
