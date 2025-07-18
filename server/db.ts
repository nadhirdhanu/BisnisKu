import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
//import ws from "ws";
import * as schema from "@shared/schema";

//neonConfig.webSocketConstructor = ws;

// Default local PostgreSQL connection if DATABASE_URL is not set
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:pass@localhost:5432/postgres';

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Please set up your local PostgreSQL connection.",
  );
}

export const pool = new Pool ({ 
  connectionString: DATABASE_URL,
  // Additional connection options for local PostgreSQL
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
export const db = drizzle(pool, { schema });