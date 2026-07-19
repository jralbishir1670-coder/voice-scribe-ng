import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ManagerRoute() {
  const { user } = useAuth()
  return user?.role === 'manager' ? <Outlet /> : <Navigate to="/dashboard" replace />
}
