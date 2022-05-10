import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import { DNSProvider } from './context/DNSContext'

ReactDOM.render(
  <React.StrictMode>
    <DNSProvider>
      <App />
    </DNSProvider>
  </React.StrictMode>,
  document.getElementById('root')
);