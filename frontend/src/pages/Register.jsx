import { Loader2, Mic2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'

export default function Register() {
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const setValue = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const validate = () => {
    const nextErrors = {}
    if (values.name.trim().length < 2) nextErrors.name = 'Full name is required'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email.trim())) nextErrors.email = 'Enter a valid email address'
    if (values.password.length < 8) nextErrors.password = 'Password must be at least 8 characters'
    if (values.password !== values.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match'
    return nextErrors
  }

  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      await api.post('/auth/register', {
        name: values.name,
        email: values.email,
        password: values.password,
      })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setErrors(err.response?.data?.errors || { form: err.response?.data?.message || 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <form className="login-card auth-card-wide" onSubmit={submit}>
        <div className="login-logo">
          <Mic2 size={30} />
        </div>
        <h1>Create Account</h1>
        <p>Sign up as a sales executive. Manager accounts are created by dealership managers.</p>
        <label>
          Full Name
          <input value={values.name} onChange={(event) => setValue('name', event.target.value)} required />
          {errors.name && <small className="field-error">{errors.name}</small>}
        </label>
        <label>
          Email
          <input type="email" value={values.email} onChange={(event) => setValue('email', event.target.value)} required />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </label>
        <label>
          Password
          <input type="password" value={values.password} onChange={(event) => setValue('password', event.target.value)} required />
          {errors.password && <small className="field-error">{errors.password}</small>}
        </label>
        <label>
          Confirm Password
          <input type="password" value={values.confirmPassword} onChange={(event) => setValue('confirmPassword', event.target.value)} required />
          {errors.confirmPassword && <small className="field-error">{errors.confirmPassword}</small>}
        </label>
        {errors.form && <div className="form-error">{errors.form}</div>}
        <button className="primary-button" type="submit" disabled={loading}>
          {loading && <Loader2 className="spin" size={18} />}
          Sign up
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  )
}
