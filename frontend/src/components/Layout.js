import React, { useContext, useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';

const Layout = ({ children }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };
  
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const navigateTo = (path) => {
    navigate(path);
    handleClose();
    handleMobileMenuClose();
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => navigateTo('/')}
            sx={{ mr: 2 }}
          >
            <CodeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('app.title')}
          </Typography>
          
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Desktop menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 2 }}>
            {isAuthenticated && (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => navigateTo('/')}
                  startIcon={<DashboardIcon />}
                >
                  {t('nav.dashboard')}
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigateTo('/courses')}
                  startIcon={<SchoolIcon />}
                >
                  {t('nav.courses')}
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigateTo('/assignments')}
                  startIcon={<AssignmentIcon />}
                >
                  {t('nav.assignments')}
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigateTo('/playground')}
                  startIcon={<CodeIcon />}
                >
                  {t('nav.playground')}
                </Button>
              </>
            )}
            
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user && user.username ? user.username.charAt(0).toUpperCase() : <PersonIcon />}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => navigateTo('/profile')}>
                    {t('common.profile')}
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    {t('common.logout')}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigateTo('/login')}>
                  {t('common.login')}
                </Button>
                <Button color="inherit" variant="outlined" onClick={() => navigateTo('/register')} sx={{ ml: 1 }}>
                  {t('common.register')}
                </Button>
              </>
            )}
          </Box>
          
          {/* Mobile menu icon */}
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Mobile menu */}
          <Menu
            id="mobile-menu"
            anchorEl={mobileMenuAnchor}
            keepMounted
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
          >
            {isAuthenticated && (
              <>
                <MenuItem onClick={() => navigateTo('/')}>
                  <DashboardIcon sx={{ mr: 1 }} />
                  {t('nav.dashboard')}
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/courses')}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  {t('nav.courses')}
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/assignments')}>
                  <AssignmentIcon sx={{ mr: 1 }} />
                  {t('nav.assignments')}
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/playground')}>
                  <CodeIcon sx={{ mr: 1 }} />
                  {t('nav.playground')}
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/profile')}>
                  <PersonIcon sx={{ mr: 1 }} />
                  {t('common.profile')}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  {t('common.logout')}
                </MenuItem>
              </>
            )}
            
            {!isAuthenticated && (
              <>
                <MenuItem onClick={() => navigateTo('/login')}>
                  {t('common.login')}
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/register')}>
                  {t('common.register')}
                </MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
      
      <Box component="footer" sx={{ p: 2, mt: 'auto', bgcolor: 'background.paper', borderTop: '1px solid #eaeaea' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; {new Date().getFullYear()} Online Coding Platform. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
