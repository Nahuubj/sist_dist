import express from 'express';
import { PORT } from './config.js';
import morgan from 'morgan';
import cors from 'cors';


import routes from './routes/routes.js'

const app = express();

app.use(morgan('dev'));

app.use(express.json());

// Middleware para habilitar CORS
app.use(cors());

app.use(routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});