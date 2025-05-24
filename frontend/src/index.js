// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { getAuthToken } from './utils/auth';

// Проверка аутентификации при загрузке
if (getAuthToken()) {
  // Здесь можно добавить проверку валидности токена
  // например, через запрос к /api/auth/validate
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Если используете web-vitals
reportWebVitals();
