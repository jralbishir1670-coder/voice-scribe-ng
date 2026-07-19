import { Navigate, Route, Routes } from 'react-router-dom'
import ManagerRoute from './components/ManagerRoute'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import TranscriptDetail from './pages/TranscriptDetail'
import Transcripts from './pages/Transcripts'
import Upload from './pages/Upload'
import AddUser from './pages/users/AddUser'
import EditUser from './pages/users/EditUser'
import ResetPassword from './pages/users/ResetPassword'
import UserList from './pages/users/UserList'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/transcripts" element={<Transcripts />} />
          <Route path="/transcripts/:id" element={<TranscriptDetail />} />
          <Route element={<ManagerRoute />}>
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<AddUser />} />
            <Route path="/users/:id/edit" element={<EditUser />} />
            <Route path="/users/:id/reset-password" element={<ResetPassword />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
