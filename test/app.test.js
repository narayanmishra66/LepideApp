import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';

const token = html => html.match(/name="_csrf" value="([^"]+)"/)[1];
test('all public pages render with canonical assets and no password values', async () => {
  const app = createApp();
  for (const url of ['/', '/login', '/signup']) {
    const response = await request(app).get(url).expect(200);
    assert.match(response.text, /\/vendor\/lepidus.css/);
    assert.match(response.text, /bootstrap-grid.min.css/);
    assert.match(response.text, /<main[^>]*id="main"|<main id="main"/);
  }
  await request(app).get('/vendor/lepidus.css').expect(200);
  await request(app).get('/vendor/lepidus.js').expect(200);
  await request(app).get('/workspace').expect(302).expect('Location', '/login');
  await request(app).get('/not-a-page').expect(404);
});
test('signup, logout and login work with session rotation and CSRF protection', async () => {
  const app = createApp();
  const agent = request.agent(app);
  const signup = await agent.get('/signup');
  await agent.post('/signup').type('form').send({ name: 'Alex' }).expect(403);
  const invalid = await agent.post('/signup').type('form').send({ _csrf: token(signup.text), email: 'bad', password: 'short' }).expect(422);
  assert.match(invalid.text, /Enter a valid email address/);
  assert.match(invalid.text, /Use between 12 and 128 characters/);
  const input = { _csrf: token(signup.text), name: 'Alex Morgan', company: 'Acme', email: 'alex@example.com', password: 'a unique test passphrase', terms: 'on' };
  await agent.post('/signup').type('form').send(input).expect(303).expect('Location', '/workspace');
  const workspace = await agent.get('/workspace').expect(200);
  assert.match(workspace.text, /Welcome, Alex/);
  assert.match(workspace.text, /alex@example.com/);
  await agent.post('/logout').type('form').send({ _csrf: token(workspace.text) }).expect(303);
  await agent.get('/workspace').expect(302);
  const login = await agent.get('/login');
  await agent.post('/login').type('form').send({ _csrf: token(login.text), email: input.email, password: 'incorrect' }).expect(401);
  await agent.post('/login').type('form').send({ _csrf: token(login.text), email: input.email, password: input.password, remember: 'on' }).expect(303);
  await agent.get('/workspace').expect(200);
});
test('duplicate accounts and unaccepted terms are rejected', async () => {
  const agent = request.agent(createApp());
  const signup = await agent.get('/signup');
  await agent.post('/signup').type('form').send({ _csrf: token(signup.text), name: 'Alex', company: 'Acme', email: 'a@example.com', password: 'this is a passphrase' }).expect(422);
});
test('production requires an explicit session secret', () => {
  assert.throws(() => createApp({ production: true }), /SESSION_SECRET/);
});