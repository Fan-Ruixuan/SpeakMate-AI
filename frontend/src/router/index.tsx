import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';

const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/home', element: <HomePage /> },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}