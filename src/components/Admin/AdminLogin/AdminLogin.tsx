import React, { useState } from 'react';
import { loginUser } from '@/lib/auth';
import styles from './AdminLogin.module.scss';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      console.log('Logged in successfully');
      
    } catch (err) {
      setError('כניסה נכלשה תבדוק את הפרטים שהזנת ונסה שוב');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>כניסת מנהל</h2>
       
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="אימייל"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="סיסמה"
          required
        />
        <button type="submit">כניסה</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;