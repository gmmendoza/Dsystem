const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Simulación de notificaciones periódicas
  const notifications = [
    { titulo: 'Tarea Subida', mensaje: 'El alumno Juan Pérez subió la tarea de Álgebra.' },
    { titulo: 'Examen Mañana', mensaje: 'Recuerda que mañana tienes el examen de Geometría.', tipo: 'warning' },
    { titulo: 'Nuevo Mensaje', mensaje: 'Has recibido un mensaje de la dirección.' }
  ];

  let index = 0;
  const interval = setInterval(() => {
    const notif = notifications[index % notifications.length];
    if (notif.tipo === 'warning') {
      socket.emit('examen-manana', notif);
    } else {
      socket.emit('nueva-notificacion', notif);
    }
    index++;
  }, 15000); // Enviar una notificación cada 15 segundos para demostración

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor de notificaciones en puerto ${PORT}`);
});
