import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usersApi } from '../../api/users'

export default function ResetPassword() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    usersApi.get(id).then(setUser)
  }, [id])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      await usersApi.resetPassword(id, password)
      navigate('/users')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <h1>Reset Password</h1>
        <p>{user ? `Set a new password for ${user.name}.` : 'Loading user...'}</p>
      </div>
      {error && <div className="form-error">{error}</div>}
      <form className="panel form-panel" onSubmit={submit}>
        <label>
          New Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <label>
          Confirm Password
          <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        </label>
        <button className="primary-button" type="submit" disabled={saving}>
          {saving && <Loader2 size={17} className="spin" />}
          Reset Password
        </button>
      </form>
    </section>
  )
}
