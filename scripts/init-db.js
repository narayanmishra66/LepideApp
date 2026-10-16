import { loadEnvFile } from 'node:process';
import { initializeDatabase, closeDatabase } from '../database.js';

loadEnvFile(new URL('../.env', import.meta.url));
try {
  await initializeDatabase();
  console.log('Database ready: public.app_users created with private access.');
} catch (err) {
  // Do not print database connection strings or credentials.
  console.error(`Database initialization failed (${err.code || 'connection error'}). Check DATABASE_URL, password, network access, and TLS settings.`);
  process.exitCode = 1;
} finally { await closeDatabase(); }