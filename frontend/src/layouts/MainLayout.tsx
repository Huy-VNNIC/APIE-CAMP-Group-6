import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout, currentDate } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Menu items
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/resources', label: 'Resources', icon: '📚' },
    { path: '/progress', label: 'My Progress', icon: '📈' },
    { path: '/activities', label: 'Activities', icon: '📋' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header 
        style={{ 
          backgroundColor: 'white', 
          boxShadow: scrolled ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none', 
          transition: 'box-shadow 0.3s ease',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '1rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ 
                color: 'var(--primary)', 
                margin: 0, 
                fontSize: '1.5rem', 
                fontWeight: 'bold' 
              }}>
                Learning Platform
              </h1>
            </Link>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
              <div>Current Date and Time (UTC): {currentDate}</div>
              <div>Current User's Login: {user?.login || 'Guest'}</div>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button 
            className="mobile-menu-toggle md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{ 
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            {showMobileMenu ? '✖' : '☰'}
          </button>

          {/* Desktop menu */}
          <div className="desktop-menu hidden md:flex items-center">
            {user ? (
              <>
                <span style={{ marginRight: '1rem' }}>Hello, {user.name}</span>
                <button 
                  onClick={logout}
                  style={{ 
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                style={{ 
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '0.25rem',
                  textDecoration: 'none'
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu (shown when toggled) */}
      {showMobileMenu && (
        <div 
          className="mobile-menu md:hidden"
          style={{ 
            backgroundColor: 'white',
            padding: '1rem',
            borderBottom: '1px solid var(--gray-200)'
          }}
        >
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {menuItems.map(item => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    style={{ 
                      display: 'block',
                      padding: '0.75rem',
                      color: location.pathname === item.path ? 'var(--primary)' : 'var(--gray-800)',
                      textDecoration: 'none',
                      borderRadius: '0.25rem',
                      backgroundColor: location.pathname === item.path ? 'var(--gray-100)' : 'transparent'
                    }}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {user && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
                <button 
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                  }}
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ marginRight: '0.5rem' }}>🚪</span>
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Main content */}
      <div style={{ 
        display: 'flex', 
        flex: '1',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Sidebar (desktop only) */}
        <aside 
          className="sidebar hidden md:block"
          style={{ 
            width: '220px',
            backgroundColor: 'white',
            borderRight: '1px solid var(--gray-200)',
            padding: '1rem',
            marginTop: '1rem',
            borderRadius: '0.5rem',
            marginRight: '1rem',
            height: 'fit-content',
            position: 'sticky',
            top: '5rem'
          }}
        >
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {menuItems.map(item => (
                <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                  <Link 
                    to={item.path}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      color: location.pathname === item.path ? 'var(--primary)' : 'var(--gray-800)',
                      textDecoration: 'none',
                      borderRadius: '0.25rem',
                      backgroundColor: location.pathname === item.path ? 'var(--gray-100)' : 'transparent'
                    }}
                  >
                    <span style={{ marginRight: '0.5rem', width: '1.5rem', textAlign: 'center' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Page content */}
        <main style={{ flex: '1', padding: '1rem' }}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'white', 
        padding: '1rem',
        borderTop: '1px solid var(--gray-200)',
        marginTop: '2rem',
        textAlign: 'center',
        color: 'var(--gray-500)',
        fontSize: '0.875rem'
      }}>
        <p>&copy; {new Date().getFullYear()} Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;