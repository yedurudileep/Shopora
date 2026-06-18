import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '30px' }}>
      <h2 style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '15px', marginBottom: '20px' }}>My Profile</h2>
      <div style={{ fontSize: '16px', lineHeight: '2' }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Member Since:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
