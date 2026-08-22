import { ShisoApp } from '@umami/shiso/client';
import { hydrateRoot } from 'react-dom/client';
import './styles.css';

const element = document.getElementById('root');

if (!element) {
  throw new Error('Shiso could not find the root element.');
}

hydrateRoot(element, <ShisoApp />);
