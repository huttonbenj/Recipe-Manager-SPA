import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error';
import { db } from './config/database';
import authRoutes from './routes/auth';
import recipeRoutes from './routes/recipes';
import userRoutes from './routes/user';
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);

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
        status: 'healthy',
        database: 'connected',
        pool: stats
      });
    } else {
      res.status(503).json({ 
        status: 'unhealthy',
        database: 'disconnected',
        pool: stats
      });
    }
  } catch (error) {
    res.status(503).json({ 
      status: 'error',
      database: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware
app.use(errorHandler);

export default app; 