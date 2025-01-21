import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';  // Přidáme .tsx příponu
import reportWebVitals from './reportWebVitals.ts';  // Přidáme .ts příponu

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();