"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Filter,
  Check,
  X,
  Shield,
  AlertTriangle,
  Trash2,
  Smartphone,
  Monitor
} from "lucide-react";
import Link from "next/link";

interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  approval_status: "pending" | "approved" | "rejected" | "suspended";
  created_at: string;
  device_info: any;
  browser_info: any;
  ip_address: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    suspended: 0
  });
  const [loading, setLoading] = useState(true);
  const [approvingUserId, setApprovingUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ userId: number; userName: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Only fetch users if authenticated
    if (isAuthenticated) {
      fetchUsers();
      
      // Poll for new users every 5 seconds
      const interval = setInterval(() => {
        fetchUsers();
      }, 5000);
      
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        user =>
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.approval_status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, statusFilter, users]);

  const fetchUsers = async () => {
    try {
      console.log('[FETCH-USERS] Fetching users from /api/admin/users');
      const cacheBuster = Date.now();
      const response = await fetch(`/api/admin/users?_t=${cacheBuster}`, { cache: 'no-store' });
      const data = await response.json();
      
      console.log('[FETCH-USERS] Response status:', response.status);
      console.log('[FETCH-USERS] Response data users:', data.users);
      console.log('[FETCH-USERS] State before update:', users.map((u: User) => ({ id: u.id, status: u.approval_status })));
      
      if (response.ok) {
        console.log('[FETCH-USERS] Updating state with new users:', data.users.map((u: User) => ({ id: u.id, status: u.approval_status })));
        setUsers(data.users);
        setFilteredUsers(data.users);
        setStats(data.stats);
        console.log('[FETCH-USERS] State updated successfully');
      } else {
        console.error('[FETCH-USERS] Failed to fetch users:', data.error);
      }
    } catch (error) {
      console.error("[FETCH-USERS] Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId: number, action: "approve" | "reject" | "suspend") => {
    try {
      setApprovingUserId(userId);
      console.log('[APPROVAL] Request sent:', { userId, action });
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      console.log('[APPROVAL] Response status:', response.status);
      const data = await response.json();
      console.log('[APPROVAL] Response data:', data);

      if (response.ok) {
        console.log('[APPROVAL] Approval successful, calling fetchUsers()');
        await fetchUsers();
        console.log('[APPROVAL] fetchUsers() completed');
        
        const actionText = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'suspended';
        setNotification({ type: 'success', message: `User ${actionText} successfully` });
        setTimeout(() => setNotification(null), 3000);
      } else {
        console.error('[APPROVAL] Approval failed:', data.error);
        setNotification({ type: 'error', message: data.error || 'Failed to update user status' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error("[APPROVAL] Failed to update user status:", error);
      setNotification({ type: 'error', message: 'Network error. Please try again.' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setApprovingUserId(null);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      setDeletingUserId(userId);
      console.log('[DELETE] Request sent:', { userId });
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      console.log('[DELETE] Response status:', response.status);
      const data = await response.json();
      console.log('[DELETE] Response data:', data);

      if (response.ok) {
        console.log('[DELETE] Delete successful, calling fetchUsers()');
        await fetchUsers();
        console.log('[DELETE] fetchUsers() completed');
        
        setNotification({ type: 'success', message: 'User deleted successfully' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        console.error('[DELETE] Delete failed:', data.error);
        setNotification({ type: 'error', message: data.error || 'Failed to delete user' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error("[DELETE] Failed to delete user:", error);
      setNotification({ type: 'error', message: 'Network error. Please try again.' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setDeletingUserId(null);
      setShowDeleteConfirm(null);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError('');

    // Simple password verification - in production, use proper authentication
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rlaeoqja20070925';

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setPasswordError('Incorrect password');
      setPassword('');
    }

    setIsVerifying(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "suspended":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wolf-50 dark:bg-wolf-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wolf-50 via-white to-wolf-100 dark:from-wolf-950 dark:via-wolf-900 dark:to-wolf-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-wolf-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-wolf-900 dark:text-white mb-2">Admin Access</h1>
            <p className="text-wolf-600 dark:text-wolf-400">Enter password to access admin dashboard</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-wolf-700 dark:text-wolf-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-wolf-300 dark:border-wolf-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent bg-white dark:bg-wolf-900 text-wolf-900 dark:text-white"
                placeholder="Enter admin password"
                disabled={isVerifying}
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying || !password}
              className="w-full py-3 px-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-lg hover:from-gold-600 hover:to-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-wolf-500 dark:text-wolf-400">
            Password: rlaeoqja20070925
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wolf-50 via-white to-wolf-100 dark:from-wolf-950 dark:via-wolf-900 dark:to-wolf-950">
      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          {notification.message}
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-wolf-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-wolf-900 dark:text-white">
                Delete User
              </h3>
            </div>
            <p className="text-wolf-600 dark:text-wolf-400 mb-6">
              Are you sure you want to delete <strong>{showDeleteConfirm.userName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-wolf-600 dark:text-wolf-400 hover:bg-wolf-100 dark:hover:bg-wolf-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm.userId)}
                disabled={deletingUserId === showDeleteConfirm.userId}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingUserId === showDeleteConfirm.userId ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-wolf-900 border-b border-wolf-200 dark:border-wolf-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-wolf-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-wolf-500 dark:text-wolf-400">Wolf Trading</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-wolf-600 dark:text-wolf-400 hover:text-wolf-900 dark:hover:text-white"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-wolf-900 rounded-xl p-6 shadow-lg border border-wolf-200 dark:border-wolf-800"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-gold-500" />
              <span className="text-2xl font-bold text-wolf-900 dark:text-white">{stats.total}</span>
            </div>
            <p className="text-sm text-wolf-600 dark:text-wolf-400">Total Users</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-wolf-900 rounded-xl p-6 shadow-lg border border-wolf-200 dark:border-wolf-800"
          >
            <div className="flex items-center justify-between mb-4">
              <UserCheck className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-wolf-900 dark:text-white">{stats.approved}</span>
            </div>
            <p className="text-sm text-wolf-600 dark:text-wolf-400">Approved</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-wolf-900 rounded-xl p-6 shadow-lg border border-wolf-200 dark:border-wolf-800"
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-wolf-900 dark:text-white">{stats.pending}</span>
            </div>
            <p className="text-sm text-wolf-600 dark:text-wolf-400">Pending</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-wolf-900 rounded-xl p-6 shadow-lg border border-wolf-200 dark:border-wolf-800"
          >
            <div className="flex items-center justify-between mb-4">
              <UserX className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold text-wolf-900 dark:text-white">{stats.rejected}</span>
            </div>
            <p className="text-sm text-wolf-600 dark:text-wolf-400">Rejected</p>
          </motion.div>
        </div>

        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-wolf-900 rounded-xl shadow-lg border border-wolf-200 dark:border-wolf-800"
        >
          <div className="p-6 border-b border-wolf-200 dark:border-wolf-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-wolf-900 dark:text-white">
                User Management
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-wolf-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-wolf-50 dark:bg-wolf-800 border border-wolf-200 dark:border-wolf-700 rounded-lg text-wolf-900 dark:text-white placeholder-wolf-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-wolf-50 dark:bg-wolf-800 border border-wolf-200 dark:border-wolf-700 rounded-lg text-wolf-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-wolf-50 dark:bg-wolf-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-wolf-600 dark:text-wolf-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-wolf-600 dark:text-wolf-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-wolf-600 dark:text-wolf-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-wolf-600 dark:text-wolf-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-wolf-600 dark:text-wolf-400 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-wolf-600 dark:text-wolf-400 uppercase tracking-wider">
                    Device/IP
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-wolf-600 dark:text-wolf-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wolf-200 dark:divide-wolf-800">
                {filteredUsers.map((user) => {
                  console.log('[RENDER] Rendering user:', { id: user.id, status: user.approval_status });
                  return (
                    <tr key={user.id} className="hover:bg-wolf-50 dark:hover:bg-wolf-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-wolf-900 dark:text-white">{user.full_name}</p>
                            <p className="text-sm text-wolf-500 dark:text-wolf-400">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-wolf-900 dark:text-white">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-wolf-900 dark:text-white">{user.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.approval_status)}`}>
                          {user.approval_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-wolf-600 dark:text-wolf-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-wolf-600 dark:text-wolf-400">
                        <div className="flex items-center space-x-2">
                          {user.device_info?.type === 'mobile' || user.device_info?.type === 'phone' ? (
                            <Smartphone className="w-4 h-4" />
                          ) : user.device_info?.type === 'desktop' || user.device_info?.type === 'web' ? (
                            <Monitor className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                          <span className="capitalize">{user.device_info?.type || "Unknown"}</span>
                        </div>
                        <p className="text-xs mt-1">{user.ip_address || "Unknown"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          {user.approval_status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApproval(user.id, "approve")}
                                disabled={approvingUserId === user.id}
                                className={`p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors ${
                                  approvingUserId === user.id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title="Approve"
                              >
                                {approvingUserId === user.id ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600" />
                                ) : (
                                  <Check className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleApproval(user.id, "reject")}
                                disabled={approvingUserId === user.id}
                                className={`p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors ${
                                  approvingUserId === user.id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title="Reject"
                              >
                                {approvingUserId === user.id ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600" />
                                ) : (
                                  <X className="w-5 h-5" />
                                )}
                              </button>
                            </>
                          )}
                          {user.approval_status === "approved" && (
                            <button
                              onClick={() => handleApproval(user.id, "suspend")}
                              disabled={approvingUserId === user.id}
                              className={`p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors ${
                                approvingUserId === user.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title="Suspend"
                            >
                              {approvingUserId === user.id ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />
                              ) : (
                                <Shield className="w-5 h-5" />
                              )}
                            </button>
                          )}
                          {user.approval_status === "suspended" && (
                            <button
                              onClick={() => handleApproval(user.id, "approve")}
                              disabled={approvingUserId === user.id}
                              className={`p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors ${
                                approvingUserId === user.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title="Reactivate"
                            >
                              {approvingUserId === user.id ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600" />
                              ) : (
                                <UserCheck className="w-5 h-5" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => setShowDeleteConfirm({ userId: user.id, userName: user.full_name })}
                            disabled={deletingUserId === user.id}
                            className={`p-2 text-gray-600 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors ${
                              deletingUserId === user.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title="Delete User"
                          >
                            {deletingUserId === user.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-wolf-400 mx-auto mb-4" />
              <p className="text-wolf-600 dark:text-wolf-400">No users found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
