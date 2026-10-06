import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __taraDbPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!globalThis.__taraDbPool) {
    const connectionString = process.env.DATABASE_URL;
    globalThis.__taraDbPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return globalThis.__taraDbPool;
}

export async function query<T = unknown>(text: string, params: unknown[] = []): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query(text, params as never);
  return result.rows as T[];
}
