import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Upload, Globe, MonitorPlay, MapPin, Loader2, Link } from 'lucide-react';
import { Language } from '../../data/translations';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';

interface Project {
  id: string;
  name: string;
  image: string;
  description: Record<Language, string>;
  website?: string;
  demo?: string;
  maps?: string;
  type?: 'website' | 'app';
  createdAt?: any;
}

interface ProjectsData {
  websites: Project[];
  apps: Project[];
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ProjectsData>({ websites: [], apps: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'websites' | 'apps'>('websites');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Project>({
    id: '',
    name: '',
    image: '',
    description: { en: '', fr: '', ar: '' },
    website: '',
    demo: '',
    maps: ''
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const websitesQuery = query(collection(db, 'projects'), where('type', '==', 'website'));
      const appsQuery = query(collection(db, 'projects'), where('type', '==', 'app'));
      
      const [websitesSnapshot, appsSnapshot] = await Promise.all([
        getDocs(websitesQuery),
        getDocs(appsQuery)
      ]);
      
      const websites = websitesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      const apps = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      
      // Sort client side
      const sortFn = (a: Project, b: Project) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      };
      websites.sort(sortFn);
      apps.sort(sortFn);
      
      setData({ websites, apps });
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (projectData: Project, isNew: boolean) => {
    setSaving(true);
    try {
      const dbData = {
        name: projectData.name,
        image: projectData.image,
        description: projectData.description,
        website: projectData.website || '',
        demo: projectData.demo || '',
        maps: projectData.maps || '',
        type: activeTab === 'websites' ? 'website' : 'app'
      };

      if (isNew) {
        await addDoc(collection(db, 'projects'), {
          ...dbData,
          createdAt: serverTimestamp()
        });
      } else {
        await updateDoc(doc(db, 'projects', projectData.id), dbData);
      }
      
      await fetchData();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save data', err);
      alert('Failed to save data. Check your permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    
    // Check if cloudinary env vars are set
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      alert("Cloudinary environment variables (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET) are not set. Check .env.example");
      setUploadingImage(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, image: data.secure_url }));
      } else {
        alert("Upload failed: " + (data.error?.message || "Unknown error"));
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({
        id: `${activeTab.charAt(0)}${Date.now()}`,
        name: '',
        image: '',
        description: { en: '', fr: '', ar: '' },
        website: '',
        demo: '',
        maps: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        await fetchData();
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("Failed to delete. Check permissions.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveData(formData, !editingProject);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#090909] flex items-center justify-center text-white"><Loader2 className="animate-spin text-[#B30000]" size={48} /></div>;
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-white/50 text-sm">Manage your portfolio projects</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button 
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'websites' ? 'bg-[#B30000] text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
            onClick={() => setActiveTab('websites')}
          >
            Websites
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'apps' ? 'bg-[#B30000] text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
            onClick={() => setActiveTab('apps')}
          >
            Apps
          </button>
          
          <button 
            onClick={() => openModal()}
            className="ml-auto flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            <Plus size={18} /> Add New {activeTab === 'websites' ? 'Website' : 'App'}
          </button>
        </div>

        {/* Project List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data[activeTab].map(project => (
            <div key={project.id} className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden flex flex-col">
              <div className="h-48 bg-[#222] relative border-b border-white/10 flex items-center justify-center p-4">
                 {project.image ? (
                   <img src={project.image} alt={project.name} className="w-full h-full object-cover rounded-md" />
                 ) : (
                   <span className="text-white/30 text-sm">No Image</span>
                 )}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                <p className="text-white/50 text-sm mb-4 line-clamp-2 flex-grow">{project.description?.en || ''}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                  <div className="flex gap-2">
                    <button onClick={() => openModal(project)} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="p-2 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex gap-2 text-white/40">
                    {(project.website || project.demo) && <Link size={16} />}
                    {project.maps && <MapPin size={16} />}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {data[activeTab].length === 0 && (
            <div className="col-span-full py-12 text-center text-white/40 border border-dashed border-white/10 rounded-2xl">
              No projects added yet. Click "Add New" to get started.
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a] flex-shrink-0">
              <h2 className="text-xl font-bold">{editingProject ? 'Edit' : 'Add'} {activeTab === 'websites' ? 'Website' : 'App'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/80">Name</label>
                <input 
                  type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B30000]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/80">{activeTab === 'websites' ? 'Website URL' : 'Demo URL'}</label>
                  <input 
                    type="url" value={activeTab === 'websites' ? formData.website : formData.demo} 
                    onChange={e => activeTab === 'websites' ? setFormData({...formData, website: e.target.value}) : setFormData({...formData, demo: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B30000]"
                    placeholder="https://"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/80">Google Maps URL</label>
                  <input 
                    type="url" value={formData.maps} onChange={e => setFormData({...formData, maps: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B30000]"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/80">Image Upload (Cloudinary)</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-colors flex-1">
                    <Upload size={16} /> {uploadingImage ? 'Uploading...' : 'Choose Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                  {formData.image && (
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-black flex-shrink-0 border border-white/10">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/40 mt-1">Requires VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env</p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-white/80">Descriptions</label>
                <div className="flex flex-col gap-2">
                  <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    <span className="bg-white/10 px-3 py-2 flex items-center justify-center text-xs font-bold w-12">EN</span>
                    <textarea 
                      rows={2} value={formData.description?.en || ''} onChange={e => setFormData({...formData, description: {...formData.description, en: e.target.value}})}
                      className="bg-transparent flex-1 px-3 py-2 text-white focus:outline-none text-sm resize-none"
                    />
                  </div>
                  <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    <span className="bg-white/10 px-3 py-2 flex items-center justify-center text-xs font-bold w-12">FR</span>
                    <textarea 
                      rows={2} value={formData.description?.fr || ''} onChange={e => setFormData({...formData, description: {...formData.description, fr: e.target.value}})}
                      className="bg-transparent flex-1 px-3 py-2 text-white focus:outline-none text-sm resize-none"
                    />
                  </div>
                  <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    <span className="bg-white/10 px-3 py-2 flex items-center justify-center text-xs font-bold w-12">AR</span>
                    <textarea 
                      rows={2} value={formData.description?.ar || ''} onChange={e => setFormData({...formData, description: {...formData.description, ar: e.target.value}})}
                      className="bg-transparent flex-1 px-3 py-2 text-white focus:outline-none text-sm resize-none text-right" dir="rtl"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-white/10 flex justify-end gap-3 flex-shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-lg font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10">
                  Cancel
                </button>
                <button type="submit" disabled={saving || uploadingImage} className="px-6 py-3 rounded-lg font-medium bg-[#B30000] text-white hover:bg-[#e60000] flex items-center gap-2">
                  {saving && <Loader2 size={16} className="animate-spin" />} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
