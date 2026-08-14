const express = require('express');
const router = express.Router();
const {
  createAudiobook,
  addChapter,
  getAudiobooks,
  getAudiobookById,
} = require('../controllers/audiobookController');
const { protect, artistOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/', protect, artistOnly, upload.fields([{ name: 'cover', maxCount: 1 }]), createAudiobook);
router.post('/:id/chapters', protect, artistOnly, upload.fields([{ name: 'audio', maxCount: 1 }]), addChapter);
router.get('/', getAudiobooks);
router.get('/:id', getAudiobookById);

module.exports = router;