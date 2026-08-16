import { LogOut, Search, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState, useRef, useEffect } from 'react'

export default function Navbar({ onToggle, menuOpen = false }) {
  const { user, logout } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus()
  }, [searchOpen])

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-button mobile-menu-button"
          type="button"
          onClick={onToggle}
          aria-label="Toggle menu"
          aria-controls="sidebar"
          aria-expanded={menuOpen}
        >
          <Menu size={18} aria-hidden="true" />
        </button>
        <div className={`topbar-search ${searchOpen ? 'open' : ''}`}>
          <button
            className="icon-button"
            type="button"
            aria-label="Open search"
            onClick={() => setSearchOpen((v) => !v)}
            title="Search"
          >
            <Search size={16} aria-hidden="true" />
          </button>
          <span className="topbar-search-label">Voice intelligence for Nigerian auto sales teams</span>
          <input ref={inputRef} className="topbar-search-input" placeholder="Search..." aria-label="Search site" />
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
