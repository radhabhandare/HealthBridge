import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUsers, FaUser, FaEnvelope, FaPhone, 
  FaCalendarAlt, FaSearch, FaFilter, FaTrash,
  FaUserCheck, FaUserTimes, FaMale, FaFemale
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function AdminUsers() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/all-users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers(); // Refresh list
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.mobile?.includes(searchTerm);
    
    const matchesFilter = filter === "all" || 
                         (filter === "male" && user.gender === "Male") ||
                         (filter === "female" && user.gender === "Female");
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaUsers className="text-blue-400" />
            Manage Users
          </h1>
          <p className="text-gray-400 mt-2">
            Total Users: {users.length}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 rounded-lg transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-600/20 p-4 rounded-xl border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-400">{users.length}</div>
          <div className="text-sm text-gray-400">Total Users</div>
        </div>
        <div className="bg-green-600/20 p-4 rounded-xl border border-green-500/30">
          <div className="text-2xl font-bold text-green-400">
            {users.filter(u => u.gender === "Male").length}
          </div>
          <div className="text-sm text-gray-400">Male</div>
        </div>
        <div className="bg-purple-600/20 p-4 rounded-xl border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-400">
            {users.filter(u => u.gender === "Female").length}
          </div>
          <div className="text-sm text-gray-400">Female</div>
        </div>
        <div className="bg-yellow-600/20 p-4 rounded-xl border border-yellow-500/30">
          <div className="text-2xl font-bold text-yellow-400">
            {users.filter(u => !u.gender).length}
          </div>
          <div className="text-sm text-gray-400">Not Specified</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-white"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-white"
          >
            <option value="all">All Users</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-white/10">
              <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Gender</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-400">ID: {user._id.slice(-6)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <FaEnvelope className="text-gray-400" size={12} />
                      {user.email}
                    </div>
                    {user.mobile && (
                      <div className="flex items-center gap-2 text-sm">
                        <FaPhone className="text-gray-400" size={12} />
                        {user.mobile}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.gender ? (
                    <span className="flex items-center gap-2">
                      {user.gender === "Male" ? <FaMale className="text-blue-400" /> : <FaFemale className="text-pink-400" />}
                      {user.gender}
                    </span>
                  ) : (
                    <span className="text-gray-500">Not specified</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(user.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition"
                    title="Delete User"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <FaUsers className="text-4xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}