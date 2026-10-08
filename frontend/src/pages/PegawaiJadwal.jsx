import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, UploadCloud, FileText, Image as ImageIcon } from 'lucide-react';

export default function PegawaiJadwal() {
  const [jadwalList, setJadwalList] = useState([]);
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [foto, setFoto] = useState(null);
  const [pdf, setPdf] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.token : '';

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tugas/me', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setJadwalList(data || []);
      
      // Auto select the first incomplete task
      const activeTask = data.find(t => t.status === 'BELUM_DIKERJAKAN');
      if (activeTask && !selectedJadwal) setSelectedJadwal(activeTask);
      else if (data.length > 0 && !selectedJadwal) setSelectedJadwal(data[0]);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleUpload = async () => {
    if (!selectedJadwal) return;
    if (!foto) return alert('Mohon pilih foto bukti!');
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('foto', foto);
      if (pdf) formData.append('pdf', pdf);

      const res = await fetch(`http://localhost:5000/api/tugas/${selectedJadwal.id}/upload`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Upload gagal');
      }

      alert('Bukti tugas berhasil diupload! Menunggu verifikasi admin.');
      fetchData(); // refresh list
      setSelectedJadwal(null);
      setFoto(null);
      setPdf(null);
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
    setUploading(false);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Detail Tugas & Upload Bukti</h2>
           <p className="text-slate-500 text-sm mt-1">Selesaikan tugas Anda dan unggah laporan pelaksanaannya di sini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Jadwal Tugas Saya (Left Column) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit max-h-[600px] overflow-y-auto">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">Jadwal Tugas Saya</h3>
           
           <div className="space-y-4">
              {jadwalList.map(jadwal => {
                 const dateStr = new Date(jadwal.tanggal).toLocaleDateString('id-ID');
                 const isSelected = selectedJadwal?.id === jadwal.id;
                 const isDone = jadwal.status === 'SELESAI' || jadwal.status === 'MENUNGGU_VERIFIKASI';
                 
                 return (
                    <div 
                      key={jadwal.id} 
                      onClick={() => !isDone && setSelectedJadwal(jadwal)}
                      className={`p-4 rounded-xl border shadow-sm relative overflow-hidden transition ${
                         isDone ? 'border-green-200 bg-green-50 opacity-80' : 
                         isSelected ? 'border-blue-300 bg-blue-50 transform scale-105 my-2 cursor-pointer' : 
                         'border-slate-200 bg-white hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isDone ? 'bg-green-500' : isSelected ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                      <div className="flex justify-between items-start mb-2">
                         <div>
                            <h4 className="font-bold text-slate-800 text-sm">{jadwal.jenisTugas}</h4>
                            <p className="text-xs text-slate-500 mt-1">{dateStr} • {jadwal.lokasi}</p>
                         </div>
                         <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isDone ? 'text-green-700 bg-green-200' : 'text-blue-700 bg-blue-200'
                         }`}>
                            {jadwal.status.replace('_', ' ')}
                         </span>
                      </div>
                    </div>
                 );
              })}
              {jadwalList.length === 0 && <p className="text-sm text-slate-500 text-center">Belum ada tugas untuk Anda.</p>}
           </div>
        </div>

        {/* Upload Bukti Tugas (Middle & Right Column) */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
              <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2"><UploadCloud className="text-blue-600"/> Upload Bukti Tugas</h3>
              
              {selectedJadwal ? (
                 <>
                    <p className="text-sm text-slate-500 mb-6">Tugas: <span className="font-bold text-slate-700">{selectedJadwal.jenisTugas}</span> • {selectedJadwal.lokasi}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                       <label className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                          <input type="file" className="hidden" accept="image/*" onChange={e => setFoto(e.target.files[0])} />
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                             <ImageIcon size={24} />
                          </div>
                          <p className="font-bold text-slate-700 text-sm">{foto ? foto.name : 'Upload Foto Bukti'}</p>
                          <p className="text-xs text-slate-400 mt-1">Format: JPG, PNG (Wajib)</p>
                       </label>

                       <label className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                          <input type="file" className="hidden" accept=".pdf" onChange={e => setPdf(e.target.files[0])} />
                          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                             <FileText size={24} />
                          </div>
                          <p className="font-bold text-slate-700 text-sm">{pdf ? pdf.name : 'Upload Draf PDF'}</p>
                          <p className="text-xs text-slate-400 mt-1">Hasil Pengawasan (Opsional)</p>
                       </label>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
                       <button onClick={() => { setSelectedJadwal(null); setFoto(null); setPdf(null); }} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition text-sm">Batal</button>
                       <button disabled={uploading} onClick={handleUpload} className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition text-sm disabled:opacity-50">
                          {uploading ? 'Mengupload...' : 'Submit Laporan'}
                       </button>
                    </div>
                 </>
              ) : (
                 <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 mt-4">
                    <p className="text-slate-400 font-medium text-sm">Pilih tugas yang belum selesai di sebelah kiri untuk upload bukti.</p>
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
