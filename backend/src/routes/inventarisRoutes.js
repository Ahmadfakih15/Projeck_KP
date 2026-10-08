const express = require('express');
const { getBarang, createTiket, getAllTiket, getMyTiket, updateTiketStatus } = require('../controllers/inventarisController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/barang', protect, getBarang);

// Tiket Routes
router.post('/tiket', protect, createTiket);
router.get('/tiket/me', protect, getMyTiket);
router.get('/tiket', protect, authorize('ADMIN'), getAllTiket);
router.put('/tiket/:id', protect, authorize('ADMIN'), updateTiketStatus);

module.exports = router;
