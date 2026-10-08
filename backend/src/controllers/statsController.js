const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAdminStats = async (req, res) => {
  try {
    const totalPegawai = await prisma.user.count({ where: { role: 'PEGAWAI' } });
    
    // Status pegawai = based on jadwal hari ini
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const jadwalToday = await prisma.jadwal.findMany({
      where: {
        tanggal: { gte: today, lt: tomorrow }
      }
    });

    const diLoket = jadwalToday.filter(j => j.lokasi.toLowerCase().includes('loket')).length;
    const diKecamatan = jadwalToday.filter(j => j.lokasi.toLowerCase().includes('kec')).length;
    const diKantor = totalPegawai - diLoket - diKecamatan;

    // Notifikasi
    const stokMenipis = await prisma.barang.findMany({ where: { stok: { lte: 2 } } });
    const tiketBaru = await prisma.tiket.count({ where: { status: 'MENUNGGU' } });
    const laporanVerifikasi = await prisma.jadwal.count({ where: { status: 'MENUNGGU_VERIFIKASI' } });
    const tagihanH3 = await prisma.pBG.count({ where: { status: 'MENUNGGU', jatuhTempo: { gte: today, lte: new Date(today.getTime() + 3*24*60*60*1000) } } });

    res.json({
      pegawai: { total: totalPegawai, diLoket, diKecamatan, diKantor: diKantor > 0 ? diKantor : 0 },
      notifikasi: { stokMenipis, tiketBaru, laporanVerifikasi, tagihanH3 }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

exports.getPegawaiStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const jadwalMingguIni = await prisma.jadwal.findMany({
      where: {
        userId: req.user.id,
        tanggal: { gte: today, lt: nextWeek }
      },
      orderBy: { tanggal: 'asc' }
    });

    const selesai = jadwalMingguIni.filter(j => j.status === 'SELESAI').length;
    const total = jadwalMingguIni.length;

    res.json({
      jadwalToday: jadwalMingguIni, // keep the same key for frontend compatibility
      stats: { total, selesai, belum: total - selesai }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};
