import { useState, useEffect } from 'react';
import { PackageSearch, Wrench, Send, Clock, FileText } from 'lucide-react';

export default function PegawaiTiket() {
  const [jenis, setJenis] = useState('ATK');
  const [barangList, setBarangList] = useState([]);
  const [tiketSaya, setTiketSaya] = useState([]);
  const [barangId, setBarangId] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.token : '';

  const fetchData = async () => {
    try {
      const resBarang = await fetch('http://localhost:5000/api/inventaris/barang', {
         headers: { Authorization: `Bearer ${token}` }
      });
      const dataBarang = await resBarang.json();
      setBarangList(dataBarang);

      const resTiket = await fetch('http://localhost:5000/api/inventaris/tiket/me', {
         headers: { Authorization: `Bearer ${token}` }
      });
      const dataTiket = await resTiket.json();
      setTiketSaya(dataTiket);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deskripsi) return alert("Keterangan wajib diisi");
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/inventaris/tiket', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          jenis: jenis === 'ATK' ? 'PERMINTAAN_BARANG' : 'LAPOR_KERUSAKAN',
          deskripsi,
          barangId: barangId || null
        })
      });
      
      if (res.ok) {
        setDeskripsi('');
        setBarangId('');
        fetchData();
        alert("Berhasil submit!");
      }
        } catch (err) {
      console.error(err);
      alert('Gagal submit: Terjadi kesalahan pada server');
    }
    setLoading(false);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Pengajuan Barang & Laporan</h2>
        <p className="text-slate-500 text-sm mt-1">Buat permintaan ATK baru atau laporkan kerusakan fasilitas instansi kepada Sekretariat.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Jenis Pengajuan</label>
              <div className="flex gap-4">
                <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${jenis === 'ATK' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-500 hover:border-blue-200'}`}>
                  <input type="radio" name="jenis" className="hidden" checked={jenis === 'ATK'} onChange={() => setJenis('ATK')} />
                  <FileText size={24} />
                  <span className="font-bold text-sm">Permintaan ATK</span>
                </label>
                <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${jenis === 'ASET' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-100 text-slate-500 hover:border-orange-200'}`}>
                  <input type="radio" name="jenis" className="hidden" checked={jenis === 'ASET'} onChange={() => setJenis('ASET')} />
                  <Wrench size={24} />
                  <span className="font-bold text-sm">Lapor Kerusakan</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {jenis === 'ATK' ? 'Barang yang Diminta' : 'Aset yang Rusak'}
              </label>
              <select value={barangId} onChange={e => setBarangId(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none transition-all text-sm">
                <option value="">Pilih (Opsional)...</option>
                {barangList.filter(b => b.kategori === jenis).map(b => (
                  <option key={b.id} value={b.id}>{b.nama} (Stok: {b.stok})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Keterangan / Keluhan Lengkap</label>
              <textarea 
                rows="4" 
                value={deskripsi}
                onChange={e => setDeskripsi(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none transition-all resize-none text-sm"
                placeholder={jenis === 'ATK' ? "Sebutkan jumlah yang dibutuhkan dan alasannya..." : "Jelaskan detail kerusakan yang terjadi..."}
              ></textarea>
            </div>

            <button disabled={loading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50">
              <Send size={16} /> {loading ? 'Memproses...' : 'Submit Tiket'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full overflow-y-auto">
            <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="text-blue-500" size={18} /> Riwayat Tiket Saya
            </h3>
            <div className="space-y-3">
              {tiketSaya.map(tiket => (
                 <div key={tiket.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                   <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-700 text-sm">{tiket.barang ? tiket.barang.nama : 'Lainnya'}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                         tiket.status === 'MENUNGGU' ? 'bg-orange-100 text-orange-700' :
                         tiket.status === 'ACC' || tiket.status === 'SELESAI' ? 'bg-green-100 text-green-700' :
                         'bg-blue-100 text-blue-700'
                      }`}>{tiket.status}</span>
                   </div>
                   <p className="text-xs text-slate-500">{tiket.jenis.replace('_', ' ')} • {new Date(tiket.createdAt).toLocaleDateString('id-ID')}</p>
                 </div>
              ))}
              {tiketSaya.length === 0 && <p className="text-sm text-slate-400">Belum ada riwayat tiket.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
