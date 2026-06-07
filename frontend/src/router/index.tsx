import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import PracticeReport from '../pages/PracticeReport';

const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/home', element: <HomePage /> },
  { path: '/report', element: <PracticeReport /> },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}