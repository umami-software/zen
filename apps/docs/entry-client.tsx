import { ShisoApp } from '@umami/shiso/client';
import { type Theme, ToastProvider, useTheme } from '@umami/react-zen';
import { hydrateRoot } from 'react-dom/client';
import './styles.css';

const element = document.getElementById('root');

if (!element) {
  throw new Error('Shiso could not find the root element.');
}

function getDocumentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function syncTheme(theme: Theme, persistShisoTheme = false) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  useTheme.setState({ theme });

  try {
    localStorage.setItem('theme', theme);
    if (persistShisoTheme) {
      localStorage.setItem('shiso-theme', theme);
    }
  } catch {
    // Theme still works when storage is unavailable.
  }
}

// Shiso initializes data-theme before this bundle runs, while React Zen also
// relies on the dark class and its own store. Keep both theme systems aligned.
syncTheme(getDocumentTheme());

const themeObserver = new MutationObserver(mutations => {
  const themeChanged = mutations.some(
    mutation =>
      mutation.attributeName === 'data-theme' && mutation.oldValue !== getDocumentTheme(),
  );

  if (themeChanged) {
    syncTheme(getDocumentTheme(), true);
  }
});

themeObserver.observe(document.documentElement, {
  attributeFilter: ['data-theme'],
  attributeOldValue: true,
});

hydrateRoot(
  element,
  <ToastProvider duration={3000}>
    <ShisoApp />
  </ToastProvider>,
);
