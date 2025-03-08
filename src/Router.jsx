import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Login from './Path/Login';

// Router yaratish
 export const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/app', element: <App /> },
]);

export default router;
