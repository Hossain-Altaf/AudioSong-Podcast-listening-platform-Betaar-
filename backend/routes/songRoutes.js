const express = require('express');
const router = express.Router();
const { uploadSong, getSongs, getSongById } = require('../controllers/songController');
const { protect, artistOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post(
  '/',
  protect,
  artistOnly,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  uploadSong
);

router.get('/', getSongs);
router.get('/:id', getSongById);

module.exports = router;