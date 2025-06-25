import React, { useState, useContext } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
// import { useTranslation } from 'react-i18next'; // Temporarily disabled
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
  Tooltip,
  Divider,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  useTheme
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageIcon from '@mui/icons-material/Language';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import VideocamIcon from '@mui/icons-material/Videocam';
import CampaignIcon from '@mui/icons-material/Campaign';

const drawerWidth = 240;

const Layout = ({ children }) => {
  // const { t } = useTranslation(); // Temporarily disabled
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(UserContext);
  
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElLang, setAnchorElLang] = useState(null);
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleOpenLangMenu = (event) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };
  
  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  
  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/login');
  };
  
  const handleLanguageChange = (lang) => {
    // Future implementation - change language
    handleCloseLangMenu();
  };
  
  // Check user roles
  const isInstructor = () => {
    return user && (user.role === 'instructor' || user.role === 'admin');
  };
  
  const isMarketing = () => {
    return user && (user.role === 'marketing' || user.role === 'admin');
  };
  
  const pages = [
    // For all authenticated users
    { name: 'Dashboard', path: '/', icon: <DashboardIcon />, auth: true },
    { name: 'Courses', path: '/courses', icon: <SchoolIcon />, auth: true },
    { name: 'Assignments', path: '/assignments', icon: <AssignmentIcon />, auth: true },
    { name: 'Playground', path: '/playground', icon: <CodeIcon />, auth: true },
    { name: 'Live Sessions', path: '/live-sessions', icon: <VideocamIcon />, auth: true },
    
    // For instructor role only
    { 
      name: 'Instructor Dashboard', 
      path: '/instructor', 
      icon: <SupervisorAccountIcon />, 
      auth: true, 
      instructorOnly: true 
    },
    
    // For marketing role only
    { 
      name: 'Marketing Dashboard', 
      path: '/marketing', 
      icon: <CampaignIcon />, 
      auth: true, 
      marketingOnly: true 
    }
  ];
  
  const filteredPages = pages.filter(page => {
    if (!page.auth) return true;
    if (isAuthenticated) {
      // If page is instructor only, check if user is instructor
      if (page.instructorOnly) {
        return isInstructor();
      }
      // If page is marketing only, check if user is marketing
      if (page.marketingOnly) {
        return isMarketing();
      }
      return true;
    }
    return false;
  });
  
  const drawerContent = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Coding Platform
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {filteredPages.map((page) => (
          <ListItem key={page.path} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={page.path}
              selected={location.pathname === page.path}
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {page.icon}
              </ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          width: { md: `calc(100% - ${isAuthenticated ? drawerWidth : 0}px)` },
          ml: { md: isAuthenticated ? `${drawerWidth}px` : 0 }
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isAuthenticated && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Coding Platform
            </Typography>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Box sx={{ display: 'flex' }}>
              {/* Language selector */}
              <Tooltip title="Change language">
                <IconButton onClick={handleOpenLangMenu} sx={{ p: 0, mr: 2 }}>
                  <LanguageIcon />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-language"
                anchorEl={anchorElLang}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElLang)}
                onClose={handleCloseLangMenu}
              >
                <MenuItem onClick={() => handleLanguageChange('vi')}>
                  <Typography textAlign="center">Tiếng Việt</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleLanguageChange('en')}>
                  <Typography textAlign="center">English</Typography>
                </MenuItem>
              </Menu>
            
              {isAuthenticated ? (
                <>
                  <Tooltip title="User settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt={user?.username || 'User'}>
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
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
                    <MenuItem onClick={() => {
                      handleCloseUserMenu();
                      navigate('/profile');
                    }}>
                      <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    
                    <Divider />
                    
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex' }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{ color: 'white', mr: 1 }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'white' }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {isAuthenticated && (
        <>
          {/* Desktop drawer - permanent */}
          <Drawer
            variant="permanent"
            open
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
          >
            <Toolbar />
            {drawerContent}
          </Drawer>
          
          {/* Mobile drawer - temporary */}
          <Drawer
            variant="temporary"
            open={mobileDrawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </>
      )}
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: isAuthenticated ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: isAuthenticated ? `${drawerWidth}px` : 0 },
          pt: { xs: 8, md: 10 } // Add padding top to account for app bar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
