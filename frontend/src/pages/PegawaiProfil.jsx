import { useState } from 'react';
import { Bell, UserCircle, Edit3, ShieldAlert, Package, CalendarClock } from 'lucide-react';

export default function PegawaiProfil() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [isEditing, setIsEditing] = useState(false);

  // Mock notifications based on the design
  const notifications = [
    { id: 1, title: 'Tiket barang Anda sedang diproses', time: '2 jam yang lalu', type: 'ticket', icon: <Package size={16}/>, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 2, title: 'Jadwal tugas besok: Pelayanan Terpadu - Klari', time: '5 jam yang lalu', type: 'jadwal', icon: <CalendarClock size={16}/>, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 3, title: 'Status tiket #TK-001 berubah menjadi ACC', time: '1 hari yang lalu', type: 'status', icon: <ShieldAlert size={16}/>, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Notifikasi & Profil</h2>
        <p className="text-slate-500 mt-1">Pemberitahuan aktivitas Anda dan pengaturan profil akun.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Notifikasi Panel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Bell size={20} className="text-blue-500"/> Notifikasi</h3>
           
           <div className="space-y-4">
              {notifications.map(notif => (
                 <div key={notif.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}>
                       {notif.icon}
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-slate-700">{notif.title}</h4>
                       <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Profil Panel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><UserCircle size={20} className="text-indigo-500"/> Profil Saya</h3>
           
           <div className="flex items-center gap-5 p-5 border border-slate-100 rounded-xl bg-slate-50 mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-black">
                 {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                 <h4 className="text-xl font-bold text-slate-800">{user?.name}</h4>
                 <p className="text-sm text-slate-500 font-medium">NIP. {user?.nip || '-'}</p>
                 <span className="inline-block px-2.5 py-0.5 mt-2 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                    {user?.bidang}
                 </span>
              </div>
           </div>

           <button 
              onClick={() => setIsEditing(!isEditing)}
              className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition text-sm"
           >
              <Edit3 size={16} /> Ubah Profil
           </button>

           {isEditing && (
              <div className="mt-4 p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-500 text-center">
                 Fitur ubah profil sedang dalam pengembangan. Silakan hubungi Admin Sekretariat untuk perubahan NIP atau nama.
              </div>
           )}
        </div>

      </div>
    </div>
  );
}
