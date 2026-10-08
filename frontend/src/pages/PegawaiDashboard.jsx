import { useState, useEffect } from 'react';
import { Calendar, UploadCloud, CheckCircle2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PegawaiDashboard({ user }) {
  const [stats, setStats] = useState({
    jadwalToday: [],
    stats: { total: 0, selesai: 0, belum: 0 }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const res = await fetch('http://localhost:5000/api/dashboard/pegawai', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  const progress = stats.stats.total ? Math.round((stats.stats.selesai / stats.stats.total) * 100) : 0;

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Pegawai</h2>
        <p className="text-slate-500 mt-1">Halo, <span className="font-bold text-indigo-600">{user.name}</span>! Semangat hari ini! Berikut jadwal dan tugas Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Jadwal Saya Hari Ini */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[400px]">
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Calendar size={20} className="text-blue-500"/> Jadwal Saya Minggu Ini</h3>
             
             {stats.jadwalToday.length > 0 ? (
               <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  
                  {stats.jadwalToday.map((j, i) => (
                     <div key={j.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active my-4">
                       <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${j.status === 'SELESAI' || j.status === 'MENUNGGU_VERIFIKASI' ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10`}>
                         {j.status === 'SELESAI' || j.status === 'MENUNGGU_VERIFIKASI' ? <CheckCircle2 size={20}/> : <Calendar size={18}/>}
                       </div>
                       <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border shadow-sm ${j.status === 'SELESAI' || j.status === 'MENUNGGU_VERIFIKASI' ? 'border-green-100 bg-green-50' : 'border-slate-200 bg-white'}`}>
                         <div className="flex items-center justify-between mb-1">
                           <h4 className="font-bold text-slate-800">{j.jenisTugas}</h4>
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${j.status === 'SELESAI' || j.status === 'MENUNGGU_VERIFIKASI' ? 'text-green-700 bg-green-200' : 'text-slate-500 bg-slate-100'}`}>
                             {j.status.replace('_', ' ')}
                           </span>
                         </div>
                         <p className="text-sm text-slate-500 font-bold mb-1">{new Date(j.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                         <p className="text-sm text-slate-500">{j.lokasi}</p>
                       </div>
                     </div>
                  ))}

               </div>
             ) : (
               <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-100 mt-4">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-400">
                     <Calendar size={48} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-700 mb-2">Tidak ada jadwal minggu ini</h4>
                  <p className="text-slate-500 text-sm max-w-sm">Anda telah menyelesaikan semua tugas Anda atau Admin belum memberikan jadwal baru untuk minggu ini. Selamat beristirahat atau silakan bantu rekan kerja Anda! 🎉</p>
               </div>
             )}
          </div>
        </div>

        {/* Quick Actions & Status */}
        <div className="space-y-6">
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Action</h3>
             <div className="space-y-3">
               <Link to="/dashboard/jadwal-pegawai" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-sm shadow-blue-200">
                 <UploadCloud size={18}/> Upload Bukti Tugas
               </Link>
               <Link to="/dashboard/lapor" className="w-full flex items-center justify-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold py-3 rounded-xl transition">
                 <FileText size={18}/> Buat Tiket Barang
               </Link>
             </div>
           </div>

           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
             <h3 className="text-lg font-bold text-slate-800 w-full text-left mb-4">Status Tugas (Minggu Ini)</h3>
             
             {/* Simple Circle Progress */}
             <div className="relative w-32 h-32 mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                   <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                   {progress > 0 && <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${progress}, 100`} />}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-2xl font-extrabold text-slate-800">{stats.stats.selesai}/{stats.stats.total}</span>
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Selesai</span>
                </div>
             </div>
             
             <div className="w-full text-sm">
                <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center gap-2 text-slate-600 font-medium"><div className="w-3 h-3 rounded-full bg-green-500"></div> Selesai / Menunggu Verifikasi</div>
                   <div className="font-bold">{stats.stats.selesai}</div>
                </div>
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2 text-slate-600 font-medium"><div className="w-3 h-3 rounded-full bg-slate-300"></div> Belum dikerjakan</div>
                   <div className="font-bold">{stats.stats.belum}</div>
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
