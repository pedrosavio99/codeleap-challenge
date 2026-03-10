import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useUsernameStore } from '../store/useUsernameStore';
import Login from '../pages/Login';
import Home from '../pages/Home';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const username = useUsernameStore((state) => state.username);
  return username ? children : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);