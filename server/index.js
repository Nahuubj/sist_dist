import express from 'express';
import pg from 'pg';
import cors from "cors";
import net from 'net';

const app = express();
const apiPort = 3000;
const tcpPort = 4000;


const APIhelpBaseRoute ="http://localhost:2128"

// Habilitar CORS
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PATCH"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

const clientesConectados = [];
const clientesDevolver = [];

const server = net.createServer((socket) => {
  console.log('Cliente conectado:', socket.remoteAddress);

  clientesConectados.push(socket);

  socket.on('data',async  (data) => {
    data = JSON.parse( data.toString());
    const index = clientesDevolver.findIndex(x => data.id == x.data.id);
    if (index >= 0) {
      console.log("Ya existía y lo estoy modificando");
      clientesDevolver[index] = { data, socket };
    } else {
      console.log("No existía y lo estoy agregando");


      //acá agregar el fetch a la api
      const response = await fetch(`${APIhelpBaseRoute}/client/${data.id}`);
      const clientExists = await response.json();
      console.log(response);
      if (clientExists.length > 0) {
        await fetch(`${APIhelpBaseRoute}/client/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "conectado",ip: data.ipAddress, mac: data.mac })
        });
      } else {
        await fetch(`${APIhelpBaseRoute}/client`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id:data.id ,ip: data.ipAddress, status: "conectado", mac: data.mac})
        });
      }
      clientesDevolver.push({ data, socket });

    }
  });

  socket.on('end', async() => {
    console.log('Cliente desconectado');
    const index = clientesConectados.indexOf(socket);
    if (index !== -1) {
      clientesConectados.splice(index, 1);
    }
    const index2 = clientesDevolver.findIndex(x => x.socket === socket);
    if (index2 >= 0) {
      console.log("Borrando");
      let dt = clientesDevolver[index2];
      await fetch(`${APIhelpBaseRoute}/client/${dt.data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "desconectado",ip: dt.data.ipAddress, mac: dt.data.mac })
      });
      clientesDevolver.splice(index2, 1);

    }
  });

  socket.on('error', async(err) => {
    console.error(`Error en la conexión con el cliente: ${err.message}`);
    const index = clientesConectados.indexOf(socket);
    if (index !== -1) {
      clientesConectados.splice(index, 1);
    }
    const index2 = clientesDevolver.findIndex(x => x.socket === socket);
    if (index2 >= 0) {
      console.log("Borrando");
      let dt = clientesDevolver[index2];
      await fetch(`${APIhelpBaseRoute}/client/${dt.data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "desconectado",ip: dt.data.ipAddress, mac: dt.data.mac })
      });
      clientesDevolver.splice(index2, 1);

    }
  });
});



const reportInterval = 60000; // 2 minutos en milisegundos
const diskIndex =0;
setInterval(() => {
  clientesDevolver.forEach(async(client)=>{
    let res = await fetch(`${APIhelpBaseRoute}/disk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id:client.data.id ,
                          memory_in_use: client.data.disks[diskIndex].diskUsage / (1024*1024*1024), 
                          total_memory: client.data.disks[diskIndex].totalDisk/ (1024*1024*1024), name: client.data.disks[diskIndex].disk})
    });
    if (res.ok){
      console.log("Se ingresó");
    }
    
  })
}, reportInterval);


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
