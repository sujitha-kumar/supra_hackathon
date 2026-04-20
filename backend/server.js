import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clientsRouter from './routes/clients.js';
import briefRouter from './routes/brief.js';
import copilotRouter from './routes/copilot.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/clients', clientsRouter);
app.use('/api/brief', briefRouter);
app.use('/api/copilot', copilotRouter);

app.get('/', (req, res) => res.json({ status: 'ok', message: 'RM Copilot API live' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => console.log('Server running on port', PORT));
