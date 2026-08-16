import { FileAudio, Gauge, ListChecks, Mic2, Users, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/upload', label: 'Upload', icon: FileAudio },
  { to: '/transcripts', label: 'Transcripts', icon: ListChecks },
]

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { user } = useAuth()
  const visibleLinks = user?.role === 'manager' ? [...links, { to: '/users', label: 'Users', icon: Users }] : links

  return (
    <aside id="sidebar" className={`sidebar ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <div className="brand">
        <div className="brand-mark">
          <Mic2 size={22} aria-hidden="true" />
        </div>
        <div>
          <strong>VoiceScribe NG</strong>
          <span>Dealership STT</span>
        </div>
        <button className="icon-button sidebar-close" type="button" onClick={onClose} aria-label="Close menu">
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="Primary app navigation">
        {visibleLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
