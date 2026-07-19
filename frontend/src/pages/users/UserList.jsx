import { Edit, KeyRound, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usersApi } from '../../api/users'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'

const filters = {
  role: [
    ['all', 'All Roles'],
    ['manager', 'Managers'],
    ['sales_executive', 'Sales Executives'],
  ],
  status: [
    ['all', 'All Statuses'],
    ['active', 'Active'],
    ['inactive', 'Inactive'],
  ],
}

export default function UserList() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [error, setError] = useState('')

  const loadUsers = async () => {
    const data = await usersApi.list({
      page,
      per_page: 10,
      search,
      role: role === 'all' ? undefined : role,
      status: status === 'all' ? undefined : status,
    })
    setUsers(data.items)
    setPages(data.pages || 1)
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      loadUsers().catch((err) => setError(err.response?.data?.message || 'Could not load users'))
    }, 250)
    return () => clearTimeout(handle)
  }, [search, role, status, page])

  const toggleStatus = async (target) => {
    const nextStatus = target.status === 'active' ? 'inactive' : 'active'
    try {
      await usersApi.setStatus(target.id, nextStatus)
      await loadUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update status')
    }
  }

  const deleteUser = async () => {
    try {
      await usersApi.remove(pendingDelete.id)
      setPendingDelete(null)
      await loadUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete user')
    }
  }

  return (
    <section className="page">
      <div className="detail-heading">
        <div className="page-heading">
          <h1>User Management</h1>
          <p>Manage dealership managers and sales executives.</p>
        </div>
        <Link className="primary-button compact" to="/users/new">
          <Plus size={17} />
          Add User
        </Link>
      </div>

      <div className="toolbar user-toolbar">
        <label className="search-box">
          <Search size={17} />
          <input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value) }} placeholder="Search name or email..." />
        </label>
        <select value={role} onChange={(event) => { setPage(1); setRole(event.target.value) }}>
          {filters.role.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
        <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value) }}>
          {filters.status.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="panel table-panel">
        <table className="users-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.role.replace('_', ' ')}</td>
                <td><span className={`status-pill ${item.status}`}>{item.status}</span></td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="row-actions">
                    <Link className="icon-button" title="Edit user" to={`/users/${item.id}/edit`}><Edit size={16} /></Link>
                    <Link className="icon-button" title="Reset password" to={`/users/${item.id}/reset-password`}><KeyRound size={16} /></Link>
                    <button className="secondary-button compact" type="button" onClick={() => toggleStatus(item)} disabled={item.id === currentUser?.id && item.status === 'active'}>
                      {item.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="icon-button danger-icon" type="button" title="Delete user" onClick={() => setPendingDelete(item)} disabled={item.id === currentUser?.id}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!users.length && (
              <tr>
                <td colSpan="6" className="empty">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button>
        <span>Page {page} of {pages}</span>
        <button type="button" disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>Next</button>
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title="Delete user"
          message={`Delete ${pendingDelete.name}? This cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setPendingDelete(null)}
          onConfirm={deleteUser}
        />
      )}
    </section>
  )
}
