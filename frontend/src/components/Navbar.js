import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';
import { UserContext } from '../contexts/UserContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          component={RouterLink}
          to="/"
        >
          <CodeIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('app_name')}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={RouterLink} to="/courses">
            {t('navigation.courses')}
          </Button>
          
          <Button color="inherit" component={RouterLink} to="/playground">
            {t('navigation.playground')}
          </Button>
          
          {/* Thêm LanguageSwitcher */}
          <LanguageSwitcher />
          
          {isAuthenticated ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user?.username ? (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                ) : (
                  <PersonIcon />
                )}
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
                <MenuItem disabled>
                  <Typography variant="body2" color="textSecondary">
                    {user?.fullName || user?.username}
                  </Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="body2" color="textSecondary">
                    {user?.role === 'student' ? t('profile.student') : t('profile.instructor')}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleProfile}>{t('navigation.profile')}</MenuItem>
                <MenuItem onClick={handleLogout}>{t('navigation.logout')}</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                {t('navigation.login')}
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                {t('navigation.register')}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
