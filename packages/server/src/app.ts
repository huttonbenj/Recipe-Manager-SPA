import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error';
import { db } from './config/database';
import logger from './utils/logger';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Database health check endpoint
app.get('/health/db', async (_req: Request, res: Response) => {
  try {
    const isHealthy = await db.healthCheck();
    const stats = db.getPoolStats();
    
    if (isHealthy) {
      res.json({ 
        status: 'ok', 
        database: 'connected',
        pool: stats
      });
    } else {
      res.status(503).json({ 
        status: 'error', 
        database: 'disconnected',
        pool: stats
      });
    }
  } catch (error) {
    logger.error('Database health check failed', { error });
    res.status(503).json({ 
      status: 'error', 
      database: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling
app.use(errorHandler);

export default app; 