import React, { useState, useEffect } from 'react';
import { Search, Shield, UserX, UserCheck } from 'lucide-react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/users?search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const toggleStatus = async (userId) => {
    try {
      const res = await API.put(`/admin/users/${userId}/toggle-status`);
      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchUsers();
      }
    } catch (error) {
      showToast('Failed to toggle status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-rose-100 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-glow-600">User Access Management</span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Registered Customers</h1>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user name or email..."
          className="w-full bg-white border border-rose-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-glow-500 shadow-sm"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
            <tr>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Joined Date</th>
              <th className="p-3">Account Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-rose-50/30">
                <td className="p-3 font-bold text-slate-800">{u.name}</td>
                <td className="p-3 text-slate-600">{u.email}</td>
                <td className="p-3 text-slate-500">{u.phone || 'N/A'}</td>
                <td className="p-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {u.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => toggleStatus(u._id)}
                    className="text-xs font-bold text-slate-600 hover:text-glow-600 underline"
                  >
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
