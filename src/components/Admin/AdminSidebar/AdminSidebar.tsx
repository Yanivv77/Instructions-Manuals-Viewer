import React from 'react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase.config';
import styles from './AdminSidebar.module.scss';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect or handle successful logout here if needed
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      <button className={styles.menuToggle} onClick={onToggle} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav className={`${styles.AdminSidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.navContent}>
          <ul className={styles.navList}>
            <li><Link href="/">עמוד בית</Link></li>
            <li><Link href="/importers">הוספת יבואנים</Link></li>
            <li><Link href="/brands">הוספת מותגים</Link></li>
            <li><Link href="/products">הוספת מוצרים</Link></li>
            <li><Link href="/manuals">הוספת הוראות הפעלה</Link></li>
          </ul>
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          התנתק
        </button>
      </nav>
    </>
  );
};

export default AdminSidebar;