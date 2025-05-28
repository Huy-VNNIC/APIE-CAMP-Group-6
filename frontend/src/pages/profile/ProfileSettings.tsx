import React, { useEffect, useState } from 'react';
import studentApi from '../../api/student';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

interface Profile {
  id: number;
  name: string;
  email: string;
  login: string;
  created_at: string;
  dashboard_data: {
    preferences?: {
      theme?: string;
      language?: string;
      emailNotifications?: boolean;
      editor?: {
        fontSize?: number;
        theme?: string;
      };
    };
  };
}

const ProfileSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    theme: 'light',
    language: 'en',
    emailNotifications: true,
    editorFontSize: 14,
    editorTheme: 'vs-dark'
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await studentApi.getProfile();
        
        if (response.success) {
          setProfile(response.data);
          
          // Initialize form data
          setFormData({
            name: response.data.name || '',
            email: response.data.email || '',
            theme: response.data.dashboard_data?.preferences?.theme || 'light',
            language: response.data.dashboard_data?.preferences?.language || 'en',
            emailNotifications: response.data.dashboard_data?.preferences?.emailNotifications !== false,
            editorFontSize: response.data.dashboard_data?.preferences?.editor?.fontSize || 14,
            editorTheme: response.data.dashboard_data?.preferences?.editor?.theme || 'vs-dark'
          });
        } else {
          setError(response.message || 'Failed to load profile');
        }
      } catch (err: any) {
        console.error('Profile error:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await studentApi.updateProfile({
        name: formData.name,
        email: formData.email
      });
      
      if (response.success) {
        setSuccess('Profile updated successfully');
        // Update cached profile
        if (profile) {
          setProfile({
            ...profile,
            name: formData.name,
            email: formData.email
          });
        }
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Update profile error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };
  
  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const preferences = {
        theme: formData.theme,
        language: formData.language,
        emailNotifications: formData.emailNotifications,
        editor: {
          fontSize: Number(formData.editorFontSize),
          theme: formData.editorTheme
        }
      };
      
      const response = await studentApi.updatePreferences(preferences);
      
      if (response.success) {
        setSuccess('Preferences updated successfully');
        // Update cached profile
        if (profile) {
          setProfile({
            ...profile,
            dashboard_data: {
              ...profile.dashboard_data,
              preferences
            }
          });
        }
        
        // Apply theme if changed
        document.documentElement.className = formData.theme;
      } else {
        setError(response.message || 'Failed to update preferences');
      }
    } catch (err: any) {
      console.error('Update preferences error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };
  
  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Loader />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (error && !profile) {
    return (
      <div className="container">
        <Alert type="error" message={error} />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container">
        <Alert type="info" message="Profile not found" />
      </div>
    );
  }
  
  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="section-title">Profile Settings</h1>
        <p className="welcome-text">Manage your account and preferences</p>
      </div>
      
      <div className="card">
        <div className="tabs" style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)' }}>
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            style={{ 
              padding: '1rem', 
              borderBottom: activeTab === 'profile' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'profile' ? 'var(--primary)' : 'var(--gray-600)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'profile' ? 'bold' : 'normal'
            }}
          >
            Profile Information
          </button>
          <button
            className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
            style={{ 
              padding: '1rem', 
              borderBottom: activeTab === 'preferences' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'preferences' ? 'var(--primary)' : 'var(--gray-600)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'preferences' ? 'bold' : 'normal'
            }}
          >
            Preferences
          </button>
        </div>
        
        <div className="tab-content" style={{ padding: '1.5rem' }}>
          {/* Success alert */}
          {success && (
            <Alert type="success" message={success} onClose={() => setSuccess(null)} />
          )}
          
          {/* Error alert */}
          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}
          
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <div className="form-section" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Basic Information</h2>
                
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
              </div>
              
              <div className="form-section" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Account Information</h2>
                
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="login" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Login ID
                  </label>
                  <input
                    type="text"
                    id="login"
                    value={profile.login}
                    readOnly
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '0.375rem',
                      backgroundColor: 'var(--gray-100)'
                    }}
                  />
                  <small style={{ color: 'var(--gray-500)' }}>Login ID cannot be changed</small>
                </div>
                
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="created" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Account Created
                  </label>
                  <input
                    type="text"
                    id="created"
                    value={formatDate(profile.created_at)}
                    readOnly
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '0.375rem',
                      backgroundColor: 'var(--gray-100)'
                    }}
                  />
                </div>
              </div>
              
              <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => window.location.href = '/dashboard'}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'preferences' && (
            <form onSubmit={handlePreferencesSubmit}>
              <div className="form-section" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Interface Preferences</h2>
                
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="theme" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '0.375rem'
                    }}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">System Default</option>
                  </select>
                </div>
                
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="language" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Interface Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '0.375rem'
                    }}
                  >
                    <option value="en">English</option>
                    <option value="vi">Vietnamese</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
              
              <div className="form-section" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Editor Preferences</h2>
                
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="editorFontSize" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Font Size
                  </label>
                  <select
                    id="editorFontSize"
                    name="editorFontSize"
                    value={formData.editorFontSize}
                    onChange={handleChange}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '0.375rem'
                    }}
                  >
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                    <option value="20">20px</option>
                  </select>
                </div>
                
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="editorTheme" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Editor Theme
                  </label>
                  <select
                    id="editorTheme"
                    name="editorTheme"
                    value={formData.editorTheme}
                    onChange={handleChange}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '0.375rem'
                    }}
                  >
                    <option value="vs-dark">Dark (VS Dark)</option>
                    <option value="vs-light">Light (VS Light)</option>
                    <option value="hc-black">High Contrast Dark</option>
                  </select>
                </div>
              </div>
              
              <div className="form-section" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Notification Preferences</h2>
                
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <label htmlFor="emailNotifications" style={{ fontWeight: 500 }}>
                      Receive email notifications
                    </label>
                  </div>
                  <small style={{ display: 'block', marginTop: '0.25rem', color: 'var(--gray-500)' }}>
                    Get notified about course updates, new content, and platform announcements
                  </small>
                </div>
              </div>
              
              <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => window.location.href = '/dashboard'}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      <div className="card danger-zone" style={{ marginTop: '2rem', borderLeft: '4px solid var(--danger)' }}>
        <div style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--danger)' }}>Account Actions</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Log out of your account</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>End your current session on this device</p>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="btn btn-danger"
              style={{ 
                backgroundColor: 'var(--danger)', 
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;