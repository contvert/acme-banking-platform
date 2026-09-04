export type Theme = 'light' | 'dark' | 'system';

export const THEME_KEY = 'acme-theme';

/**
 * Applies a theme by setting (or clearing) `data-theme` on <html>.
 *
 * `system` deliberately removes the attribute rather than resolving it, because
 * styles/tokens.css targets `:root:not([data-theme='light'])` inside a
 * prefers-color-scheme query. Leaving the attribute off lets the OS drive it,
 * and keeps following the OS if the user changes it while the page is open.
 */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
    root.style.colorScheme = 'light dark';
  } else {
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
  }
}

export function readStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
  } catch {
    return 'system';
  }
}

export function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode — the choice just will not persist */
  }
}

/**
 * Runs before first paint, inlined into <head>, so the page never flashes the
 * wrong theme. Kept as a string because it must execute synchronously and
 * cannot wait for React to hydrate.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var t = localStorage.getItem(${JSON.stringify(THEME_KEY)});
    var r = document.documentElement;
    if (t === 'light' || t === 'dark') {
      r.setAttribute('data-theme', t);
      r.style.colorScheme = t;
    } else {
      r.style.colorScheme = 'light dark';
    }
  } catch (e) {}
})();
`.trim();
