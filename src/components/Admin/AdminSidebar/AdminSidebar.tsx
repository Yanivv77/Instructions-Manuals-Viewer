import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase.config';
import styles from './AdminSidebar.module.scss';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();
  console.log(pathname);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      <button className={styles.menuToggle} onClick={onToggle} aria-label="Toggle menu">
  
      </button>
      <nav className={`${styles.AdminSidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.navContent}>
          <ul className={styles.navList}>
            <li className={pathname === '/admin' ? styles.active : ''}>
              <Link href="/admin">עמוד בית</Link>
            </li>
            <li className={pathname === '/admin/importers' ? styles.active : ''}>
              <Link href="/admin/importers">יבואנים</Link>
            </li>
            <li className={pathname === '/admin/brands' ? styles.active : ''}>
              <Link href="/admin/brands">מותגים</Link>
            </li>
            <li className={pathname === '/admin/products' ? styles.active : ''}>
              <Link href="/admin/products">מוצרים</Link>
            </li>
            <li className={pathname === '/admin/manuals' ? styles.active : ''}>
              <Link href="/admin/manuals">הוראות הפעלה</Link>
            </li>
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