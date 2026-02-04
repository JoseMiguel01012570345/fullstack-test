import React from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 240;

export default function Layout({ children }) {
  const history = useHistory();
  const location = useLocation();
  const { username, logout } = useAuth();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const menuItems = [
    { text: 'INICIO', path: '/home', icon: <HomeIcon /> },
    { text: 'Cuentas clientes', path: '/clientes', icon: <PeopleIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#000000',
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            COMPANIA PRUEBA
          </Typography>
          {username && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              {username}
            </Typography>
          )}
          <Button
            sx={{
              minWidth: 55,
              minHeight: 55,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 0,
              border: '2px solid black',
              color: 'black',
              fontFamily: 'inherit',
              fontWeight: 'bold',
              background: '#fff'
            }}
            variant='contained'
            color="inherit"
            startIcon={<LogoutIcon sx={{ color: "black" }} />}
            onClick={handleLogout}
          >
          </Button>
        </Toolbar>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 5, borderColor: '#2196f3' }} />
      </Box>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
            <Avatar
              sx={{
                mt: 2,
                width: 140,
                height: 140,
                bgcolor: 'grey.300',
                color: 'white',
                fontSize: 40,
                mb: 1,
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 120 }} />
            </Avatar>
          </Box>
          {username && (
            <Typography
              variant="body2"
              sx={{
                px: 2,
                py: 1,
                fontSize: '15px',
                color: 'black',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              {username}
            </Typography>
          )}
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
          </Box>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h2>MENÚ</h2>
            </div>
          <Box sx={{ width: '100%', }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
          </Box>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.path}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 7 }}>
        {children}
      </Box>
    </Box>
  );
}
