import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function AdminJadwal() {
  const [activeTab, setActiveTab] = useState('jadwal');
  
  // Data State
  const [pegawaiList, setPegawaiList] = useState([]);
  const [jadwalList, setJadwalList] = useState([]);
  
  // Form State
  const [form, setForm] = useState({ bidang: 'Pelayanan (PTSP)', jenisTugas: 'Jaga Loket', lokasi: '', userId: '', mode: 'harian', tanggal: '', tanggalMulai: '', tanggalSelesai: '' });

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.token : '';

  const fetchData = async () => {
    try {
      const resUsers = await fetch('http://localhost:5000/api/tugas/users', { headers: { Authorization: `Bearer ${token}` } });
      const dataUsers = await resUsers.json();
      setPegawaiList(dataUsers);
      
      if (dataUsers.length > 0 && !form.userId) {
        setForm(prev => ({ ...prev, userId: dataUsers[0].id }));
      }

      const resJadwal = await fetch('http://localhost:5000/api/tugas', { headers: { Authorization: `Bearer ${token}` } });
      const dataJadwal = await resJadwal.json();
      setJadwalList(dataJadwal);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.mode === 'harian' && (!form.tanggal || !form.userId)) return alert('Lengkapi tanggal dan pegawai');
    if (form.mode === 'mingguan' && (!form.tanggalMulai || !form.tanggalSelesai || !form.userId)) return alert('Lengkapi rentang tanggal');

    try {
      await fetch('http://localhost:5000/api/tugas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      fetchData(); // refresh list
      alert('Jadwal berhasil ditambahkan!');
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col">
      <div className="bg-white rounded-t-xl p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">Penjadwalan & Monitoring Tugas</h2>
      </div>
      
      <div className="bg-white rounded-b-xl flex-1 shadow-sm border border-t-0 border-slate-100 overflow-hidden flex flex-col">
        {/* Main Tabs */}
        <div className="flex border-b border-slate-100 px-6">
          <button onClick={() => setActiveTab('jadwal')} className={`py-4 px-6 text-sm font-bold transition-colors ${activeTab === 'jadwal' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
            Jadwal Tugas
          </button>
          <button onClick={() => setActiveTab('monitoring')} className={`py-4 px-6 text-sm font-bold transition-colors ${activeTab === 'monitoring' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
            Monitoring Tugas
          </button>
        </div>

        {activeTab === 'jadwal' && (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
             {/* Left: Form Buat Jadwal */}
             <div>
                <h3 className="font-bold text-slate-800 mb-4 text-base">Buat Jadwal Mingguan</h3>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
                   <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Bidang</label>
                      <select 
                         value={form.bidang} 
                         onChange={e => {
                            const newBidang = e.target.value;
                            setForm({
                               ...form, 
                               bidang: newBidang, 
                               jenisTugas: newBidang === 'Pelayanan (PTSP)' ? 'Jaga Loket' : 'Pengawasan Industri',
                               lokasi: ''
                            });
                         }} 
                         className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                      >
                         <option value="Pelayanan (PTSP)">Pelayanan (PTSP)</option>
                         <option value="Penanaman Modal (PM)">Penanaman Modal (PM)</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Tugas</label>
                      <select value={form.jenisTugas} onChange={e => setForm({...form, jenisTugas: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500 bg-white">
                         {form.bidang === 'Pelayanan (PTSP)' ? (
                            <>
                               <option value="Jaga Loket">Jaga Loket</option>
                               <option value="Pelayanan Terpadu">Pelayanan Terpadu</option>
                            </>
                         ) : (
                            <>
                               <option value="Pengawasan Industri">Pengawasan Industri</option>
                               <option value="Pengawasan PBG">Pengawasan PBG</option>
                            </>
                         )}
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Lokasi (Spesifik/Wilayah)</label>
                      <input type="text" value={form.lokasi} onChange={e => setForm({...form, lokasi: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500 bg-white" placeholder={form.bidang === 'Pelayanan (PTSP)' ? "Cth: Loket 1, Kec. Klari" : "Cth: Kawasan Industri KIIC, Surya Cipta"} required />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Pegawai</label>
                      <select value={form.userId} onChange={e => setForm({...form, userId: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500 bg-white">
                         {pegawaiList.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (NIP {p.nip})</option>
                         ))}
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Tipe Penjadwalan</label>
                      <select value={form.mode} onChange={e => setForm({...form, mode: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500 bg-white mb-3">
                         <option value="harian">Harian (1 Hari)</option>
                         <option value="mingguan">Mingguan / Rentang Tanggal</option>
                      </select>
                   </div>
                   
                   {form.mode === 'harian' ? (
                      <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">Tanggal</label>
                         <input type="date" value={form.tanggal} onChange={e => setForm({...form, tanggal: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500 bg-white" required />
                      </div>
                   ) : (
                      <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Dari Tanggal</label>
                            <input type="date" value={form.tanggalMulai} onChange={e => setForm({...form, tanggalMulai: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500 bg-white" required />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Sampai Tanggal</label>
                            <input type="date" value={form.tanggalSelesai} onChange={e => setForm({...form, tanggalSelesai: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500 bg-white" required />
                         </div>
                      </div>
                   )}

                   <div className="pt-4 flex gap-3">
                      <button type="button" onClick={() => setForm({...form, tanggal: '', tanggalMulai: '', tanggalSelesai: '', lokasi: ''})} className="flex-1 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-md hover:bg-slate-200">Reset</button>
                      <button type="submit" className="flex-1 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700">Simpan</button>
                   </div>
                </form>

                <div className="mt-8">
                   <h3 className="font-bold text-slate-800 mb-4 text-base">Monitoring Tugas Hari Ini</h3>
                   <div className="grid grid-cols-4 gap-3">
                      <div className="border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1"><Calendar size={16}/></div>
                         <span className="font-bold text-lg text-slate-800">{jadwalList.length}</span>
                         <span className="text-[9px] text-slate-500 font-bold uppercase">Total Tugas</span>
                      </div>
                      <div className="border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm">
                         <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-1"><CheckCircle2 size={16}/></div>
                         <span className="font-bold text-lg text-slate-800">{jadwalList.filter(j => j.status === 'SELESAI').length}</span>
                         <span className="text-[9px] text-slate-500 font-bold uppercase">Selesai</span>
                      </div>
                      <div className="border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm">
                         <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-1"><Clock size={16}/></div>
                         <span className="font-bold text-lg text-slate-800">{jadwalList.filter(j => j.status === 'MENUNGGU_VERIFIKASI').length}</span>
                         <span className="text-[9px] text-slate-500 font-bold uppercase">Proses</span>
                      </div>
                      <div className="border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm">
                         <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-1"><XCircle size={16}/></div>
                         <span className="font-bold text-lg text-slate-800">{jadwalList.filter(j => j.status === 'BELUM_DIKERJAKAN').length}</span>
                         <span className="text-[9px] text-slate-500 font-bold uppercase">Terlewat</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right: Jadwal Mingguan List */}
             <div>
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-slate-800 text-base">Jadwal Tugas</h3>
                   <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      Semua Jadwal
                   </div>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                   {jadwalList.map(jadwal => {
                      const dateObj = new Date(jadwal.tanggal);
                      return (
                         <div key={jadwal.id} className="p-3 border border-slate-100 rounded-lg flex items-center shadow-sm">
                            <div className="w-12 text-center border-r border-slate-100 pr-3">
                               <p className="text-xs font-bold text-slate-400">{dateObj.toLocaleDateString('id-ID', { weekday: 'short' })}</p>
                               <p className="text-lg font-bold text-slate-800">{dateObj.getDate()}</p>
                            </div>
                            <div className="pl-4 flex-1">
                               <h4 className="text-sm font-bold text-slate-700">{jadwal.jenisTugas} - {jadwal.lokasi}</h4>
                               <p className="text-xs text-slate-500">{jadwal.user?.name}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                               jadwal.status === 'SELESAI' ? 'bg-green-100 text-green-700' :
                               jadwal.status === 'MENUNGGU_VERIFIKASI' ? 'bg-yellow-100 text-yellow-700' :
                               'bg-blue-100 text-blue-700'
                            }`}>
                               {jadwal.status.replace('_', ' ')}
                            </span>
                         </div>
                      );
                   })}
                   {jadwalList.length === 0 && <p className="text-sm text-slate-400">Belum ada jadwal yang dibuat.</p>}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="p-10 text-center text-slate-500">
             Modul Monitoring sedang dalam pengembangan.
          </div>
        )}
      </div>
    </div>
  );
}
