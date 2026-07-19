import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usersApi } from '../../api/users'
import UserForm from '../../components/UserForm'

const initialValues = { name: '', email: '', password: '', role: 'sales_executive', status: 'active' }

export default function AddUser() {
  const navigate = useNavigate()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      await usersApi.create(values)
      navigate('/users')
    } catch (err) {
      setErrors(err.response?.data?.errors || { form: err.response?.data?.message || 'Could not create user' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <h1>Add User</h1>
        <p>Create a manager or sales executive account.</p>
      </div>
      {errors.form && <div className="form-error">{errors.form}</div>}
      <UserForm mode="create" values={values} errors={errors} saving={saving} onSubmit={submit} onChange={(key, value) => setValues((current) => ({ ...current, [key]: value }))} />
    </section>
  )
}
