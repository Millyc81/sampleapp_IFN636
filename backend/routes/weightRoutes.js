const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { logWeight, getWeightHistory } = require('../controllers/weightController');

router.post('/', protect, logWeight);
router.get('/', protect, getWeightHistory);

module.exports = router;