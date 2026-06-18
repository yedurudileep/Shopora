import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center" style={{ padding: '100px 20px' }}>
      <h1 style={{ fontSize: '72px', color: 'var(--primary)', marginBottom: '20px' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">Go to Home</Link>
    </div>
  );
};

export default NotFoundPage;
