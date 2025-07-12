import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { errorHandler } from './middleware/error';
import { dbManager } from './config/database';
import authRoutes from './routes/auth/index';
import recipeRoutes from './routes/recipes/index';
import userRoutes from './routes/users/index';
import uploadRoutes from './routes/uploads/index';
import { API_CONFIG, CLIENT_CONFIG, UPLOAD_CONFIG } from '@recipe-manager/shared';

const app = express();

// Middleware
// Configure Helmet with relaxed Cross-Origin Resource Policy so that static assets like uploaded images
// can be loaded by the client running on a different origin/port during development.
// Setting the policy to "cross-origin" prevents the browser from blocking these resources with
// ERR_BLOCKED_BY_RESPONSE.NotSameOrigin while still retaining other Helmet protections.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(morgan('combined'));

// CORS must come before rate limiting to handle preflight requests properly
app.use(cors({
  origin: process.env.CORS_ORIGIN || `http://localhost:${CLIENT_CONFIG.DEFAULT_PORT}`,
  credentials: true,
}));

// Rate limiting (applied after CORS)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || String(API_CONFIG.RATE_LIMIT.WINDOW_MS), 10),
  max: process.env.NODE_ENV === 'development' 
    ? 1000 // Much higher limit for development
    : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || String(API_CONFIG.RATE_LIMIT.MAX_REQUESTS), 10),
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for OPTIONS requests (CORS preflight)
  skip: (req) => req.method === 'OPTIONS',
});

app.use(limiter);
app.use(express.json({ limit: `${UPLOAD_CONFIG.MAX_REQUEST_SIZE / (1024 * 1024)}mb` }));
app.use(express.urlencoded({ extended: true, limit: `${UPLOAD_CONFIG.MAX_REQUEST_SIZE / (1024 * 1024)}mb` }));

// Static files for uploaded images with explicit CORS headers
app.use('/uploads', (req, res, next) => {
  // Add CORS headers for static files
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || `http://localhost:${CLIENT_CONFIG.DEFAULT_PORT}`);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
}, express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database health check endpoint
app.get('/health/db', async (_req: Request, res: Response) => {
  try {
    const isHealthy = await dbManager.healthCheck();
    
    if (isHealthy) {
      res.json({ 
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({ 
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({ 
      status: 'error',
      database: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use(errorHandler);

export default app; 