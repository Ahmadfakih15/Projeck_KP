import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username && password) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        
        if (response.ok) {
          localStorage.setItem('user', JSON.stringify({
             token: data.token,
             role: data.user.role,
             name: data.user.name
          }));
          navigate('/dashboard');
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Server unreachable');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-800 to-indigo-900 p-4">
      <div className="glass-dark w-full max-w-md p-8 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2 drop-shadow-md">SI-TERPADU</h1>
            <p className="text-sm font-medium text-slate-300">Sistem Informasi Terpadu DPMPTSP</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 text-white border border-slate-700 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none transition-all duration-300 placeholder-slate-500"
                placeholder="Masukkan username Anda"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 text-white border border-slate-700 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none transition-all duration-300 placeholder-slate-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-1 transition-all duration-300"
            >
              MASUK SISTEM
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
