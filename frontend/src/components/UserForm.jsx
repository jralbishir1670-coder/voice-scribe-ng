import { Loader2 } from 'lucide-react'

export default function UserForm({ mode, values, errors, saving, onChange, onSubmit }) {
  const showPassword = mode === 'create'

  return (
    <form className="panel form-panel" onSubmit={onSubmit}>
      <label>
        Full Name
        <input value={values.name} onChange={(event) => onChange('name', event.target.value)} placeholder="Full name" />
        {errors.name && <small>{errors.name}</small>}
      </label>
      <label>
        Email
        <input type="email" value={values.email} onChange={(event) => onChange('email', event.target.value)} placeholder="email@dealership.ng" />
        {errors.email && <small>{errors.email}</small>}
      </label>
      {showPassword && (
        <label>
          Password
          <input type="password" value={values.password} onChange={(event) => onChange('password', event.target.value)} placeholder="Minimum 8 characters" />
          {errors.password && <small>{errors.password}</small>}
        </label>
      )}
      <div className="form-grid">
        <label>
          Role
          <select value={values.role} onChange={(event) => onChange('role', event.target.value)}>
            <option value="manager">Manager</option>
            <option value="sales_executive">Sales Executive</option>
          </select>
          {errors.role && <small>{errors.role}</small>}
        </label>
        <label>
          Status
          <select value={values.status} onChange={(event) => onChange('status', event.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && <small>{errors.status}</small>}
        </label>
      </div>
      <button className="primary-button" type="submit" disabled={saving}>
        {saving && <Loader2 size={17} className="spin" />}
        {mode === 'create' ? 'Create User' : 'Save Changes'}
      </button>
    </form>
  )
}
