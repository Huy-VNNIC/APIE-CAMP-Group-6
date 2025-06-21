import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  MenuItem, 
  Container, 
  Avatar, 
  Button, 
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  useTheme
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AnalyticsIcon from '@mui/icons-material/BarChart';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CodeIcon from '@mui/icons-material/Code';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FeedbackIcon from '@mui/icons-material/Feedback';

const StudentLayout = ({ children, notificationCount = 0 }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  // User profile data - would come from authentication context in a real app
  const user = {
    name: 'Demo Student',
    avatar: 'DS',
    email: 'demo.student@example.com'
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleLogout = () => {
    // In a real app, this would handle logout
    handleCloseUserMenu();
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  // Navigation menu items
  const menuItems = [
    {
      text: t('navigation.dashboard'),
      path: '/student/dashboard',
      icon: <DashboardIcon />
    },
    {
      text: t('navigation.courses'),
      path: '/student/courses',
      icon: <MenuBookIcon />
    },
    {
      text: t('navigation.assignments'),
      path: '/student/assignments',
      icon: <AssignmentIcon />
    },
    {
      text: t('navigation.codeExercises'),
      path: '/student/code',
      icon: <CodeIcon />
    },
    {
      text: t('navigation.analytics'),
      path: '/student/analytics',
      icon: <AnalyticsIcon />
    },
    {
      text: t('navigation.collaboration'),
      path: '/student/collaboration',
      icon: <GroupsIcon />
    },
    {
      text: t('navigation.feedback'),
      path: '/student/feedback',
      icon: <FeedbackIcon />
    }
  ];
  
  const drawer = (
    <div>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          p: 2,
          backgroundColor: 'primary.main',
          color: 'white'
        }}
      >
        <Avatar 
          alt={user.name} 
          src="/static/images/avatar/1.jpg" 
          sx={{ width: 64, height: 64, mb: 1, bgcolor: 'white', color: 'primary.main' }}
        >
          {user.avatar}
        </Avatar>
        <Typography variant="h6" noWrap component="div">
          {user.name}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          {t('profile.student')}
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                '& .MuiListItemIcon-root': {
                  color: 'primary.main'
                }
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            <ListItemIcon>
              {item.text === t('navigation.notifications') ? (
                <Badge badgeContent={notificationCount} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const drawerWidth = 240;
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile menu icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo */}
            <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/student/dashboard"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {t('app.learningPlatform')}
            </Typography>

            {/* Mobile logo */}
            <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/student/dashboard"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {t('app.shortName')}
            </Typography>
            
            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Notification Icon */}
            <Box sx={{ display: 'flex' }}>
              <IconButton 
                size="large" 
                color="inherit"
                onClick={() => navigate('/student/notifications')}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              {/* User menu */}
              <Tooltip title={t('profile.settings')}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                  <Avatar alt={user.name} src="/static/images/avatar/2.jpg">
                    {user.avatar}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => { navigate('/student/profile'); handleCloseUserMenu(); }}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">{t('profile.myProfile')}</Typography>
                </MenuItem>
                <MenuItem onClick={() => { navigate('/student/settings'); handleCloseUserMenu(); }}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">{t('profile.settings')}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">{t('profile.logout')}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Drawer for navigation */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px' // Height of AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default StudentLayout;
