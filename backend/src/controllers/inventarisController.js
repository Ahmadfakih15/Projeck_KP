const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/inventaris/barang
exports.getBarang = async (req, res) => {
  try {
    const barang = await prisma.barang.findMany();
    res.json(barang);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/inventaris/tiket
exports.createTiket = async (req, res) => {
  try {
    const { jenis, deskripsi, barangId } = req.body;
    const tiket = await prisma.tiket.create({
      data: {
        userId: req.user.id,
        jenis,
        deskripsi,
        barangId: barangId ? parseInt(barangId) : null,
      },
    });
    res.status(201).json(tiket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/inventaris/tiket
exports.getAllTiket = async (req, res) => {
  try {
    const tiket = await prisma.tiket.findMany({
      include: {
        user: { select: { name: true, bidang: true } },
        barang: { select: { nama: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tiket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/inventaris/tiket/me
exports.getMyTiket = async (req, res) => {
  try {
    const tiket = await prisma.tiket.findMany({
      where: { userId: req.user.id },
      include: { barang: { select: { nama: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tiket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/inventaris/tiket/:id
exports.updateTiketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const tiket = await prisma.tiket.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.json(tiket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
