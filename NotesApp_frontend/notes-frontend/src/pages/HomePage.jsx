import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.title}>Welcome to Sruthi's NotesApp</h1>
        <p className={styles.subtitle}>
          Capture your ideas. Organize your thoughts. Access them anytime, anywhere.
        </p>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${styles.loginButton}`}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button
            className={`${styles.button} ${styles.registerButton}`}
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
