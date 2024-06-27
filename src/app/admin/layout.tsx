"use client"; 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '@/firebase/firebase.config'; 
import AdminLogin from '@/components/Admin/AdminLogin/AdminLogin';
import AdminSidebar from '@/components/Admin/AdminSidebar/AdminSidebar';
import Header from '@/components/Shared/Header';
import styles from './AdminLayout.module.scss';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }; 

  return (
    <div className={styles.adminLayout}>
      <header className={styles.header}>
        <Header title="לוח הבקרה" />
      </header>
      <div className={styles.contentWrapper}>
        <div className={styles.sidebarWrapper}>
          <AdminSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} /> 
        </div>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}