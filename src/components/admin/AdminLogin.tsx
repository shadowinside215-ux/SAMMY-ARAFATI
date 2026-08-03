import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (username === 'sami' && password === '2006') {
      setLoading(true);
      try {
        // We map the dummy credentials to a real Firebase auth user behind the scenes
        try {
          await signInWithEmailAndPassword(auth, 'sami@admin.com', 'admin2006');
        } catch (err: any) {
          // If the user doesn't exist yet, we create it
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            await createUserWithEmailAndPassword(auth, 'sami@admin.com', 'admin2006');
          } else {
            throw err;
          }
        }
        
        localStorage.setItem('adminToken', 'true'); // Keep token for UI state if needed
        navigate('/admin');
      } catch (err) {
        console.error("Firebase auth error:", err);
        setError('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex items-center justify-center selection:bg-[#B30000]/30 selection:text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#B30000] opacity-10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#B30000] opacity-5 blur-[100px] rounded-full pointer-events-none z-0"></div>
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-white/60 text-sm">Sign in to manage your portfolio</p>
        </div>
        
        <form onSubmit={handleLogin} className="bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col gap-5 shadow-2xl">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center">{error}</div>}
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B30000] transition-colors"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B30000] transition-colors"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
