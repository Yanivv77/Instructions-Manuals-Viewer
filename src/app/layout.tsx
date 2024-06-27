import type { Metadata } from 'next'
import { Inter } from "next/font/google"
import styles from './layout.module.scss'
import '@/styles/globals.css' 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Your app description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="heb" className={styles.root}>
      <body className={inter.className}>
        <main>{children}</main> 
      </body>
    </html>
  );
}