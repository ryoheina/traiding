"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Upload,
  Image as ImageIcon,
  FileArchive
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  rar_file_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function TeamPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    rar_file_url: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingRar, setUploadingRar] = useState(false);

  useEffect(() => {
    checkUserAccess();
  }, []);

  const checkUserAccess = async () => {
    try {
      // Check if user is logged in and approved
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        if (data.user && data.user.approval_status === 'approved') {
          setIsAuthenticated(true);
          setUserStatus('approved');
          // Check if admin (you can customize this logic)
          if (data.user.email === 'aivideo7775@gmail.com') {
            setIsAdmin(true);
          }
          fetchProjects();
        } else {
          setUserStatus(data.user?.approval_status || 'not_logged_in');
        }
      } else {
        setUserStatus('not_logged_in');
      }
    } catch (error) {
      console.error('Failed to check user access:', error);
      setUserStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleFileUpload = async (file: File, type: 'image' | 'rar') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.fileUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image_url;
      let rarUrl = formData.rar_file_url;

      // Handle image upload if file provided
      const imageInput = document.getElementById('image-file') as HTMLInputElement;
      if (imageInput?.files?.[0]) {
        setUploadingImage(true);
        imageUrl = await handleFileUpload(imageInput.files[0], 'image');
        setUploadingImage(false);
      }

      // Handle RAR upload if file provided
      const rarInput = document.getElementById('rar-file') as HTMLInputElement;
      if (rarInput?.files?.[0]) {
        setUploadingRar(true);
        rarUrl = await handleFileUpload(rarInput.files[0], 'rar');
        setUploadingRar(false);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        image_url: imageUrl,
        rar_file_url: rarUrl,
        status: 'active'
      };

      let response;
      if (editingProject) {
        response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        setNotification({ type: 'success', message: editingProject ? 'Project updated successfully' : 'Project created successfully' });
        setFormData({ title: '', description: '', image_url: '', rar_file_url: '' });
        setEditingProject(null);
        setShowAdminPanel(false);
        fetchProjects();
      } else {
        throw new Error('Failed to save project');
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to save project' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotification({ type: 'success', message: 'Project deleted successfully' });
        fetchProjects();
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to delete project' });
    }
  };

  const handleDownload = async (rarUrl: string) => {
    try {
      const response = await fetch(`/api/download${rarUrl}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = rarUrl.split('/').pop() || 'project.rar';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to download file' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Restricted</h1>
          <p className="text-blue-200 mb-6">
            {userStatus === 'not_logged_in' 
              ? 'Please log in to access the team page.'
              : userStatus === 'pending'
              ? 'Your account is pending approval.'
              : userStatus === 'rejected'
              ? 'Your account has been rejected.'
              : 'You do not have access to this page.'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      {/* 3D Blue Animation Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-blue-700/20 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        
        {/* Grid lines effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Team Projects</h1>
                <p className="text-blue-200 mt-1">View and download project resources</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setFormData({ title: '', description: '', image_url: '', rar_file_url: '' });
                    setShowAdminPanel(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Project</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Projects Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <FileArchive className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <p className="text-blue-200 text-lg">No projects available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all group"
                >
                  <div 
                    className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 cursor-pointer"
                    onClick={() => project.rar_file_url && handleDownload(project.rar_file_url)}
                  >
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Download className="w-12 h-12 text-white" />
                    </div>
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProject(project);
                            setFormData({
                              title: project.title,
                              description: project.description,
                              image_url: project.image_url,
                              rar_file_url: project.rar_file_url
                            });
                            setShowAdminPanel(true);
                          }}
                          className="p-2 bg-white/90 text-blue-900 rounded-lg hover:bg-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project.id);
                          }}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-blue-200 text-sm line-clamp-2">{project.description}</p>
                    {project.rar_file_url && (
                      <button
                        onClick={() => handleDownload(project.rar_file_url)}
                        className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download RAR</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white/10 backdrop-blur-lg border-t border-white/20 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <p className="text-blue-200">
                Connected to Me
              </p>
              <a 
                href="mailto:aivideo7775@gmail.com"
                className="text-blue-300 hover:text-white transition-colors"
              >
                aivideo7775@gmail.com
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProject ? 'Edit Project' : 'Add Project'}
              </h2>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Image
                </label>
                <input
                  type="file"
                  id="image-file"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {uploadingImage && (
                  <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RAR File
                </label>
                <input
                  type="file"
                  id="rar-file"
                  accept=".rar"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {uploadingRar && (
                  <p className="text-sm text-blue-600 mt-1">Uploading RAR file...</p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdminPanel(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage || uploadingRar}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          {notification.message}
        </motion.div>
      )}

      <style jsx global>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
}
