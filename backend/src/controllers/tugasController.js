const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/tugas
exports.createJadwal = async (req, res) => {
  try {
    const { userId, jenisTugas, lokasi, tanggal, tanggalMulai, tanggalSelesai } = req.body;
    
    if (tanggalMulai && tanggalSelesai) {
      let current = new Date(tanggalMulai);
      let end = new Date(tanggalSelesai);
      let jadwals = [];
      while(current <= end) {
        // Skip weekends? Let's just create for all selected days
        jadwals.push({
          userId: parseInt(userId),
          jenisTugas,
          lokasi,
          tanggal: new Date(current)
        });
        current.setDate(current.getDate() + 1);
      }
      await prisma.jadwal.createMany({ data: jadwals });
      return res.status(201).json({ message: 'Jadwal rentang waktu berhasil dibuat' });
    } else {
      const jadwal = await prisma.jadwal.create({
        data: {
          userId: parseInt(userId),
          jenisTugas,
          lokasi,
          tanggal: new Date(tanggal),
        }
      });
      return res.status(201).json(jadwal);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/tugas
exports.getAllJadwal = async (req, res) => {
  try {
    const jadwal = await prisma.jadwal.findMany({
      include: { user: { select: { name: true, nip: true, bidang: true } } },
      orderBy: { tanggal: 'desc' }
    });
    res.json(jadwal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/tugas/me
exports.getMyJadwal = async (req, res) => {
  try {
    const jadwal = await prisma.jadwal.findMany({
      where: { userId: req.user.id },
      orderBy: { tanggal: 'desc' }
    });
    res.json(jadwal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/tugas/:id/upload
exports.uploadBukti = async (req, res) => {
  try {
    const { id } = req.params;
    
    let buktiUrl = null;
    let pdfUrl = null;

    if (req.files) {
       if (req.files.foto) buktiUrl = '/uploads/' + req.files.foto[0].filename;
       if (req.files.pdf) pdfUrl = '/uploads/' + req.files.pdf[0].filename;
    }

    const jadwal = await prisma.jadwal.update({
      where: { id: parseInt(id) },
      data: { 
        status: 'MENUNGGU_VERIFIKASI',
        buktiUrl: buktiUrl || 'foto_bukti_geotag.jpg',
        pdfUrl: pdfUrl || null
      }
    });
    res.json(jadwal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/tugas/:id/verify
exports.verifyJadwal = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'ACC' or 'TOLAK'
    
    const status = action === 'ACC' ? 'SELESAI' : 'BELUM_DIKERJAKAN';
    
    const jadwal = await prisma.jadwal.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.json(jadwal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/tugas/users
exports.getPegawai = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'PEGAWAI' },
      select: { id: true, name: true, nip: true, bidang: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
