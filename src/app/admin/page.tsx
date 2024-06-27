'use client';
import React from 'react';
import styles from './page.module.scss';

export default function AdminPage() {
  return (
    <>
      <div className={styles.dashboard}>
        <h1 className={styles.title}>מערכת ניהול הוראות הפעלה</h1>
        <p className={styles.description}>
          המערכת הזו היא פלטפורמה לניהול הוראות הפעלה למוצרים שונים. היא מאפשרת למנהלי מערכת לארגן ולנהל מידע על יבואנים, מותגים, מוצרים והוראות הפעלה באופן היררכי ומסודר.
        </p>
        <h2 className={styles.sectionTitle}>המרכיבים העיקריים:</h2>
        <div className={styles.componentGrid}>
          {[
            { title: 'יבואנים ', description: 'ניהול יבואנים עם שם כתובת  ולוגו .' },
            { title: 'מותגים ', description: 'ניהול מותגים המשויכים ליבואנים ספציפיים.' },
            { title: 'מוצרים ', description: 'ניהול מוצרים המשויכים למותגים ספציפיים.' },
            { title: 'הוראות הפעלה ', description: 'ניהול הוראות הפעלה המקושרות למוצרים ספציפיים.' },
          ].map((component, index) => (
            <div key={index} className={styles.componentCard}>
              <h3 className={styles.componentTitle}>{component.title}</h3>
              <p className={styles.componentDescription}>{component.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}