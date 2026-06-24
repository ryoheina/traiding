"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  BookOpen,
  TrendingUp,
  Download,
  User,
  Bell,
  LogOut,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Welcome to Wolf Trading!", message: "Your account has been approved.", type: "success", read: false },
    { id: 2, title: "New Market Analysis", message: "Weekly market report is now available.", type: "info", read: false },
  ]);

  const projects = [
    { id: 1, title: "Q1 Trading Strategy", status: "completed", progress: 100 },
    { id: 2, title: "Risk Management Framework", status: "active", progress: 75 },
    { id: 3, title: "Market Analysis Tool", status: "active", progress: 45 },
  ];

  const resources = [
    { id: 1, title: "Trading Fundamentals Guide", category: "Education", type: "PDF" },
    { id: 2, title: "Technical Analysis Masterclass", category: "Video", type: "MP4" },
    { id: 3, title: "Risk Management Strategies", category: "Guide", type: "PDF" },
    { id: 4, title: "Market Psychology Webinar", category: "Video", type: "MP4" },
  ];

  const marketReports = [
    { id: 1, title: "Weekly Market Outlook", date: "2024-01-15", summary: "Bullish trends expected in forex markets..." },
    { id: 2, title: "Cryptocurrency Analysis", date: "2024-01-14", summary: "Bitcoin showing strong resistance at $45k..." },
    { id: 3, title: "Stock Market Review", date: "2024-01-13", summary: "Tech stocks leading the rally..." },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "resources", label: "Resources", icon: BookOpen },
    { id: "analysis", label: "Market Analysis", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wolf-50 via-white to-wolf-100 dark:from-wolf-950 dark:via-wolf-900 dark:to-wolf-950">
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
                  Member Dashboard
                </h1>
                <p className="text-sm text-wolf-500 dark:text-wolf-400">Wolf Trading</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-wolf-600 dark:text-wolf-400 hover:text-wolf-900 dark:hover:text-white">
                <Bell className="w-6 h-6" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <Link
                href="/profile"
                className="flex items-center space-x-2 text-wolf-600 dark:text-wolf-400 hover:text-wolf-900 dark:hover:text-white"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64">
            <nav className="bg-white dark:bg-wolf-900 rounded-xl shadow-lg border border-wolf-200 dark:border-wolf-800 p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                    activeTab === tab.id
                      ? "bg-gold-500 text-white"
                      : "text-wolf-600 dark:text-wolf-400 hover:bg-wolf-100 dark:hover:bg-wolf-800"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Notifications Panel */}
            <div className="mt-6 bg-white dark:bg-wolf-900 rounded-xl shadow-lg border border-wolf-200 dark:border-wolf-800 p-4">
              <h3 className="font-semibold text-wolf-900 dark:text-white mb-4">Notifications</h3>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.read
                        ? "bg-wolf-50 dark:bg-wolf-800"
                        : "bg-gold-50 dark:bg-gold-900/20 border-l-2 border-gold-500"
                    }`}
                  >
                    <p className="font-medium text-wolf-900 dark:text-white text-sm">
                      {notification.title}
                    </p>
                    <p className="text-xs text-wolf-600 dark:text-wolf-400 mt-1">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-wolf-900 rounded-xl shadow-lg border border-wolf-200 dark:border-wolf-800 p-6">
                  <h2 className="font-display text-2xl font-bold text-wolf-900 dark:text-white mb-4">
                    Welcome Back!
                  </h2>
                  <p className="text-wolf-600 dark:text-wolf-400 mb-6">
                    Here&apos;s what&apos;s happening with your trading journey.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl p-6 text-white">
                      <TrendingUp className="w-8 h-8 mb-2" />
                      <p className="text-3xl font-bold">+127%</p>
                      <p className="text-sm opacity-90">Portfolio Growth</p>
                    </div>
                    <div className="bg-wolf-100 dark:bg-wolf-800 rounded-xl p-6">
                      <FolderOpen className="w-8 h-8 text-gold-500 mb-2" />
                      <p className="text-3xl font-bold text-wolf-900 dark:text-white">{projects.length}</p>
                      <p className="text-sm text-wolf-600 dark:text-wolf-400">Active Projects</p>
                    </div>
                    <div className="bg-wolf-100 dark:bg-wolf-800 rounded-xl p-6">
                      <BookOpen className="w-8 h-8 text-gold-500 mb-2" />
                      <p className="text-3xl font-bold text-wolf-900 dark:text-white">{resources.length}</p>
                      <p className="text-sm text-wolf-600 dark:text-wolf-400">Resources Available</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-wolf-900 rounded-xl shadow-lg border border-wolf-200 dark:border-wolf-800 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-wolf-900 dark:text-white">Recent Projects</h3>
                    <button
                      onClick={() => setActiveTab("projects")}
                      className="text-gold-600 hover:text-gold-700 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {projects.slice(0, 2).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-wolf-50 dark:bg-wolf-800 rounded-lg">
                        <div>
                          <p className="font-medium text-wolf-900 dark:text-white">{project.title}</p>
                          <p className="text-sm text-wolf-600 dark:text-wolf-400">{project.status}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 h-2 bg-wolf-200 dark:bg-wolf-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gold-500"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-wolf-600 dark:text-wolf-400">{project.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "projects" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-wolf-900 rounded-xl shadow-lg border border-wolf-200 dark:border-wolf-800 p-6"
              >
                <h2 className="font-display text-2xl font-bold text-wolf-900 dark:text-white mb-6">
                  Projects
                </h2>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="p-6 bg-wolf-50 dark:bg-wolf-800 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-wolf-900 dark:text-white">{project.title}</h3>
                          <p className="text-sm text-wolf-600 dark:text-wolf-400 capitalize">{project.status}</p>
                        </div>
                        <span className="px-3 py-1 bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 rounded-full text-xs font-semibold">
                          {project.progress}% Complete
                        </span>
                      </div>
                      <div className="w-full h-2 bg-wolf-200 dark:bg-wolf-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold-500 to-gold-600 transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "resources" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-wolf-900 rounded-xl shadow-lg border border-wolf-200 dark:border-wolf-800 p-6"
              >
                <h2 className="font-display text-2xl font-bold text-wolf-900 dark:text-white mb-6">
                  Educational Resources
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {resources.map((resource) => (
                    <div key={resource.id} className="p-6 bg-wolf-50 dark:bg-wolf-800 rounded-lg hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="px-2 py-1 bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 rounded text-xs font-semibold">
                            {resource.category}
                          </span>
                          <h3 className="font-semibold text-wolf-900 dark:text-white mt-2">{resource.title}</h3>
                        </div>
                        <span className="px-2 py-1 bg-wolf-200 dark:bg-wolf-700 text-wolf-600 dark:text-wolf-400 rounded text-xs">
                          {resource.type}
                        </span>
                      </div>
                      <button className="flex items-center space-x-2 text-gold-600 hover:text-gold-700 font-medium">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "analysis" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-wolf-900 rounded-xl shadow-lg border border-wolf-200 dark:border-wolf-800 p-6"
              >
                <h2 className="font-display text-2xl font-bold text-wolf-900 dark:text-white mb-6">
                  Market Analysis Reports
                </h2>
                <div className="space-y-4">
                  {marketReports.map((report) => (
                    <div key={report.id} className="p-6 bg-wolf-50 dark:bg-wolf-800 rounded-lg hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-wolf-900 dark:text-white">{report.title}</h3>
                        <span className="text-sm text-wolf-600 dark:text-wolf-400">{report.date}</span>
                      </div>
                      <p className="text-sm text-wolf-600 dark:text-wolf-400 mb-4">{report.summary}</p>
                      <button className="flex items-center space-x-2 text-gold-600 hover:text-gold-700 font-medium">
                        <span>Read Full Report</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
