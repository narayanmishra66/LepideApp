import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { getDatabase } from './database.js';
import { hashPassword, verifyPassword } from './passwords.js';
import connectPgSimple from 'connect-pg-simple';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const PgSessionStore = connectPgSimple(session);
const root = path.dirname(fileURLToPath(import.meta.url));
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createApp({ sessionSecret = process.env.SESSION_SECRET, production = process.env.NODE_ENV === 'production' } = {}) {
  if (production && !sessionSecret) throw new Error('Set SESSION_SECRET before starting in production.');
  const db = getDatabase();
  const dummyHash = hashPassword(randomBytes(32).toString('hex'));
  const app = express();
  if (production) app.set('trust proxy', 1);
  const saveSession = req => new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));
  const establishSession = async (req, user, remember = false) => {
    await new Promise((resolve, reject) => req.session.regenerate(err => err ? reject(err) : resolve()));
    req.session.databaseUserId = user.id;
    req.session.cookie.maxAge = 1000 * 60 * 60 * (remember ? 24 * 7 : 8);
    await saveSession(req);
  };
  const notice = (res, title, message, status = 200) => res.status(status).render('notice', { page: 'notice', title, message });
  app.disable('x-powered-by');
  app.set('view engine', 'ejs');
  app.set('views', path.join(root, 'views'));
  app.use(helmet({ contentSecurityPolicy: { directives: { 'script-src': ["'self'"], 'style-src': ["'self'"], 'img-src': ["'self'", 'data:'], 'upgrade-insecure-requests': production ? [] : null } } }));
  app.use('/vendor/bootstrap', express.static(path.join(root, 'node_modules/bootstrap/dist/css')));
  app.use('/vendor/fonts', express.static(path.join(root, 'node_modules/@fontsource/open-sans/files')));
  app.use(express.static(path.join(root, 'public')));
  app.use(express.urlencoded({ extended: false, limit: '12kb' }));
  app.use(session({
    name: 'lepidus.sid', secret: sessionSecret || randomBytes(32).toString('hex'),
    store: new PgSessionStore({ pool: db, schemaName: 'public', tableName: 'app_sessions',
      createTableIfMissing: false, pruneSessionInterval: false,
      errorLog: () => console.error('Database session operation failed.') }),
    resave: false, saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', secure: production, maxAge: 1000 * 60 * 60 * 8 }
  }));
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    req.session.csrf ||= randomBytes(32).toString('hex');
    res.locals.csrf = req.session.csrf;
    res.locals.user = null;
    res.locals.year = new Date().getFullYear();
    if (req.method === 'POST') {
      const supplied = typeof req.body._csrf === 'string' ? req.body._csrf : '';
      const expected = req.session.csrf;
      if (Buffer.byteLength(supplied) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
        return res.status(403).render('notice', { title: 'Please refresh this page', message: 'Your session has changed. Open the form again and retry.', page: 'notice' });
      }
    }
    next();
  });
  app.use(async (req, res, next) => {
    try {
      // Old Supabase Auth sessions do not count as database-backed logins.
      delete req.session.auth; delete req.session.user; delete req.session.pkce; delete req.session.recovery;
      if (req.session.databaseUserId) {
        const { rows } = await db.query('SELECT id, name, company, email FROM public.app_users WHERE id = $1', [req.session.databaseUserId]);
        req.user = rows[0] || null;
        if (!req.user) delete req.session.databaseUserId;
      }
      res.locals.user = req.user || null;
      next();
    } catch (err) { next(err); }
  });
  const renderAuth = (req, res, mode, errors = {}, values = {}, status = 200) => res.status(status).render('auth', {
    page: mode, title: ({ login: 'Welcome back', signup: 'Create your workspace', 'forgot-password': 'Reset your password', 'reset-password': 'Choose a new password' })[mode], errors, values
  });
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false,
    handler: (req, res) => res.status(429).render('notice', { title: 'A little pause for security', message: 'Too many attempts. Please try again in 15 minutes.', page: 'notice' }) });
  app.get('/', (req, res) => res.render('home', { page: 'home', title: 'Clarity for your data. Confidence for your team.' }));
  for (const mode of ['login', 'signup']) app.get(`/${mode}`, (req, res) => req.user ? res.redirect('/workspace') : renderAuth(req, res, mode));
  app.post('/signup', authLimiter, async (req, res, next) => {
    try {
      const name = String(req.body.name || '').trim();
      const company = String(req.body.company || '').trim();
      const email = String(req.body.email || '').trim().toLowerCase();
      const password = String(req.body.password || '');
      const values = { name, company, email };
      const errors = {};
      if (name.length < 2 || name.length > 80) errors.name = 'Enter your full name (2–80 characters).';
      if (!company || company.length > 100) errors.company = 'Enter your company name (up to 100 characters).';
      if (!emailPattern.test(email) || email.length > 254) errors.email = 'Enter a valid email address.';
      if (password.length < 12 || password.length > 128) errors.password = 'Use between 12 and 128 characters.';
      if (req.body.terms !== 'on') errors.terms = 'Accept the terms to continue.';
      if (Object.keys(errors).length) return renderAuth(req, res, 'signup', errors, values, 422);
      const passwordHash = await hashPassword(password);
      const { rows } = await db.query(`INSERT INTO public.app_users (name, company, email, password_hash)
        VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING RETURNING id`, [name, company, email, passwordHash]);
      if (!rows[0]) return renderAuth(req, res, 'signup', { form: 'Unable to register with these details. If you already have an account, try logging in.' }, values, 422);
      await establishSession(req, rows[0]);
      res.redirect(303, '/workspace');
    } catch (err) { next(err); }
  });
  app.post('/login', authLimiter, async (req, res, next) => {
    try {
      const email = String(req.body.email || '').trim().toLowerCase();
      const password = String(req.body.password || '');
      const errors = {};
      if (!emailPattern.test(email) || email.length > 254) errors.email = 'Enter a valid email address.';
      if (!password || password.length > 128) errors.password = 'Enter your password (up to 128 characters).';
      if (Object.keys(errors).length) return renderAuth(req, res, 'login', errors, { email }, 422);
      const { rows } = await db.query('SELECT id, password_hash FROM public.app_users WHERE email = $1', [email]);
      const user = rows[0];
      const valid = await verifyPassword(password, user ? user.password_hash : await dummyHash);
      if (!valid || !user) return renderAuth(req, res, 'login', { form: 'The email or password is incorrect. Please try again.' }, { email }, 401);
      await establishSession(req, user, req.body.remember === 'on');
      res.redirect(303, '/workspace');
    } catch (err) { next(err); }
  });
  for (const route of ['/forgot-password', '/reset-password']) {
    app.get(route, (req, res) => notice(res, 'Password recovery is not configured', 'This application uses custom database accounts, not Supabase Auth. Email recovery requires a separate mail service and secure reset-token flow.'));
    app.post(route, authLimiter, (req, res) => notice(res, 'Password recovery is not configured', 'No password was changed and no recovery email was sent.', 501));
  }
  app.get('/auth/callback', (req, res) => res.redirect('/login'));
  app.get('/workspace', (req, res) => req.user ? res.render('workspace', { page: 'workspace', title: 'Your workspace' }) : res.redirect('/login'));
  app.post('/logout', async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => req.session.destroy(err => err ? reject(err) : resolve()));
      res.clearCookie('lepidus.sid'); res.redirect(303, '/login');
    } catch (err) { next(err); }
  });
  app.use((req, res) => res.status(404).render('notice', { page: 'notice', title: 'This page is off the map', message: 'The page you are looking for may have moved. Let’s get you back to a clearer view.' }));
  app.use((err, req, res, next) => {
    console.error(`Request failed (${err.code || err.name || 'unknown error'}).`);
    res.status(err.status === 413 ? 413 : 500).render('notice', { page: 'notice', title: 'Something needs another look', message: 'We could not complete that request. Please return home and try again.' });
  });
  return app;
}