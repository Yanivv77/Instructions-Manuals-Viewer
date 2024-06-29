"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Breadcrumb.module.scss';

const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  const getLabel = (index: number) => {
    switch (index) {
      case 0:
        return 'מותגים';
      case 1:
        return 'מוצרים';
      case 2:
        return 'מודל';
      default:
        return '';
    }
  };

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href="/">יבואנים</Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const label = getLabel(index);
          return (
            <li key={segment}>
              {isLast ? (
                <span aria-current="page">{label}</span>
              ) : (
                <Link href={href}>{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;