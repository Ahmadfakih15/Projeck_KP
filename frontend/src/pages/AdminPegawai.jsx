import { useState, useEffect } from 'react';
import { Search, UserPlus, Users } from 'lucide-react';

export default function AdminPegawai() {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', name: '', nip: '', bidang: 'PTSP', role: 'PEGAWAI' });

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const fetchPegawai = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tugas/users', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPegawaiList(data);
      } else {
        console.error('Error fetching pegawai:', data);
        setPegawaiList([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (token) fetchPegawai();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
         fetchPegawai();
         setForm({ username: '', password: '', name: '', nip: '', bidang: 'PTSP', role: 'PEGAWAI' });
         alert('Pegawai berhasil ditambahkan');
      } else {
         const data = await res.json();
         alert(data.message || 'Gagal menambahkan');
      }
    } catch(e) { console.error(e); }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Manajemen Pegawai</h2>
        <p className="text-slate-500 text-sm mt-1">Kelola data pegawai DPMPTSP (Nama, NIP, Bidang) untuk keperluan penjadwalan dan laporan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah Pegawai */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><UserPlus size={18} className="text-blue-500"/> Tambah Pegawai Baru</h3>
           <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">Nama Lengkap</label>
                 <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">Nomor Induk Pegawai (NIP)</label>
                 <input type="text" value={form.nip} onChange={e => setForm({...form, nip: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">Bidang Tugas</label>
                 <select value={form.bidang} onChange={e => setForm({...form, bidang: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500 bg-white">
                    <option value="PTSP">Pelayanan (PTSP)</option>
                    <option value="PM">Penanaman Modal (PM)</option>
                 </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Username Login</label>
                    <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500" required />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Password</label>
                    <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500" required />
                 </div>
              </div>
              <div className="pt-4">
                 <button type="submit" className="w-full py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700">Simpan Pegawai</button>
              </div>
           </form>
        </div>

        {/* Daftar Pegawai */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden h-[600px]">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users size={18} className="text-blue-500"/> Daftar Pegawai Terdaftar</h3>
              <div className="relative">
                 <Search className="absolute left-2.5 top-2 text-slate-400" size={16} />
                 <input type="text" placeholder="Cari NIP / Nama..." className="pl-8 pr-3 py-1.5 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
           </div>
           <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 sticky top-0 shadow-sm">
                    <tr>
                       <th className="p-4 font-semibold w-12">No</th>
                       <th className="p-4 font-semibold">Nama & NIP</th>
                       <th className="p-4 font-semibold">Username</th>
                       <th className="p-4 font-semibold">Bidang</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {pegawaiList.map((p, i) => (
                       <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-4 text-slate-500">{i+1}</td>
                          <td className="p-4">
                             <p className="font-bold text-slate-700">{p.name}</p>
                             <p className="text-xs text-slate-500">{p.nip}</p>
                          </td>
                          <td className="p-4 text-slate-600 font-medium">@{p.username}</td>
                          <td className="p-4">
                             <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.bidang === 'PTSP' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {p.bidang}
                             </span>
                          </td>
                       </tr>
                    ))}
                    {pegawaiList.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-slate-400">Belum ada pegawai.</td></tr>}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
}
