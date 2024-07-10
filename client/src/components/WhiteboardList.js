import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import axios from 'axios';

const WhiteboardList = () => {
  const [whiteboards, setWhiteboards] = useState([]);

  useEffect(() => {
    const fetchWhiteboards = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/whiteboard');
        setWhiteboards(res.data);
      } catch (error) {
        console.error('Error fetching whiteboards:', error);
      }
    };
    fetchWhiteboards();
  }, []);

  const createNewWhiteboard = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/whiteboard', { name: 'New Whiteboard' });
      setWhiteboards([...whiteboards, res.data]);
    } catch (error) {
      console.error('Error creating whiteboard:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Whiteboards
        </Typography>
        <Button variant="contained" onClick={createNewWhiteboard} sx={{ mb: 2 }}>
          Create New Whiteboard
        </Button>
        <List>
          {whiteboards.map((whiteboard) => (
            <ListItem
              key={whiteboard._id}
              component={RouterLink}
              to={`/whiteboard/${whiteboard._id}`}
              button
            >
              <ListItemText primary={whiteboard.name} secondary={`Created: ${new Date(whiteboard.createdAt).toLocaleString()}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default WhiteboardList;