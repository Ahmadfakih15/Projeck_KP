const express = require('express');
const { createJadwal, getAllJadwal, getMyJadwal, uploadBukti, verifyJadwal, getPegawai } = require('../controllers/tugasController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage });

const router = express.Router();

router.get('/users', protect, authorize('ADMIN'), getPegawai);

router.post('/', protect, authorize('ADMIN'), createJadwal);
router.get('/', protect, authorize('ADMIN'), getAllJadwal);

router.get('/me', protect, getMyJadwal);
router.put('/:id/upload', protect, upload.fields([{ name: 'foto', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), uploadBukti);

router.put('/:id/verify', protect, authorize('ADMIN'), verifyJadwal);

module.exports = router;
