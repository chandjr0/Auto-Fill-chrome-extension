import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import IFrame from './IFrame';
import reportWebVitals from '../reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('iframe-root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <IFrame />
  </React.StrictMode>
);

reportWebVitals();
