const { Server } = require('socket.io');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // For development
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // Send a welcome notification
    socket.emit('NEW_NOTIFICATION', {
      title: 'Connected to DevOpsHub',
      message: 'Realtime telemetry is active.',
      type: 'info',
      timestamp: new Date()
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}

function broadcastNotification(title, message, type = 'info') {
  if (io) {
    io.emit('NEW_NOTIFICATION', {
      title,
      message,
      type,
      timestamp: new Date()
    });
  }
}

module.exports = {
  initSocket,
  getIO,
  broadcastNotification
};
