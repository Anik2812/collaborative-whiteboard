import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import './Whiteboard.css';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const { roomId } = useParams();
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set up WebSocket connection
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join-room', roomId);

    socketRef.current.on('draw', (data) => {
      drawLine(context, data.x0, data.y0, data.x1, data.y1, data.color, data.brushSize);
    });

    // Drawing functionality
    let drawing = false;
    let lastX = 0;
    let lastY = 0;

    const draw = (e) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      drawLine(context, lastX, lastY, x, y, color, brushSize);
      socketRef.current.emit('draw', { roomId, x0: lastX, y0: lastY, x1: x, y1: y, color, brushSize });
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
  }, [roomId, color, brushSize]);

  const drawLine = (context, x0, y0, x1, y1, color, brushSize) => {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.stroke();
    context.closePath();
  };

  return (
    <div className="whiteboard-container">
      <h2>Whiteboard: Room {roomId}</h2>
      <div className="whiteboard-controls">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
        />
      </div>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="whiteboard-canvas"
      />
    </div>
  );
};

export default Whiteboard;