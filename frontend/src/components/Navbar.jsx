import { LogOut, Search, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onToggle }) {
  const { user, logout } = useAuth()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button mobile-menu-button" type="button" onClick={onToggle} aria-label="Toggle menu" aria-controls="sidebar" aria-expanded="false">
          <Menu size={18} aria-hidden="true" />
        </button>
        <div className="topbar-search">
          <Search size={18} aria-hidden="true" />
          <span>Voice intelligence for Nigerian auto sales teams</span>
        </div>
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
