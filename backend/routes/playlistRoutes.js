const express = require('express');
const router = express.Router();
const {
  createPlaylist,
  getMyPlaylists,
  addSongToPlaylist,
} = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPlaylist);
router.get('/my', protect, getMyPlaylists);
router.put('/:id/add', protect, addSongToPlaylist);

module.exports = router;