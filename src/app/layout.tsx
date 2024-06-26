import type { Metadata } from 'next'
import { Inter } from "next/font/google"
import styles from './layout.module.scss'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your app description",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={styles.root}>
      <body className={inter.className}>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  )
}