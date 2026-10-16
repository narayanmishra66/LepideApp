import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', err => errors.push(err.message));
const base = process.env.BASE_URL || 'http://localhost:3000';
try {
  for (const route of ['/', '/login', '/signup']) {
    await page.goto(base + route);
    for (const theme of ['light', 'dark', 'hc']) {
      await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      assert.deepEqual(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `${route} ${theme} accessibility`);
    }
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const direction of ['ltr', 'rtl']) {
        await page.evaluate(direction => document.documentElement.dir = direction, direction);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route} ${width} ${direction} overflow`);
      }
    }
    await page.evaluate(() => { document.documentElement.dir = 'ltr'; document.documentElement.dataset.theme = 'light'; });
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  await page.goto(base + '/signup');
  await page.getByRole('button', { name: 'Create workspace', exact: true }).click();
  await page.locator('[data-form-summary]').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#name').getAttribute('aria-invalid'), 'true');
  await page.getByRole('button', { name: 'Read demo terms', exact: true }).click();
  await page.getByRole('dialog').waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  assert.equal(await page.getByRole('button', { name: 'Read demo terms', exact: true }).evaluate(el => el === document.activeElement), true);
  await page.getByLabel('Full name', { exact: true }).fill('Alex Morgan');
  await page.getByLabel('Company name', { exact: true }).fill('Acme');
  const email = `alex-${Date.now()}@example.com`;
  await page.getByLabel('Work email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill('a unique browser passphrase');
  await page.getByLabel('Show password', { exact: true }).check();
  assert.equal(await page.locator('#password').getAttribute('type'), 'text');
  await page.getByLabel('I agree to the demo terms and privacy notice.', { exact: true }).check();
  await page.getByRole('button', { name: 'Create workspace', exact: true }).click();
  await page.waitForURL('**/workspace');
  await page.getByRole('button', { name: 'Log out', exact: true }).click();
  await page.waitForURL('**/login');
  await page.getByLabel('Work email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill('a unique browser passphrase');
  await page.getByRole('button', { name: 'Log in to your workspace', exact: true }).click();
  await page.waitForURL('**/workspace');
  await page.getByRole('button', { name: /Color theme:/ }).click();
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.deepEqual(errors, []);
  console.log('Passed: all pages × 3 themes accessibility; 5 widths × LTR/RTL; modal Escape/focus; form validation; signup/logout/login; theme persistence; no browser errors.');
} finally { await browser.close(); }