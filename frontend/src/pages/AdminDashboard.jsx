import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, AlertCircle, FileText, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState({
    pegawai: { total: 0, diLoket: 0, diKecamatan: 0, diKantor: 0 },
    notifikasi: { stokMenipis: [], tiketBaru: 0, laporanVerifikasi: 0, tagihanH3: 0 }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const res = await fetch('http://localhost:5000/api/dashboard/admin', {
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

  const pLoket = stats.pegawai.total ? Math.round((stats.pegawai.diLoket / stats.pegawai.total) * 100) : 0;
  const pKecamatan = stats.pegawai.total ? Math.round((stats.pegawai.diKecamatan / stats.pegawai.total) * 100) : 0;
  const pKantor = stats.pegawai.total ? Math.round((stats.pegawai.diKantor / stats.pegawai.total) * 100) : 0;

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             Dashboard Utama (Pusat Kendali)
           </h2>
           <p className="text-slate-500 text-sm mt-1">Selamat datang, {user.name} 👋 Berikut ringkasan kondisi sistem hari ini.</p>
        </div>
        <div className="text-right">
           <p className="text-sm text-slate-500 font-medium">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Aksi Cepat & Notifikasi (Left Column) */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap size={20} className="text-yellow-500"/> Aksi Cepat</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/dashboard/jadwal" className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition text-center border border-blue-100">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mb-2 shadow-sm"><Calendar size={20}/></div>
                  <span className="text-xs font-bold text-blue-900">Buat Jadwal Shift</span>
                </Link>
                <Link to="/dashboard/pbg" className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition text-center border border-purple-100">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white mb-2 shadow-sm"><FileText size={20}/></div>
                  <span className="text-xs font-bold text-purple-900">Input Data PBG</span>
                </Link>
                <Link to="/dashboard/inventaris" className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition text-center border border-orange-100">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white mb-2 shadow-sm"><CheckCircle2 size={20}/></div>
                  <span className="text-xs font-bold text-orange-900">Proses Permintaan</span>
                </Link>
                <Link to="/dashboard/pbg" className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition text-center border border-green-100">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-2 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
                  <span className="text-xs font-bold text-green-900">Tes Bot WhatsApp</span>
                </Link>
             </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Notifikasi & Peringatan</h3>
             <div className="space-y-3">
               <AlertItem title="Stok ATK Hampir Habis" desc={stats.notifikasi.stokMenipis.length > 0 ? `${stats.notifikasi.stokMenipis.length} barang limit` : 'Semua aman'} color="red" action="Lihat Stok" link="/dashboard/inventaris" />
               <AlertItem title={`${stats.notifikasi.tiketBaru} Tiket Butuh Barang/Perbaikan`} desc="Dari pegawai" color="orange" action="Proses" link="/dashboard/inventaris" />
               <AlertItem title={`${stats.notifikasi.laporanVerifikasi} Laporan Perlu Tindakan`} desc="Tugas belum di ACC" color="blue" action="Cek Tiket" link="/dashboard/verifikasi" />
               <AlertItem title={`Tagihan PBG Mendekati Jatuh Tempo`} desc={`${stats.notifikasi.tagihanH3} tagihan (H-3)`} color="indigo" action="Lihat Data" link="/dashboard/pbg" />
             </div>
          </div>
        </div>

        {/* Status Pegawai (Right Column) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
           <h3 className="text-lg font-bold text-slate-800 mb-6 w-full text-left">Status Pegawai Hari Ini</h3>
           
           {/* Mock Donut Chart via SVG */}
           <div className="relative w-48 h-48 mb-6">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                 {pLoket > 0 && <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray={`${pLoket}, 100`} />}
                 {pKecamatan > 0 && <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${pKecamatan}, 100`} strokeDashoffset={`-${pLoket}`} />}
                 {pKantor > 0 && <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray={`${pKantor}, 100`} strokeDashoffset={`-${pLoket + pKecamatan}`} />}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-3xl font-extrabold text-slate-800">{stats.pegawai.total}</span>
                 <span className="text-xs text-slate-500 font-medium">Total Pegawai</span>
              </div>
           </div>

           <div className="w-full space-y-3">
              <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2 font-medium text-slate-700"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Di Loket</div>
                 <div className="font-bold">{stats.pegawai.diLoket} ({pLoket}%)</div>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2 font-medium text-slate-700"><div className="w-3 h-3 rounded-full bg-green-500"></div> Di Kecamatan</div>
                 <div className="font-bold">{stats.pegawai.diKecamatan} ({pKecamatan}%)</div>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2 font-medium text-slate-700"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Di Kantor (Lainnya)</div>
                 <div className="font-bold">{stats.pegawai.diKantor} ({pKantor}%)</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function AlertItem({ title, desc, color, action, link }) {
  const bgColors = { red: 'bg-red-50 text-red-500', orange: 'bg-orange-50 text-orange-500', blue: 'bg-blue-50 text-blue-500', indigo: 'bg-indigo-50 text-indigo-500' };
  const borderColors = { red: 'border-red-100', orange: 'border-orange-100', blue: 'border-blue-100', indigo: 'border-indigo-100' };
  
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${borderColors[color]} bg-white shadow-sm hover:shadow-md transition`}>
       <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColors[color]}`}>
             <AlertCircle size={18} />
          </div>
          <div>
             <h4 className="text-sm font-bold text-slate-800">{title}</h4>
             <p className="text-xs text-slate-500">{desc}</p>
          </div>
       </div>
       <Link to={link} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${bgColors[color]} hover:opacity-80 transition`}>{action}</Link>
    </div>
  )
}
