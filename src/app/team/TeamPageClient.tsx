"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Upload,
  Image as ImageIcon,
  FileArchive,
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  Calendar,
  Download,
  FolderOpen,
  Sparkles,
  CheckCircle2
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
  images?: Array<{
    id: number;
    image_url: string;
    display_order: number;
  }>;
}

interface TeamPageClientProps {
  isAdmin: boolean;
  userEmail: string;
}

export default function TeamPageClient({ isAdmin, userEmail }: TeamPageClientProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Search, filter, sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  
  // Image carousel state
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    rar_file_url: '',
    images: [] as string[]
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingRar, setUploadingRar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Filter and sort projects
    let filtered = projects;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    
    setFilteredProjects(filtered);
  }, [projects, searchQuery, sortBy]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
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

  const handleMultipleImageUpload = async (files: File[]) => {
    setUploadingImage(true);
    try {
      const uploadedUrls = await Promise.all(
        files.map(file => handleFileUpload(file, 'image'))
      );
      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedUrls]
      });
    } catch (error) {
      console.error('Failed to upload images:', error);
      setNotification({ type: 'error', message: 'Failed to upload images' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || uploadingImage || uploadingRar) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = formData.images.length > 0 ? formData.images[0] : formData.image_url;
      let rarUrl = formData.rar_file_url;

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
        status: 'active',
        images: formData.images
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
        setFormData({ title: '', description: '', image_url: '', rar_file_url: '', images: [] });
        setEditingProject(null);
        setShowAdminPanel(false);
        fetchProjects();
        
        // Clear file inputs
        const imageInput = document.getElementById('image-file') as HTMLInputElement;
        if (imageInput) imageInput.value = '';
        const rarInput = document.getElementById('rar-file') as HTMLInputElement;
        if (rarInput) rarInput.value = '';
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save project');
      }
    } catch (error: any) {
      console.error('Failed to save project:', error);
      setNotification({ type: 'error', message: error.message || 'Failed to save project' });
    } finally {
      setIsSubmitting(false);
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
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      setNotification({ type: 'error', message: error.message || 'Failed to delete project' });
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
          </div>
          
          {/* Controls Skeleton */}
          <div className="flex gap-4 mb-8">
            <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse" />
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-gray-500" />
                Team Projects
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingProject(null);
                  setFormData({ title: '', description: '', image_url: '', rar_file_url: '', images: [] });
                  setShowAdminPanel(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter & Sort */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Sort</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => { setSortBy('newest'); setShowSortDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${sortBy === 'newest' ? 'bg-gray-50 text-gray-900' : 'text-gray-700'}`}
                    >
                      Newest first
                    </button>
                    <button
                      onClick={() => { setSortBy('oldest'); setShowSortDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${sortBy === 'oldest' ? 'bg-gray-50 text-gray-900' : 'text-gray-700'}`}
                    >
                      Oldest first
                    </button>
                    <button
                      onClick={() => { setSortBy('name'); setShowSortDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${sortBy === 'name' ? 'bg-gray-50 text-gray-900' : 'text-gray-700'}`}
                    >
                      Name A-Z
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
            </p>
            {!searchQuery && isAdmin && (
              <button
                onClick={() => {
                  setEditingProject(null);
                  setFormData({ title: '', description: '', image_url: '', rar_file_url: '', images: [] });
                  setShowAdminPanel(true);
                }}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
              >
                {/* Project Image Carousel */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {project.images && project.images.length > 0 ? (
                    <>
                      <img
                        src={project.images[currentImageIndices[project.id] || 0]?.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Carousel Navigation */}
                      {project.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndices(prev => ({
                                ...prev,
                                [project.id]: Math.max(0, (prev[project.id] || 0) - 1)
                              }));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white hover:text-gray-900 transition-all shadow-sm"
                          >
                            <ChevronDown className="w-4 h-4 -rotate-90" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndices(prev => ({
                                ...prev,
                                [project.id]: Math.min((project.images?.length || 1) - 1, (prev[project.id] || 0) + 1)
                              }));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white hover:text-gray-900 transition-all shadow-sm"
                          >
                            <ChevronDown className="w-4 h-4 rotate-90" />
                          </button>
                          
                          {/* Image Indicators */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {project.images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndices(prev => ({ ...prev, [project.id]: idx }));
                                }}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  idx === (currentImageIndices[project.id] || 0)
                                    ? 'bg-white w-4'
                                    : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      Active
                    </span>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProject(project);
                          setFormData({
                            title: project.title,
                            description: project.description,
                            image_url: project.image_url,
                            rar_file_url: project.rar_file_url,
                            images: project.images?.map(img => img.image_url) || []
                          });
                          setShowAdminPanel(true);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white transition-all shadow-sm"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 hover:text-red-600 hover:bg-white transition-all shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[2.5rem]">{project.description}</p>
                  
                  <button
                    onClick={() => {
                      if (project.rar_file_url) {
                        window.open(project.rar_file_url, '_blank');
                      } else {
                        alert('No RAR file available for this project');
                      }
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download Project
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 Wolf Trading. All rights reserved.
            </p>
            <a 
              href="mailto:aivideo7775@gmail.com"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              aivideo7775@gmail.com
            </a>
          </div>
        </div>
      </footer>

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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description:e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Images (Multiple)
                </label>
                <input
                  type="file"
                  id="image-file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      handleMultipleImageUpload(files);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                {formData.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.images.map((url, idx) => (
                      <div key={idx} className="relative w-16 h-16">
                        <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              images: formData.images.filter((_, i) => i !== idx)
                            });
                          }}
                          className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {uploadingImage && (
                  <p className="text-sm text-gray-500 mt-1">Uploading images...</p>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                {uploadingRar && (
                  <p className="text-sm text-gray-500 mt-1">Uploading RAR file...</p>
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
                  disabled={uploadingImage || uploadingRar || isSubmitting}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : (editingProject ? 'Update' : 'Create')}
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
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === 'success' 
              ? 'bg-gray-900 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          {notification.message}
        </motion.div>
      )}
    </div>
  );
}
