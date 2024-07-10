import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Register from './components/Register';
import Whiteboard from './components/Whiteboard';
import WhiteboardList from './components/WhiteboardList';
import Home from './components/Home';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="home"
                  sx={{ mr: 2 }}
                  href="/"
                >
                  <HomeIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Collaborative Whiteboard
                </Typography>
                <Button color="inherit" href="/login">Login</Button>
                <Button color="inherit" href="/register">Register</Button>
              </Toolbar>
            </AppBar>
          </Box>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/whiteboard/:id" element={
              <PrivateRoute>
                <Whiteboard />
              </PrivateRoute>
            } />
            <Route path="/whiteboards" element={
              <PrivateRoute>
                <WhiteboardList />
              </PrivateRoute>
            } />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;