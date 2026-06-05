import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>首页页面</div>
  }
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}