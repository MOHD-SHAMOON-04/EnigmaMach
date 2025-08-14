// module imports
import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import cors from 'cors';

// services and routes imports
import enigmaRouter from './routes/enigma'
import { connectDB } from './services/db';

// globals
const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

// CORS config stuff
const allowedOrigins = [process.env.BASE_URL, 'http://localhost:5173'];
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/enigma', enigmaRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});