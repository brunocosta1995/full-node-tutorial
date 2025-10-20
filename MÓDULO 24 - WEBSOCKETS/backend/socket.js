// socket.js
const { Server } = require('socket.io');

let io;

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: 'http://localhost:3000', // URL do seu app React
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    // io.on('connection', (socket) => {
    //   console.log('Cliente conectado:', socket.id);

    //   socket.on('disconnect', (reason) => {
    //     console.log('Cliente desconectado:', reason);
    //   });
    // });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error('Socket.io não inicializado!');
    }
    return io;
  }
};
