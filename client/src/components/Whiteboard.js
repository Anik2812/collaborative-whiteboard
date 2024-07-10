import React, { useRef, useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Box, Button, Slider, Typography, Paper, TextField, Grow } from '@mui/material';
import { SketchPicker } from 'react-color';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Whiteboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [tool, setTool] = useState('pen');
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [whiteboardName, setWhiteboardName] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');

    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join-room', id);

    axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token');

    const fetchWhiteboardData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/whiteboard/${id}`);
        const whiteboardData = res.data.data;
        setHistory(whiteboardData);
        setCurrentStep(whiteboardData.length - 1);
        setWhiteboardName(res.data.name);
        if (canvas) {
          redrawCanvas(whiteboardData);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Token expired or not valid. Please log in again.');
          navigate('/login');
        } else {
          console.error('Error fetching whiteboard data:', error);
        }
      }
    };

    fetchWhiteboardData();

    socketRef.current.on('draw', (data) => {
      drawOnCanvas(context, data);
      addToHistory(data);
    });

    socketRef.current.on('receive-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    let drawing = false;
    let lastX = 0;
    let lastY = 0;

    const draw = (e) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const drawData = { tool, color, brushSize, x0: lastX, y0: lastY, x1: x, y1: y };
      drawOnCanvas(context, drawData);
      socketRef.current.emit('draw', { roomId: id, ...drawData });
      addToHistory(drawData);

      lastX = x;
      lastY = y;
    };

    const handleMouseDown = (e) => {
      drawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    };

    const handleMouseUp = () => {
      drawing = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseUp);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseUp);
    };
  }, [id, user, navigate]);

  const drawOnCanvas = (context, data) => {
    const { tool, color, brushSize, x0, y0, x1, y1 } = data;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.stroke();
    context.closePath();
  };

  const addToHistory = (drawData) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, currentStep + 1);
      newHistory.push(drawData);
      setCurrentStep(newHistory.length - 1);
      return newHistory;
    });
  };

  const undo = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => {
        const newStep = prevStep - 1;
        redrawCanvas(history.slice(0, newStep + 1));
        return newStep;
      });
    }
  };

  const redo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(prevStep => {
        const newStep = prevStep + 1;
        redrawCanvas(history.slice(0, newStep + 1));
        return newStep;
      });
    }
  };

  const redrawCanvas = (steps) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    steps.forEach(data => drawOnCanvas(context, data));
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = { text: newMessage, sender: user.username, timestamp: new Date().toLocaleTimeString() };
      socketRef.current.emit('send-message', { roomId: id, ...messageData });
      setMessages(prevMessages => [...prevMessages, messageData]);
      setNewMessage('');
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setCurrentStep(-1);
    socketRef.current.emit('clear-canvas', { roomId: id });
  };

  const saveWhiteboard = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/whiteboard/${id}`, { data: history }, {
        headers: { 'x-auth-token': token }
      });
      alert('Whiteboard saved successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Token expired or not valid. Please log in again.');
        navigate('/login');
      } else {
        console.error('Error saving whiteboard:', error);
        alert('Failed to save whiteboard. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Whiteboard: {whiteboardName}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant={tool === 'pen' ? 'contained' : 'outlined'} onClick={() => setTool('pen')}>
          Pen
        </Button>
        <Button variant={tool === 'eraser' ? 'contained' : 'outlined'} onClick={() => setTool('eraser')}>
          Eraser
        </Button>
        <Button startIcon={<UndoIcon />} onClick={undo} disabled={currentStep <= 0}>
          Undo
        </Button>
        <Button startIcon={<RedoIcon />} onClick={redo} disabled={currentStep >= history.length - 1}>
          Redo
        </Button>
        <Button startIcon={<ChatIcon />} onClick={() => setShowChat(!showChat)}>
          Chat
        </Button>
        <Button startIcon={<DeleteIcon />} onClick={clearCanvas} color="error">
          Clear
        </Button>
        <Button startIcon={<SaveIcon />} onClick={saveWhiteboard} color="success">
          Save
        </Button>
      </Box>
      {isMounted && (
        <Grow in={isMounted}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ p: 1 }}>
              <Typography gutterBottom>Brush Size</Typography>
              <Slider
                value={brushSize}
                onChange={(e, newValue) => setBrushSize(newValue)}
                aria-labelledby="brush-size-slider"
                valueLabelDisplay="auto"
                min={1}
                max={20}
              />
            </Paper>
            <SketchPicker
              color={color}
              onChangeComplete={(newColor) => setColor(newColor.hex)}
              disableAlpha
            />
          </Box>
        </Grow>
      )}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid #000000', backgroundColor: '#ffffff' }}
      />
      <Box sx={{ mt: 2, width: '100%', maxWidth: 800 }}>
        {showChat && (
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Chat</Typography>
            <Box sx={{ height: 200, overflowY: 'auto', mb: 2 }}>
              {messages.map((msg, index) => (
                <Typography key={index} variant="body2">
                  <strong>{msg.sender}:</strong> {msg.text} <em>{msg.timestamp}</em>
                </Typography>
              ))}
            </Box>
            <form onSubmit={sendMessage}>
              <TextField
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
                Send
              </Button>
            </form>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Whiteboard;