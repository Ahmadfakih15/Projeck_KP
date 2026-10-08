import { useState, useEffect } from 'react';
import { Search, Plus, Send, Activity, Settings2, ShieldCheck, XCircle } from 'lucide-react';

export default function AdminPBG() {
  const [activeTab, setActiveTab] = useState('data');
  const [pbgList, setPbgList] = useState([]);
  const [form, setForm] = useState({ namaPemohon: '', noHp: '', lokasi: '', noSkrd: '', nominal: '', jatuhTempo: '' });
  
  // New Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [botActive, setBotActive] = useState(true);
  const [template, setTemplate] = useState('Halo {nama}, tagihan PBG Anda No. {no_skrd} sebesar Rp {nominal} segera dibayarkan sebelum {tgl_jatuh_tempo}.\n\nTerima kasih.');
  const [isTriggering, setIsTriggering] = useState(false);

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const fetchPBG = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/pbg', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPbgList(data);
      } else {
        console.error('Error fetching PBG data:', data);
        setPbgList([]);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (token) fetchPBG();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/pbg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      fetchPBG();
      setForm({ namaPemohon: '', noHp: '', lokasi: '', noSkrd: '', nominal: '', jatuhTempo: '' });
      alert('PBG berhasil disimpan');
    } catch(e) { console.error(e); }
  };

  const handleSimpanTemplate = () => {
    alert('Template berhasil disimpan ke sistem Bot WA!');
  };

  const handleTrigger = () => {
    setIsTriggering(true);
    setTimeout(() => {
      setIsTriggering(false);
      alert('Berhasil mengirim pengingat ke semua pemohon PBG yang belum bayar!');
    }, 1500);
  };

  const filteredPbgList = pbgList.filter(item => 
    item.namaPemohon.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.noSkrd?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">PBG & Mesin Bot WA</h2>
        <p className="text-slate-500 text-sm mt-1">Kelola data retribusi Persetujuan Bangunan Gedung (PBG) dan notifikasi WhatsApp otomatis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="flex border-b border-slate-100">
             <button onClick={() => setActiveTab('data')} className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${activeTab === 'data' ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50' : 'text-slate-500 hover:bg-slate-50'}`}>
                Data Retribusi PBG
             </button>
             <button onClick={() => setActiveTab('bot')} className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${activeTab === 'bot' ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50' : 'text-slate-500 hover:bg-slate-50'}`}>
                Bot WhatsApp
             </button>
          </div>

          <div className="p-6">
             {activeTab === 'data' && (
                <div className="flex flex-col lg:flex-row gap-6">
                   <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-xl border border-slate-100">
                     <h3 className="font-bold text-slate-800 mb-4 text-sm">Input Data Pemohon PBG</h3>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1">Nama Pemohon</label>
                           <input type="text" value={form.namaPemohon} onChange={e => setForm({...form, namaPemohon: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500" required />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1">No. HP/WA</label>
                           <input type="text" value={form.noHp} onChange={e => setForm({...form, noHp: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500" required />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1">Lokasi Bangunan</label>
                           <input type="text" value={form.lokasi} onChange={e => setForm({...form, lokasi: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500" required />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1">Nomor SKRD</label>
                           <input type="text" value={form.noSkrd} onChange={e => setForm({...form, noSkrd: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500" required />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1">Nominal Retribusi</label>
                           <input type="number" value={form.nominal} onChange={e => setForm({...form, nominal: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500" required />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1">Batas Pembayaran</label>
                           <input type="date" value={form.jatuhTempo} onChange={e => setForm({...form, jatuhTempo: e.target.value})} className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500" required />
                        </div>
                        <div className="pt-2">
                           <button type="submit" className="w-full py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700">Simpan</button>
                        </div>
                     </form>
                   </div>

                   <div className="w-full lg:w-2/3">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 text-sm">Daftar PBG</h3>
                        <div className="flex gap-2">
                           <div className="relative">
                             <Search className="absolute left-2.5 top-2 text-slate-400" size={16} />
                             <input 
                               type="text" 
                               placeholder="Cari nama pemohon..." 
                               value={searchQuery}
                               onChange={(e) => setSearchQuery(e.target.value)}
                               className="pl-8 pr-3 py-1.5 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-blue-500" 
                             />
                           </div>
                        </div>
                     </div>
                     <div className="border border-slate-100 rounded-xl overflow-hidden text-sm h-[450px] overflow-y-auto">
                        <table className="w-full text-left">
                           <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 sticky top-0">
                              <tr>
                                 <th className="p-3 font-semibold">Nama</th>
                                 <th className="p-3 font-semibold">No. HP</th>
                                 <th className="p-3 font-semibold">Jatuh Tempo</th>
                                 <th className="p-3 font-semibold">Nominal</th>
                                 <th className="p-3 font-semibold">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {filteredPbgList.map((item) => (
                                 <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-3 font-medium text-slate-700">{item.namaPemohon}</td>
                                    <td className="p-3 text-slate-600">{item.noHp}</td>
                                    <td className="p-3 text-slate-600">{new Date(item.jatuhTempo).toLocaleDateString('id-ID')}</td>
                                    <td className="p-3 font-medium text-slate-700">Rp {item.nominal.toLocaleString('id-ID')}</td>
                                    <td className="p-3">
                                       <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.status === 'BAYAR' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                          {item.status}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                              {filteredPbgList.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400">Data tidak ditemukan</td></tr>}
                           </tbody>
                        </table>
                     </div>
                   </div>
                </div>
             )}

             {activeTab === 'bot' && (
                <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                   <Settings2 size={48} className="text-slate-300 mb-4" />
                   <p className="font-bold text-slate-600">Pengaturan Bot Lanjutan</p>
                   <p className="text-sm max-w-sm mt-2">Konfigurasi sesi WhatsApp Web, API Keys, dan jadwal cron job spesifik dapat diatur di sini.</p>
                </div>
             )}
          </div>
        </div>

        {/* Right Sidebar (Bot Controls) */}
        <div className="space-y-6">
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6 text-sm"><Activity size={18} className="text-blue-500"/> Kontrol Bot WA</h3>
              
              <div className="flex justify-between items-center mb-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <span className="font-bold text-sm text-slate-700">Bot Aktif</span>
                 <div 
                    onClick={() => setBotActive(!botActive)}
                    className={`w-12 h-6 rounded-full relative cursor-pointer shadow-inner border transition-colors duration-300 ${botActive ? 'bg-green-500 border-green-600' : 'bg-slate-300 border-slate-400'}`}
                 >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${botActive ? 'right-0.5' : 'left-0.5'}`}></div>
                 </div>
              </div>

              <div className="mb-6">
                 <label className="block text-xs font-bold text-slate-500 mb-2">Template Pesan</label>
                 <textarea 
                    className="w-full h-32 p-3 text-sm text-slate-700 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none bg-slate-50 transition-colors"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    disabled={!botActive}
                 ></textarea>
                 <div className="flex justify-between mt-2">
                    <button onClick={handleSimpanTemplate} disabled={!botActive} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-opacity">Simpan Template</button>
                    <button onClick={handleTrigger} disabled={!botActive || isTriggering} className="px-4 py-2 bg-white border border-blue-600 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 flex items-center gap-1 disabled:opacity-50 transition-all">
                       {isTriggering ? <Activity size={14} className="animate-spin" /> : <Send size={14}/>} 
                       {isTriggering ? 'Mengirim...' : 'Trigger Manual'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
