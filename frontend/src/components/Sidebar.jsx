import { FileAudio, Gauge, ListChecks, Mic2, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/upload', label: 'Upload', icon: FileAudio },
  { to: '/transcripts', label: 'Transcripts', icon: ListChecks },
]

export default function Sidebar() {
  const { user } = useAuth()
  const visibleLinks = user?.role === 'manager' ? [...links, { to: '/users', label: 'Users', icon: Users }] : links

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Mic2 size={22} aria-hidden="true" />
        </div>
        <div>
          <strong>VoiceScribe NG</strong>
          <span>Dealership STT</span>
        </div>
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
