import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usersApi } from '../../api/users'
import UserForm from '../../components/UserForm'

export default function EditUser() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    usersApi.get(id).then((user) => setValues({ name: user.name, email: user.email, role: user.role, status: user.status }))
  }, [id])

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      await usersApi.update(id, values)
      navigate('/users')
    } catch (err) {
      setErrors(err.response?.data?.errors || { form: err.response?.data?.message || 'Could not update user' })
    } finally {
      setSaving(false)
    }
  }

  if (!values) return <section className="page"><p className="empty">Loading user...</p></section>

  return (
    <section className="page">
      <div className="page-heading">
        <h1>Edit User</h1>
        <p>Update profile, role, and access status.</p>
      </div>
      {errors.form && <div className="form-error">{errors.form}</div>}
      <UserForm mode="edit" values={values} errors={errors} saving={saving} onSubmit={submit} onChange={(key, value) => setValues((current) => ({ ...current, [key]: value }))} />
    </section>
  )
}
