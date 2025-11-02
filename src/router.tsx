import { createBrowserRouter, RouteObject } from 'react-router-dom'
import App from './App'
import DiagrammingRoute from './diagramming'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/diagramming/*',
    element: <DiagrammingRoute />,
  },
]

export const router = createBrowserRouter(routes)

export default router
