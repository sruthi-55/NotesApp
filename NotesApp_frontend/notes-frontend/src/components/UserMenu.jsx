import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import styles from './UserMenu.module.css';

const UserMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await AuthService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error('Failed to fetch user profile');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={styles.menuWrapper} ref={menuRef}>
      <button className={styles.toggleButton} onClick={() => setShowMenu(!showMenu)}>
        {user?.username || 'User'} ▾
      </button>

      {showMenu && (
        <div className={styles.dropdown}>
          <button className={styles.menuItem} onClick={() => navigate('/profile')}>Profile</button>
          <button className={styles.menuItem} onClick={() => navigate('/change-password')}>Change Password</button>
          <button className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
