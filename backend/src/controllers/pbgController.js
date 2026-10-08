const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/pbg
exports.createPBG = async (req, res) => {
  try {
    const { namaPemohon, noHp, lokasi, noSkrd, nominal, jatuhTempo } = req.body;
    const pbg = await prisma.pBG.create({
      data: {
        namaPemohon, noHp, lokasi, noSkrd,
        nominal: parseFloat(nominal),
        jatuhTempo: new Date(jatuhTempo),
      }
    });
    res.status(201).json(pbg);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/pbg
exports.getAllPBG = async (req, res) => {
  try {
    const pbgList = await prisma.pBG.findMany({
      orderBy: { jatuhTempo: 'asc' }
    });
    res.json(pbgList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/pbg/:id/status
exports.updatePBGStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'MENUNGGU', 'BAYAR'
    const pbg = await prisma.pBG.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.json(pbg);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
