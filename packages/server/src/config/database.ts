import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import logger from '../utils/logger';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

const createDatabaseConfig = (): DatabaseConfig => {
  const config: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'recipe_manager',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000', 10),
  };

  return config;
};

class Database {
  private pool: Pool;
  private config: DatabaseConfig;

  constructor() {
    this.config = createDatabaseConfig();
    this.pool = new Pool(this.config);
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.pool.on('connect', (_client: PoolClient) => {
      logger.debug('New database client connected', {
        database: this.config.database,
      });
    });

    this.pool.on('error', (err: Error, _client: PoolClient) => {
      logger.error('Database pool error', {
        error: err.message,
      });
    });

    this.pool.on('remove', (_client: PoolClient) => {
      logger.debug('Database client removed');
    });
  }

  async query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<T[]> {
    const start = Date.now();
    try {
      const result: QueryResult<T> = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      logger.debug('Database query executed', {
        query: text,
        duration,
        rowCount: result.rowCount,
      });

      return result.rows;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error('Database query failed', {
        query: text,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW() as current_time');
      return result.length > 0;
    } catch (error) {
      logger.error('Database health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  async close(): Promise<void> {
    try {
      await this.pool.end();
      logger.info('Database pool closed');
    } catch (error) {
      logger.error('Error closing database pool', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

export const db = new Database();
export { Database }; 