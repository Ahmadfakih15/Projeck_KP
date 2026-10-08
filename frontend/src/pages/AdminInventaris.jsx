import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';

export default function AdminInventaris() {
  const [activeTab, setActiveTab] = useState('tiket');
  const [subTab, setSubTab] = useState('semua');
  const [tiketList, setTiketList] = useState([]);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.token : '';

  const fetchTiket = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/inventaris/tiket', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTiketList(data || []);
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if(token) fetchTiket();
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/inventaris/tiket/${id}`, {
        method: 'PUT',
        headers: { 
           'Content-Type': 'application/json',
           Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      fetchTiket();
    } catch(e) {
      console.error(e);
    }
  };

  const filteredTiket = tiketList.filter(t => {
     if(subTab === 'semua') return true;
     if(subTab === 'barang') return t.jenis === 'PERMINTAAN_BARANG';
     if(subTab === 'perbaikan') return t.jenis === 'LAPOR_KERUSAKAN';
     return true;
  });

  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col">
      <div className="bg-white rounded-t-xl p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">Manajemen Inventaris & Ticketing</h2>
      </div>
      
      <div className="bg-white rounded-b-xl flex-1 shadow-sm border border-t-0 border-slate-100 overflow-hidden flex flex-col">
        {/* Main Tabs */}
        <div className="flex border-b border-slate-100 px-6">
          <button onClick={() => setActiveTab('katalog')} className={`py-4 px-6 text-sm font-bold transition-colors ${activeTab === 'katalog' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
            Katalog Barang
          </button>
          <button onClick={() => setActiveTab('tiket')} className={`py-4 px-6 text-sm font-bold transition-colors ${activeTab === 'tiket' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
            Permintaan & Ticketing
          </button>
          <button onClick={() => setActiveTab('riwayat')} className={`py-4 px-6 text-sm font-bold transition-colors ${activeTab === 'riwayat' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
            Riwayat Stok
          </button>
        </div>

        {activeTab === 'tiket' && (
          <div className="p-6 flex flex-col h-full">
            <h3 className="font-bold text-slate-800 mb-4 text-base">Permintaan & Ticketing</h3>
            
            {/* Sub Tabs */}
            <div className="flex gap-2 mb-6">
               <button onClick={() => setSubTab('semua')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${subTab === 'semua' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Semua ({tiketList.length})</button>
               <button onClick={() => setSubTab('barang')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${subTab === 'barang' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Barang</button>
               <button onClick={() => setSubTab('perbaikan')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${subTab === 'perbaikan' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Perbaikan</button>
            </div>

            {/* Table */}
            <div className="border border-slate-100 rounded-lg overflow-hidden flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                  <tr>
                    <th className="p-4 font-semibold w-16">ID</th>
                    <th className="p-4 font-semibold">Jenis / Barang</th>
                    <th className="p-4 font-semibold">Pelapor</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTiket.map((tiket) => (
                    <tr key={tiket.id} className="hover:bg-slate-50">
                      <td className="p-4 text-slate-500 font-medium">TK-{tiket.id}</td>
                      <td className="p-4 text-slate-700">
                         <p className="font-bold">{tiket.jenis === 'PERMINTAAN_BARANG' ? 'Barang' : 'Perbaikan'}</p>
                         <p className="text-xs text-slate-500">{tiket.barang?.nama || 'Tanpa Barang'}</p>
                      </td>
                      <td className="p-4 text-slate-700">
                         <p className="font-bold">{tiket.user?.name}</p>
                         <p className="text-xs text-slate-500">{tiket.user?.bidang}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                           tiket.status === 'MENUNGGU' ? 'bg-orange-100 text-orange-700' :
                           tiket.status === 'ACC' || tiket.status === 'SELESAI' ? 'bg-green-100 text-green-700' :
                           'bg-blue-100 text-blue-700'
                        }`}>{tiket.status}</span>
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        {tiket.status === 'MENUNGGU' && (
                           <>
                             <button onClick={() => updateStatus(tiket.id, 'ACC')} className="px-3 py-1 bg-green-500 text-white rounded-md text-xs font-bold hover:bg-green-600">ACC</button>
                             <button onClick={() => updateStatus(tiket.id, 'MAINTENANCE')} className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs font-bold hover:bg-blue-600">Maint</button>
                             <button onClick={() => updateStatus(tiket.id, 'DITOLAK')} className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-xs font-bold hover:bg-red-200">Tolak</button>
                           </>
                        )}
                        {(tiket.status === 'ACC' || tiket.status === 'MAINTENANCE') && (
                           <button onClick={() => updateStatus(tiket.id, 'SELESAI')} className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-xs font-bold hover:bg-slate-300">Selesaikan</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredTiket.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-slate-400">Tidak ada tiket ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab !== 'tiket' && (
          <div className="p-10 text-center text-slate-500">
             Modul {activeTab} sedang dalam pengembangan.
          </div>
        )}
      </div>
    </div>
  );
}
