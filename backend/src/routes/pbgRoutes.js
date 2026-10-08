const express = require('express');
const { createPBG, getAllPBG, updatePBGStatus } = require('../controllers/pbgController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('ADMIN'), createPBG);
router.get('/', protect, authorize('ADMIN'), getAllPBG);
router.put('/:id/status', protect, authorize('ADMIN'), updatePBGStatus);

module.exports = router;
