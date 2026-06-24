"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Shield,
  Edit,
  Save,
  LogOut
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    bio: "Professional trader with 5+ years of experience in forex and commodities markets."
  });

  const handleSave = () => {
    // TODO: Save profile data to backend
    setIsEditing(false);
  };

  const stats = [
    { label: "Member Since", value: "Jan 2024", icon: Calendar },
    { label: "Projects Completed", value: "12", icon: User },
    { label: "Account Status", value: "Approved", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wolf-50 via-white to-wolf-100 dark:from-wolf-950 dark:via-wolf-900 dark:to-wolf-950">
      {/* Header */}
      <header className="bg-white dark:bg-wolf-900 border-b border-wolf-200 dark:border-wolf-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="font-display text-xl font-bold text-wolf-900 dark:text-white">
                Profile
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center space-x-2 text-wolf-600 dark:text-wolf-400 hover:text-wolf-900 dark:hover:text-white"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <div className="bg-white dark:bg-wolf-900 rounded-2xl shadow-lg border border-wolf-200 dark:border-wolf-800 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-32 h-32 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                {formData.fullName.charAt(0)}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="font-display text-3xl font-bold text-wolf-900 dark:text-white mb-2">
                  {formData.fullName}
                </h1>
                <p className="text-wolf-600 dark:text-wolf-400 mb-4">{formData.bio}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center space-x-2 text-sm text-wolf-600 dark:text-wolf-400">
                      <stat.icon className="w-4 h-4" />
                      <span>{stat.label}: {stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 bg-wolf-100 dark:bg-wolf-800 text-wolf-700 dark:text-wolf-300 rounded-lg hover:bg-wolf-200 dark:hover:bg-wolf-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white dark:bg-wolf-900 rounded-2xl shadow-lg border border-wolf-200 dark:border-wolf-800 p-8">
            <h2 className="font-display text-2xl font-bold text-wolf-900 dark:text-white mb-6">
              Profile Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-wolf-900 dark:text-white mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-wolf-50 dark:bg-wolf-800 border border-wolf-200 dark:border-wolf-700 rounded-lg text-wolf-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-wolf-50 dark:bg-wolf-800 rounded-lg">
                    <User className="w-5 h-5 text-wolf-400" />
                    <span className="text-wolf-900 dark:text-white">{formData.fullName}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-wolf-900 dark:text-white mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-wolf-50 dark:bg-wolf-800 border border-wolf-200 dark:border-wolf-700 rounded-lg text-wolf-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-wolf-50 dark:bg-wolf-800 rounded-lg">
                    <Mail className="w-5 h-5 text-wolf-400" />
                    <span className="text-wolf-900 dark:text-white">{formData.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-wolf-900 dark:text-white mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-wolf-50 dark:bg-wolf-800 border border-wolf-200 dark:border-wolf-700 rounded-lg text-wolf-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-wolf-50 dark:bg-wolf-800 rounded-lg">
                    <Phone className="w-5 h-5 text-wolf-400" />
                    <span className="text-wolf-900 dark:text-white">{formData.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-wolf-900 dark:text-white mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-wolf-50 dark:bg-wolf-800 border border-wolf-200 dark:border-wolf-700 rounded-lg text-wolf-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-wolf-50 dark:bg-wolf-800 rounded-lg">
                    <MapPin className="w-5 h-5 text-wolf-400" />
                    <span className="text-wolf-900 dark:text-white">{formData.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-wolf-900 dark:text-white mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-wolf-50 dark:bg-wolf-800 border border-wolf-200 dark:border-wolf-700 rounded-lg text-wolf-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
                />
              ) : (
                <div className="p-4 bg-wolf-50 dark:bg-wolf-800 rounded-lg">
                  <p className="text-wolf-900 dark:text-white">{formData.bio}</p>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>

          {/* Security Settings */}
          <div className="bg-white dark:bg-wolf-900 rounded-2xl shadow-lg border border-wolf-200 dark:border-wolf-800 p-8">
            <h2 className="font-display text-2xl font-bold text-wolf-900 dark:text-white mb-6">
              Security Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-wolf-50 dark:bg-wolf-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="font-medium text-wolf-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-wolf-600 dark:text-wolf-400">Add an extra layer of security</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors">
                  Enable
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-wolf-50 dark:bg-wolf-800 rounded-lg">
                <div>
                  <p className="font-medium text-wolf-900 dark:text-white">Change Password</p>
                  <p className="text-sm text-wolf-600 dark:text-wolf-400">Update your password regularly</p>
                </div>
                <button className="px-4 py-2 border border-wolf-200 dark:border-wolf-700 text-wolf-700 dark:text-wolf-300 rounded-lg hover:bg-wolf-100 dark:hover:bg-wolf-700 transition-colors">
                  Change
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
