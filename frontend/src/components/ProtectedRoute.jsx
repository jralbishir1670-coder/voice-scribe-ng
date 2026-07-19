import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#app-content">Skip to main content</a>
      <Sidebar />
      <main className="main-panel" id="app-content" tabIndex="-1">
        <Navbar />
        <Outlet />
      </main>
    </div>
  )
}
