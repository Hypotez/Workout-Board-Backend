import { Pool } from 'pg';
import { CookieResponse, CreateUserInput, LoginUserInput } from '../schemas/shared/auth';
import { PublicUser, PublicUserSchema } from '../schemas/shared/user';
import { SaveSettings } from '../schemas/shared/settings';
import { hashPassword, comparePassword } from '../crypto/hash';
import { encrypt } from '../crypto/encryption';
import logger from '../logger/logger';
import { generateTokens } from '../crypto/jwt';

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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS settings (
          user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          hevy_api_key_encrypted TEXT,
          use_hevy_api BOOLEAN DEFAULT FALSE,
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
        CREATE OR REPLACE FUNCTION update_settings_updated_at_column()
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

      await client.query(`
        DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
        CREATE TRIGGER update_settings_updated_at
          BEFORE UPDATE ON settings
          FOR EACH ROW
          EXECUTE FUNCTION update_settings_updated_at_column();
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

  async login(userData: LoginUserInput): Promise<CookieResponse | null> {
    const client = await this.pool.connect();

    try {
      const identifier = userData.type === 'username' ? userData.username : userData.email;

      const result = await client.query(
        'SELECT id, password_hash FROM users WHERE username = $1 OR email = $1',
        [identifier]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];

      const isPasswordValid = await comparePassword(userData.password, user.password_hash);

      if (!isPasswordValid) {
        return null;
      }

      return generateTokens(user.id);
    } catch (error) {
      logger.error('[DB] [login] Error logging in user:', error);
      return null;
    } finally {
      client.release();
    }
  }

  async getUserById(userId: string): Promise<PublicUser | null> {
    const client = await this.pool.connect();

    try {
      const result = await client.query(
        'SELECT id, username, email, created_at, updated_at FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const schemaParse = PublicUserSchema.safeParse(result.rows[0]);

      if (!schemaParse.success) {
        logger.error('[DB] [getUserById] Failed to parse user data from DB');
        return null;
      }

      return schemaParse.data;
    } catch (error) {
      logger.error(`[DB] [getUserById] Error fetching user by ID. Id: ${userId}. Error: ${error}`);
      return null;
    } finally {
      client.release();
    }
  }
  async saveUserSettings(userId: string, settings: SaveSettings): Promise<boolean> {
    const client = await this.pool.connect();

    if (settings.hevy_api_key_encrypted) {
      settings.hevy_api_key_encrypted = encrypt(settings.hevy_api_key_encrypted);
    }

    try {
      await client.query(
        `INSERT INTO settings (user_id, hevy_api_key_encrypted, use_hevy_api)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id)
          DO UPDATE SET
            hevy_api_key_encrypted = EXCLUDED.hevy_api_key_encrypted,
            use_hevy_api = EXCLUDED.use_hevy_api
        `,
        [userId, settings.hevy_api_key_encrypted, settings.use_hevy_api]
      );
      return true;
    } catch (error) {
      logger.error(
        `[DB] [saveUserSettings] Error saving user settings. UserId: ${userId}. Error: ${error}`
      );
      return false;
    } finally {
      client.release();
    }
  }
}
