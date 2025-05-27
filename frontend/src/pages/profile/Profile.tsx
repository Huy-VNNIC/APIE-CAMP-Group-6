import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { getProfile, updateProfile, updatePreferences } from '../../api/student';
import { changePassword } from '../../api/auth';
import { StudentProfile } from '../../types/student.types';
import { User } from '../../types/auth.types';
import toast from 'react-hot-toast';
import {
  UserIcon,
  KeyIcon,
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  BellIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(user);
  const [profileData, setProfileData] = useState<StudentProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('profile');
  
  // Form states
  const [name, setName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  
  // Theme preference
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  
  // Editor preferences
  const [editorFontSize, setEditorFontSize] = useState<number>(14);
  const [editorTabSize, setEditorTabSize] = useState<number>(2);
  const [autoSave, setAutoSave] = useState<boolean>(true);
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [resourceNotifications, setResourceNotifications] = useState<boolean>(true);
  const [achievementNotifications, setAchievementNotifications] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // In a real implementation, uncomment this:
        // const data = await getProfile();
        // setProfileData(data);
        
        // Mock data for now
        const mockProfile: StudentProfile = {
          user_id: user?.id || 0,
          name: user?.name || '',
          email: user?.email || '',
          verified: true,
          dashboard_data: {
            points: 1250,
            level: 5,
            completed_resources: 12,
            badges: ['Fast Learner', 'Code Ninja', 'Algorithm Master'],
            preferences: {
              theme: 'dark',
              editor_font_size: 14,
              editor_tab_size: 2,
              auto_save: true
            }
          }
        };
        
        setProfileData(mockProfile);
        
        // Update form states
        if (user) {
          setName(user.name);
          setEmail(user.email);
        }
        
        // Get theme from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') setTheme('dark');
        else if (savedTheme === 'light') setTheme('light');
        else setTheme('system');
        
        // Set editor preferences
        if (mockProfile.dashboard_data.preferences) {
          const prefs = mockProfile.dashboard_data.preferences;
          setEditorFontSize(prefs.editor_font_size);
          setEditorTabSize(prefs.editor_tab_size);
          setAutoSave(prefs.auto_save);
        }
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData) return;
    
    try {
      setLoading(true);
      // In a real implementation, uncomment this:
      // await updateProfile({ name });
      
      // Update local state
      setUserData({
        ...userData,
        name
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      // Error handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setChangingPassword(true);
      // In a real implementation, uncomment this:
      // await changePassword(currentPassword, newPassword);
      
      // Clear form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('Password changed successfully');
    } catch (error) {
      // Error handled by axios interceptor
    } finally {
      setChangingPassword(false);
    }
  };

  const handleThemeChange = (selectedTheme: 'light' | 'dark' | 'system') => {
    setTheme(selectedTheme);
    
    if (selectedTheme === 'system') {
      localStorage.removeItem('theme');
      
      // Apply theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      localStorage.setItem('theme', selectedTheme);
      
      if (selectedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Save preference to API
    updatePreferences({ theme: selectedTheme })
      .then(() => toast.success(`Theme set to ${selectedTheme}`))
      .catch(() => {/* Error handled by axios interceptor */});
  };
  
  const saveEditorPreferences = async () => {
    try {
      // In a real implementation, uncomment this:
      // await updatePreferences({
      //   editor_font_size: editorFontSize,
      //   editor_tab_size: editorTabSize,
      //   auto_save: autoSave
      // });
      
      toast.success('Editor preferences saved');
    } catch (error) {
      // Error handled by axios interceptor
    }
  };
  
  const saveNotificationPreferences = async () => {
    try {
      // In a real implementation, uncomment this:
      // await updatePreferences({
      //   email_notifications: emailNotifications,
      //   resource_notifications: resourceNotifications,
      //   achievement_notifications: achievementNotifications
      // });
      
      toast.success('Notification preferences saved');
    } catch (error) {
      // Error handled by axios interceptor
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Personal Information</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    disabled
                    className="form-input bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    placeholder="your.email@example.com"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email address cannot be changed
                  </p>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
      case 'security':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="form-input"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`form-input ${passwordError ? 'ring-red-500 border-red-500' : ''}`}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`form-input ${passwordError ? 'ring-red-500 border-red-500' : ''}`}
                    placeholder="••••••••"
                    required
                  />
                  {passwordError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{passwordError}</p>
                  )}
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="btn-primary"
                  >
                    {changingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            </form>
            
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Login Sessions</h2>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Current Session</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Started at: {new Date().toLocaleString()}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>Active
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <button className="text-sm text-red-600 dark:text-red-500 font-medium hover:underline">
                  Log out of all other sessions
                </button>
              </div>
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Appearance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleThemeChange('light')}
                >
                  <div className="w-20 h-12 mb-3 rounded-md bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gray-800"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Light</span>
                </div>
                <div
                  className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleThemeChange('dark')}
                >
                  <div className="w-20 h-12 mb-3 rounded-md bg-gray-800 border border-gray-700 shadow-sm flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Dark</span>
                </div>
                <div
                  className={`p-4 border rounded-lg flex flex-col items-center cursor-pointer transition-all ${
                    theme === 'system'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleThemeChange('system')}
                >
                  <div className="w-20 h-12 mb-3 rounded-md bg-gradient-to-r from-white to-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">System</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Editor Preferences</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="editorFontSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Font Size: {editorFontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={editorFontSize}
                    onChange={(e) => setEditorFontSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label htmlFor="editorTabSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tab Size: {editorTabSize} spaces
                  </label>
                  <select
                    id="editorTabSize"
                    value={editorTabSize}
                    onChange={(e) => setEditorTabSize(parseInt(e.target.value))}
                    className="form-input"
                  >
                    <option value="2">2 spaces</option>
                    <option value="4">4 spaces</option>
                    <option value="8">8 spaces</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center">
                    <input
                      id="autoSave"
                      type="checkbox"
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:border-gray-600"
                    />
                    <label htmlFor="autoSave" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Auto-save code as you type
                    </label>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={saveEditorPreferences}
                    className="btn-primary"
                  >
                    Save Editor Preferences
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailNotifications"
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:border-gray-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailNotifications" className="font-medium text-gray-700 dark:text-gray-300">
                      Email Notifications
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Receive email notifications about your account activity
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="resourceNotifications"
                      type="checkbox"
                      checked={resourceNotifications}
                      onChange={(e) => setResourceNotifications(e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:border-gray-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="resourceNotifications" className="font-medium text-gray-700 dark:text-gray-300">
                      New Resources
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Get notified when new learning resources are added
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="achievementNotifications"
                      type="checkbox"
                      checked={achievementNotifications}
                      onChange={(e) => setAchievementNotifications(e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:border-gray-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="achievementNotifications" className="font-medium text-gray-700 dark:text-gray-300">
                      Achievement Notifications
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Get notified when you earn badges or level up
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={saveNotificationPreferences}
                    className="btn-primary"
                  >
                    Save Notification Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading && !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white text-4xl font-bold">
                {userData?.name.charAt(0)}
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{userData?.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{userData?.email}</p>
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                {userData?.role.charAt(0).toUpperCase() + userData?.role.slice(1)}
              </div>
            </div>
            
            <div className="pt-6 space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <UserIcon className="mr-2 h-5 w-5" />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'security'
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <ShieldCheckIcon className="mr-2 h-5 w-5" />
                Security & Password
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'preferences'
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <AdjustmentsHorizontalIcon className="mr-2 h-5 w-5" />
                Preferences
              </button>
            </div>
            
            {/* Account Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Account Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Level</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {profileData?.dashboard_data.level || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Points</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {profileData?.dashboard_data.points || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Completed Resources</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {profileData?.dashboard_data.completed_resources || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Badges</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {profileData?.dashboard_data.badges?.length || 0}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Account Verification Status */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className={`flex items-center ${
                profileData?.verified 
                  ? 'text-green-700 dark:text-green-400' 
                  : 'text-yellow-700 dark:text-yellow-400'
              }`}>
                {profileData?.verified ? (
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                ) : (
                  <XCircleIcon className="h-5 w-5 mr-2" />
                )}
                <span className="text-sm font-medium">
                  {profileData?.verified ? 'Account Verified' : 'Account Not Verified'}
                </span>
              </div>
              {!profileData?.verified && (
                <button className="mt-2 text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline">
                  Verify your account
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;