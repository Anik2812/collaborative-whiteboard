import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
          Welcome to Collaborative Whiteboard
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Create or join a whiteboard room to start collaborating with others in real-time.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" component={Link} to="/whiteboard/new" sx={{ mr: 2 }}>
            Create New Whiteboard
          </Button>
          <Button variant="outlined" component={Link} to="/login">
            Join Existing Whiteboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;