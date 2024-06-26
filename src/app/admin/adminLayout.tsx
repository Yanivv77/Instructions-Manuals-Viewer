'use client';

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/firebase.config';
import AdminLogin from '@/components/Admin/AdminLogin/AdminLogin';
import AdminSidebar from '@/components/Admin/AdminSidebar/AdminSidebar';
import styles from './AdminLayout.module.scss';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        setError('Failed to authenticate');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!user) return <AdminLogin />;

  return (
    <div className={styles.adminLayout} dir="rtl">
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className={styles.mainContent}>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}