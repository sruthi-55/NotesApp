import { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await AuthService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchUser();
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
    </div>
  );
};

export default Profile;
