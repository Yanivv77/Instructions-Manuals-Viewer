'use client';

import React from 'react';
import AdminLayout from './adminLayout';
import styles from './page.module.scss';

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <h1>hello</h1>
        {/* Add dashboard content here */}
      </div>
    </AdminLayout>
  );
}