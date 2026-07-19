import api from './client'

export const usersApi = {
  list(params) {
    return api.get('/users', { params }).then((response) => response.data)
  },
  get(id) {
    return api.get(`/users/${id}`).then((response) => response.data.user)
  },
  create(payload) {
    return api.post('/users', payload).then((response) => response.data)
  },
  update(id, payload) {
    return api.put(`/users/${id}`, payload).then((response) => response.data)
  },
  resetPassword(id, password) {
    return api.post(`/users/${id}/reset-password`, { password }).then((response) => response.data)
  },
  setStatus(id, status) {
    return api.patch(`/users/${id}/status`, { status }).then((response) => response.data)
  },
  remove(id) {
    return api.delete(`/users/${id}`).then((response) => response.data)
  },
}
