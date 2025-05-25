import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const UserMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    <div style={{ position: 'relative', display: 'inline-block', float: 'right', margin: '1rem' }}>
      <button onClick={() => setShowMenu(!showMenu)}>
        {user?.username || 'User'} ▾
      </button>
      {showMenu && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '2rem',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          zIndex: 1,
          padding: '0.5rem',
        }}>
          <button onClick={() => navigate('/profile')}>Profile</button><br />
          <button onClick={() => navigate('/change-password')}>Change Password</button><br />
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
