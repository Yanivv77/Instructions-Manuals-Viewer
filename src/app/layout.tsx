import type { Metadata } from 'next'
import { Rubik } from "next/font/google"
import '@/styles/globals.css'

const rubik = Rubik({
  subsets: ["hebrew"],
  weight: ['300', '400', '500', '700'],
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: 'אתר הוראות הפעלה',
  description: 'אתר למציאת הוראות הפעלה למוצרים שונים',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable}>
      <body className={rubik.className}>
        {children}
      </body>
    </html>
  );
}