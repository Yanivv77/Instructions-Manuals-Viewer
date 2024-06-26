'use client';

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/firebase.config';
import AdminLogin from '@/components/AdminLogin/AdminLogin';
import AdminNavbar from '@/components/ui/AdminNavbar';
import styles from './AdminLayout.module.scss';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        setError('Failed to authenticate');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!user) return <AdminLogin />;

  return (
    <div className={styles.adminLayout} dir="rtl">
      <AdminNavbar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}