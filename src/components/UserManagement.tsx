import React, { useState } from 'react'
import { PlusCircle, Edit, Trash } from 'lucide-react'

type User = {
  id: number
  username: string
  email: string
  role: 'admin' | 'manager' | 'user'
}

type UserManagementProps = {
  users: User[]
  onAddUser: (user: Omit<User, 'id'>) => void
  onEditUser: (user: User) => void
  onDeleteUser: (userId: number) => void
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
}) => {
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    username: '',
    email: '',
    role: 'user',
  })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value })
    } else {
      setNewUser((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      onEditUser(editingUser)
      setEditingUser(null)
    } else {
      onAddUser(newUser)
      setNewUser({ username: '', email: '', role: 'user' })
    }
    setShowForm(false)
  }

  const handleEditClick = (user: User) => {
    setEditingUser(user)
    setShowForm(true)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4 flex items-center"
        onClick={() => {
          setShowForm(!showForm)
          setEditingUser(null)
        }}
      >
        <PlusCircle className="mr-2" />
        {showForm && !editingUser ? 'Hide Form' : 'Add New User'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label htmlFor="username" className="block mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={editingUser ? editingUser.username : newUser.username}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={editingUser ? editingUser.email : newUser.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="role" className="block mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={editingUser ? editingUser.role : newUser.role}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            {editingUser ? 'Update User' : 'Add User'}
          </button>
        </form>
      )}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">User List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 border">{user.username}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{user.role}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="mr-2 p-1 bg-blue-500 text-white rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="p-1 bg-red-500 text-white rounded"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserManagement