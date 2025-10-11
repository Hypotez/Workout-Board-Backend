import { Pool } from 'pg';
import { CookieResponse, CreateUserInput } from '../schemas/shared/auth';
import { hashPassword } from '../crypto/hash';
import logger from '../logger/logger';
import { generateTokens } from '../crypto/jwt';

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  hevy_api_key_encrypted?: string;
  created_at: Date;
  updated_at: Date;
}

export default class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: 'localhost',
      password: 'postgres',
      port: 5432,
      database: 'workoutboard',
      user: 'postgres',
    });
  }

  async initialize(): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          hevy_api_key_encrypted TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      `);

      await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';
      `);

      await client.query(`
        DROP TRIGGER IF EXISTS update_users_updated_at ON users;
        CREATE TRIGGER update_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `);

      logger.info('[DB] Database initialized successfully');
    } catch (error) {
      logger.error('[DB] Error initializing database:', error);
    } finally {
      client.release();
    }
  }

  async createUser(userData: CreateUserInput): Promise<CookieResponse | null> {
    const client = await this.pool.connect();

    try {
      const passwordHash = await hashPassword(userData.password);

      const result = await client.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
        [userData.username, userData.email, passwordHash]
      );

      return await generateTokens(result.rows[0].id);
    } catch (error) {
      logger.error('[DB] [createUser] Error creating user:', error);
      return null;
    } finally {
      client.release();
    }
  }
}
