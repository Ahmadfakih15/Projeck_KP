const express = require('express');
const { getAdminStats, getPegawaiStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/admin', protect, authorize('ADMIN'), getAdminStats);
router.get('/pegawai', protect, getPegawaiStats);

module.exports = router;
