import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from './Router.jsx'; // 🟢 "router" default sifatida import qilindi

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} /> {/* 🟢 "Router" o‘rniga "router" ishlatilmoqda */}
  </StrictMode>,
);
