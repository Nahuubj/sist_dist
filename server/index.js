import express from 'express';
import pg from 'pg';
import cors from "cors";
import net from 'net';

const app = express();
const apiPort = 3000;
const tcpPort = 4000;

// Habilitar CORS
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PATCH"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'qr',
  password: 'hola123.',
  port: 5432,
});

const clientesConectados = [];
const clientesDevolver = [];

const server = net.createServer((socket) => {
  console.log('Cliente conectado:', socket.remoteAddress);

  clientesConectados.push(socket);

  socket.on('data', (data) => {
    data = JSON.parse( data.toString());
    const index = clientesDevolver.findIndex(x => data.id == x.data.id);
    if (index >= 0) {
      console.log("Ya existía y lo estoy modificando");
      clientesDevolver[index] = { data, socket };
    } else {
      console.log("No existía y lo estoy agregando");
      clientesDevolver.push({ data, socket });
    }
  });

  socket.on('end', () => {
    console.log('Cliente desconectado');
    const index = clientesConectados.indexOf(socket);
    if (index !== -1) {
      clientesConectados.splice(index, 1);
    }
    const index2 = clientesDevolver.findIndex(x => x.socket === socket);
    if (index2 >= 0) {
      console.log("Borrando");
      clientesDevolver.splice(index2, 1);
    }
  });

  socket.on('error', (err) => {
    console.error(`Error en la conexión con el cliente: ${err.message}`);
    const index = clientesConectados.indexOf(socket);
    if (index !== -1) {
      clientesConectados.splice(index, 1);
    }
    const index2 = clientesDevolver.findIndex(x => x.socket === socket);
    if (index2 >= 0) {
      console.log("Borrando");
      clientesDevolver.splice(index2, 1);
    }
  });
});

// API
app.get("/getDisks", (req, res) => {
  res.json(clientesDevolver);
});

app.listen(apiPort, () => {
  console.log(`API corriendo en http://localhost:${apiPort}`);
});

server.listen(tcpPort, () => {
  console.log(`Servidor TCP corriendo en puerto ${tcpPort}`);
});
