const { saveWhiteboardData } = require('./controllers/whiteboardController');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`Client joined room: ${roomId}`);
    });

    socket.on('draw', async (data) => {
      socket.to(data.roomId).emit('draw', data);
      await saveWhiteboardData(data.roomId, data);
    });

    socket.on('send-message', (data) => {
      io.to(data.roomId).emit('receive-message', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};