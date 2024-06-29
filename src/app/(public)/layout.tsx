import React from 'react';
import Header from '@/components/Client/Header/Header';
import Footer from '@/components/Client/Footer/Footer';
import Breadcrumb from '@/components/Client/Breadcrumb/Breadcrumb';
import styles from './layout.module.scss';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.layout}>
      <div className={styles.pageContainer}>
      <Header />
      <Breadcrumb />
      <main className={styles.main}>{children}</main>
      <Footer />
      </div>
    </div>
  );
}