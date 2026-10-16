import pg from 'pg';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { getCACertificates } from 'node:tls';

let pool;
export function getDatabase() {
  if (!pool) {
    if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL in .env.');
    const url = new URL(process.env.DATABASE_URL);
    // Never let URL options silently disable TLS certificate verification.
    for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert']) url.searchParams.delete(key);
    const ca = [...getCACertificates('default'), readFileSync(new URL('./database/supabase-ca.crt', import.meta.url), 'utf8')];
    pool = new pg.Pool({ connectionString: url.toString(), ssl: { rejectUnauthorized: true, ca },
      max: process.env.VERCEL ? 2 : 10, connectionTimeoutMillis: 10000, idleTimeoutMillis: 10000,
      allowExitOnIdle: true,
      query_timeout: 10000, statement_timeout: 10000 });
    pool.on('error', () => console.error('An idle database connection failed.'));
  }
  return pool;
}

export async function initializeDatabase() {
  const sql = await readFile(new URL('./database/schema.sql', import.meta.url), 'utf8');
  await getDatabase().query(sql);
}

export async function closeDatabase() {
  if (pool) { await pool.end(); pool = undefined; }
}