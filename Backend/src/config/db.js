import { Connector } from '@google-cloud/cloud-sql-connector';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

let pool;

/**
 * Initializes and returns a PostgreSQL connection pool.
 * Supports both Google Cloud SQL Connector (for GCP/production)
 * and direct TCP pool (for local development or Cloud SQL Proxy).
 */
export async function getDbPool() {
  if (pool) return pool;

  const instanceConnectionName = process.env.INSTANCE_CONNECTION_NAME;

  if (instanceConnectionName) {
    // Connect using Google Cloud SQL Connector
    console.log(`🔌 Initializing Cloud SQL Connector for: ${instanceConnectionName}`);
    const connector = new Connector();
    const clientOpts = await connector.getOptions({
      instanceConnectionName,
      ipType: process.env.IP_TYPE || 'PUBLIC',
    });

    pool = new Pool({
      ...clientOpts,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
      idleTimeoutMillis: 30000,
    });
  } else {
    // Fallback to standard PostgreSQL TCP connection pool
    console.log(`🔌 Initializing standard PostgreSQL pool (Host: ${process.env.DB_HOST || 'localhost'})`);
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'seafudz_db',
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
      idleTimeoutMillis: 30000,
    });
  }

  pool.on('error', (err) => {
    console.error('❌ Unexpected database pool error:', err);
  });

  return pool;
}

/**
 * Helper function to execute SQL queries.
 */
export async function query(text, params) {
  const dbPool = await getDbPool();
  return dbPool.query(text, params);
}

export default {
  getDbPool,
  query,
};
