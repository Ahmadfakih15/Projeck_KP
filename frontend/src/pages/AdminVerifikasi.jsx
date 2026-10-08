import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';

export default function AdminVerifikasi() {
  const [laporanList, setLaporanList] = useState([]);
  const [activeTab, setActiveTab] = useState('semua');
  const [selectedLaporan, setSelectedLaporan] = useState(null);

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const fetchLaporan = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tugas', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setLaporanList(data || []);
      if (data && data.length > 0 && !selectedLaporan) {
         setSelectedLaporan(data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (token) fetchLaporan();
  }, [token]);

  const verifyLaporan = async (id, action) => {
    try {
      await fetch(`http://localhost:5000/api/tugas/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action }) // 'ACC' or 'TOLAK'
      });
      fetchLaporan();
      if (selectedLaporan?.id === id) setSelectedLaporan(null);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = laporanList.filter(l => {
    if (activeTab === 'menunggu') return l.status === 'MENUNGGU_VERIFIKASI';
    if (activeTab === 'riwayat') return l.status === 'SELESAI' || l.status === 'DITOLAK';
    return l.status !== 'BELUM_DIKERJAKAN';
  });

  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Verifikasi Laporan Tugas</h2>
           <p className="text-sm text-slate-500 mt-1">Verifikasi bukti pelaksanaan tugas lapangan dan loket pegawai.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Table Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden h-full">
           <div className="flex border-b border-slate-100 px-6 pt-2">
              <button onClick={() => setActiveTab('semua')} className={`py-3 px-4 text-sm font-bold transition-colors ${activeTab === 'semua' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                 Semua Laporan ({laporanList.filter(l => l.status !== 'BELUM_DIKERJAKAN').length})
              </button>
              <button onClick={() => setActiveTab('menunggu')} className={`py-3 px-4 text-sm font-bold transition-colors ${activeTab === 'menunggu' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                 Menunggu Verifikasi ({laporanList.filter(l => l.status === 'MENUNGGU_VERIFIKASI').length})
              </button>
              <button onClick={() => setActiveTab('riwayat')} className={`py-3 px-4 text-sm font-bold transition-colors ${activeTab === 'riwayat' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                 Riwayat
              </button>
           </div>
           
           <div className="p-4 border-b border-slate-100">
              <div className="relative w-full max-w-sm">
                 <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                 <input type="text" placeholder="Cari nama pegawai / judul tugas..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
           </div>

           <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 sticky top-0">
                  <tr>
                    <th className="p-4 font-semibold w-12">No</th>
                    <th className="p-4 font-semibold">Nama</th>
                    <th className="p-4 font-semibold">Bidang</th>
                    <th className="p-4 font-semibold">Lokasi</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((l, i) => (
                    <tr key={l.id} onClick={() => setSelectedLaporan(l)} className={`hover:bg-slate-50 cursor-pointer ${selectedLaporan?.id === l.id ? 'bg-blue-50' : ''}`}>
                      <td className="p-4 text-slate-500">{i+1}</td>
                      <td className="p-4 font-bold text-slate-700">{l.user?.name}</td>
                      <td className="p-4 text-slate-600">{l.user?.bidang}</td>
                      <td className="p-4 text-slate-600">{l.lokasi}</td>
                      <td className="p-4">
                         <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${l.status === 'SELESAI' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {l.status === 'SELESAI' ? 'ACC' : 'Menunggu'}
                         </span>
                      </td>
                      <td className="p-4 flex gap-2 justify-center">
                         {l.status === 'MENUNGGU_VERIFIKASI' ? (
                            <button onClick={(e) => { e.stopPropagation(); verifyLaporan(l.id, 'ACC'); }} className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700">Verifikasi ACC</button>
                         ) : (
                            <span className="text-slate-400 text-xs font-bold px-3 py-1">Selesai</span>
                         )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan="6" className="p-4 text-center text-slate-400">Tidak ada laporan.</td></tr>}
                </tbody>
              </table>
           </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full overflow-y-auto">
           {selectedLaporan ? (
              <>
                 <h3 className="font-bold text-slate-800 mb-4 text-lg border-b border-slate-100 pb-2">Detail Laporan</h3>
                 
                 <div className="flex gap-4 mb-6">
                    <img src="https://ui-avatars.com/api/?name=User&background=random" className="w-12 h-12 rounded-lg" alt="avatar" />
                    <div>
                       <h4 className="font-bold text-slate-800">{selectedLaporan.user?.name}</h4>
                       <p className="text-sm text-slate-500">{selectedLaporan.user?.bidang} - {selectedLaporan.lokasi}</p>
                       <p className="text-xs text-slate-400 mt-1">{new Date(selectedLaporan.updatedAt).toLocaleString('id-ID')}</p>
                    </div>
                 </div>

                 <div className="space-y-3 text-sm mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex"><span className="w-24 text-slate-500">Jenis Tugas:</span> <span className="font-medium text-slate-800">{selectedLaporan.jenisTugas}</span></div>
                    <div className="flex"><span className="w-24 text-slate-500">Lokasi:</span> <span className="font-medium text-slate-800">{selectedLaporan.lokasi}</span></div>
                    {selectedLaporan.pdfUrl && (
                       <div className="flex"><span className="w-24 text-slate-500">Draf PDF:</span> <a href={`http://localhost:5000${selectedLaporan.pdfUrl}`} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline">Lihat Dokumen PDF</a></div>
                    )}
                 </div>

                 <div className="w-full h-48 bg-slate-100 rounded-xl border border-slate-200 mb-6 overflow-hidden flex items-center justify-center">
                    {/* Real image preview */}
                    {selectedLaporan.buktiUrl ? (
                       <img src={`http://localhost:5000${selectedLaporan.buktiUrl}`} alt="bukti" className="w-full h-full object-cover cursor-pointer" onClick={() => window.open(`http://localhost:5000${selectedLaporan.buktiUrl}`, '_blank')} />
                    ) : (
                       <span className="text-slate-400 text-sm">Tidak ada pratinjau gambar</span>
                    )}
                 </div>

                 {selectedLaporan.status === 'MENUNGGU_VERIFIKASI' && (
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                       <button onClick={() => verifyLaporan(selectedLaporan.id, 'ACC')} className="py-2.5 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600">Verifikasi ACC</button>
                       <button onClick={() => verifyLaporan(selectedLaporan.id, 'TOLAK')} className="py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 border border-red-200">Kirim Peringatan</button>
                    </div>
                 )}
                 {selectedLaporan.status === 'SELESAI' && (
                    <div className="mt-auto p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 text-center font-bold text-sm flex items-center justify-center gap-2">
                       <CheckCircle size={18} /> Laporan telah di-ACC
                    </div>
                 )}
              </>
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm text-center">
                 <CheckCircle size={48} className="mb-4 text-slate-200" />
                 <p>Pilih laporan dari tabel di samping<br/>untuk melihat detail dan memverifikasi.</p>
              </div>
           )}
        </div>

      </div>
    </div>
  );
}
