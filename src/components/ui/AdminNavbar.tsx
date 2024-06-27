import React from 'react';
import Link from 'next/link';
import { logoutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const AdminNavbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/admin'); 
  };

  return (
    <nav>
      <Link href="/admin">Dashboard</Link>
      <Link href="/admin/importers">Importers</Link>
      <Link href="/admin/brands">Brands</Link>
      <Link href="/admin/products">Products</Link>
      <Link href="/admin/manuals">Manuals</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default AdminNavbar;