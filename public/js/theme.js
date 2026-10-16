(() => {
  try {
    const theme = localStorage.getItem('lepidus-theme');
    if (['light', 'dark', 'hc'].includes(theme)) document.documentElement.dataset.theme = theme;
  } catch { /* The light default also works without browser storage. */ }
})();