import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout, currentDate } = useAuth();

  return (
    <div>
      <header className="header">
        <div className="container header-content">
          <div>
            <Link to="/" className="logo">Learning Platform</Link>
            <div className="system-info">
              <small>Current Date and Time (UTC): {currentDate}</small><br/>
              <small>Current User's Login: {user?.login || 'Guest'}</small>
            </div>
          </div>
          <div className="user-info">
            {user ? (
              <>
                <span className="user-name">Hello, {user.name}</span>
                <button onClick={logout} className="btn btn-primary">Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">Login</Link>
            )}
          </div>
        </div>
      </header>
      
      <main className="main">
        {children}
      </main>
      
      <footer className="footer">
        <div className="container">
          <p className="footer-text">© {new Date().getFullYear()} Learning Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;