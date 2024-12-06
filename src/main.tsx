import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { LoadingProvider } from './components/LoadingProvider';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </React.StrictMode>
);
