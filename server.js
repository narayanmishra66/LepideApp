import { loadEnvFile } from 'node:process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { initializeDatabase, closeDatabase } from './database.js';

if (existsSync('.env')) loadEnvFile('.env');
// Keep development cookies valid across restarts without committing a session secret.
if (!process.env.SESSION_SECRET && process.env.NODE_ENV !== 'production') {
	const sessionDir = new URL('./.sessions/', import.meta.url);
	const secretFile = new URL('session-secret', sessionDir);
	mkdirSync(sessionDir, { recursive: true, mode: 0o700 });
	try { writeFileSync(secretFile, randomBytes(48).toString('hex'), { flag: 'wx', mode: 0o600 }); }
	catch (err) { if (err.code !== 'EEXIST') throw err; }
	process.env.SESSION_SECRET = readFileSync(fileURLToPath(secretFile), 'utf8').trim();
}
const port = Number(process.env.PORT || 3001);
try {
	await initializeDatabase();
	const app = createApp();
	app.listen(port, () => console.log(`Lepidus workspace is running at http://localhost:${port}`));
} catch (err) {
	console.error(`Startup failed (${err.code || err.name}). Check DATABASE_URL and database access. Credentials have not been logged.`);
	await closeDatabase();
	process.exitCode = 1;
}