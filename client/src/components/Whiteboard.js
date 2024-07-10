import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { Box, Button, Slider, Typography, Paper, TextField } from '@mui/material';
import { SketchPicker } from 'react-color';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';

const Whiteboard = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join-room', id);

    const fetchWhiteboardData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/whiteboard/${id}`);
        const whiteboardData = res.data.data;
        setHistory(whiteboardData);
        setCurrentStep(whiteboardData.length - 1);
        redrawCanvas(whiteboardData);
      } catch (error) {
        console.error('Error fetching whiteboard data:', error);
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

    canvas.addEventListener('mousedown', (e) => {
      drawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    });
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mouseout', () => drawing = false);

    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

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
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(drawData);
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const undo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      redrawCanvas(history.slice(0, currentStep));
    }
  };

  const redo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
      redrawCanvas(history.slice(0, currentStep + 2));
    }
  };

  const redrawCanvas = (steps) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    steps.forEach(data => drawOnCanvas(context, data));
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = { text: newMessage, sender: 'You', timestamp: new Date().toLocaleTimeString() };
      socketRef.current.emit('send-message', { roomId: id, ...messageData });
      setMessages([...messages, messageData]);
      setNewMessage('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Whiteboard: {id}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
        <SketchPicker color={color} onChange={(color) => setColor(color.hex)} />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          style={{ border: '1px solid #000' }}
        />
        {showChat && (
          <Paper elevation={3} sx={{ p: 2, width: 300, height: 600, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>Chat</Typography>
            <Box sx={{ height: 500, overflowY: 'auto', mb: 2 }}>
              {messages.map((message, index) => (
                <Typography key={index} variant="body2">
                  <strong>{message.sender}:</strong> {message.text} <small>({message.timestamp})</small>
                </Typography>
              ))}
            </Box>
            <form onSubmit={sendMessage}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
            </form>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Whiteboard;