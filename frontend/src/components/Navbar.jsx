import { LogOut, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} aria-hidden="true" />
        <span>Voice intelligence for Nigerian auto sales teams</span>
      </div>
      <div className="topbar-user" aria-label="Current user">
        <div>
          <strong>{user?.name}</strong>
          <span>{user?.role?.replace('_', ' ')}</span>
        </div>
        <button className="icon-button" type="button" onClick={logout} aria-label="Log out" title="Log out">
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
