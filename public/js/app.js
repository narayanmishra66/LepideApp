const themes = ['light', 'dark', 'hc'];
const labels = { light: 'Light', dark: 'Dark', hc: 'High contrast' };
function updateThemeControls() {
  const theme = document.documentElement.dataset.theme;
  const next = themes[(themes.indexOf(theme) + 1) % themes.length];
  document.querySelectorAll('[data-theme-cycle]').forEach(button => {
    button.querySelector('.theme-label').textContent = labels[theme];
    button.setAttribute('aria-label', `Color theme: ${labels[theme]}. Switch to ${labels[next]}`);
  });
}
document.querySelectorAll('[data-theme-cycle]').forEach(button => button.addEventListener('click', () => {
  const theme = themes[(themes.indexOf(document.documentElement.dataset.theme) + 1) % themes.length];
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('lepidus-theme', theme); } catch { /* Storage is optional. */ }
  updateThemeControls();
}));
updateThemeControls();
document.querySelector('[data-show-password]')?.addEventListener('change', event => {
  document.querySelector('#password').type = event.target.checked ? 'text' : 'password';
});
const form = document.querySelector('[data-auth-form]');
const originalSubmitLabel = form?.querySelector('[data-submit-label]')?.textContent;
function validateField(input) {
  const message = document.getElementById(`${input.id}-message`);
  if (!message) return true;
  const checkbox = input.type === 'checkbox';
  const value = checkbox ? input.checked : input.value.trim();
  let error = '';
  if (!value) error = checkbox ? 'Accept the terms to continue.' : `Enter your ${input.id === 'name' ? 'full name' : input.id === 'company' ? 'company name' : input.id === 'email' ? 'email address' : 'password'}.`;
  else if (input.id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) error = 'Enter a valid email address.';
  else if (input.id === 'name' && value.length < 2) error = 'Enter your full name (at least 2 characters).';
  else if (input.id === 'password' && input.minLength > 0 && input.value.length < input.minLength) error = 'Use at least 12 characters.';
  input.setAttribute('aria-invalid', String(Boolean(error)));
  input.closest('.lp-input__field')?.classList.toggle('lp-input__field--error', Boolean(error));
  if (checkbox) input.nextElementSibling.classList.toggle('lp-checkbox__box--error', Boolean(error));
  message.classList.toggle('lp-input__message--error', Boolean(error));
  message.textContent = error || (input.id === 'password' && input.minLength > 0 ? 'Use at least 12 characters. A passphrase works great.' : '');
  message.hidden = !message.textContent;
  return !error;
}
form?.addEventListener('submit', event => {
  const invalid = [...form.querySelectorAll('[required]')].filter(input => !validateField(input));
  const summary = form.querySelector('[data-form-summary]');
  if (invalid.length) {
    event.preventDefault();
    summary.hidden = false;
    summary.textContent = `Please check ${invalid.length === 1 ? 'the highlighted field' : `the ${invalid.length} highlighted fields`}.`;
    invalid[0].focus();
    return;
  }
  summary.hidden = true;
  const button = form.querySelector('[data-submit]');
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  button.querySelector('[data-submit-label]').textContent = 'Just a moment…';
});
form?.querySelectorAll('[required]').forEach(input => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', () => {
    if (input.getAttribute('aria-invalid') === 'true') validateField(input);
  });
});
window.addEventListener('pageshow', () => {
  const button = form?.querySelector('[data-submit]');
  if (button) {
    button.disabled = false;
    button.removeAttribute('aria-busy');
    button.querySelector('[data-submit-label]').textContent = originalSubmitLabel;
  }
});