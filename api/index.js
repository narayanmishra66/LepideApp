import { createApp } from '../app.js';

// Vercel supplies DATABASE_URL and SESSION_SECRET through project settings.
// No local file writes, schema migrations, or app.listen in the function.
export default createApp({ production: true });