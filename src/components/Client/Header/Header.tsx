import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>אתר הוראות הפעלה</h1>
    </header>
  );
}