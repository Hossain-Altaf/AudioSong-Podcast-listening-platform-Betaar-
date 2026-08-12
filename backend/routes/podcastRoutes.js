const express = require('express');
const router = express.Router();
const {
  createPodcast,
  addEpisode,
  getPodcasts,
  getPodcastById,
} = require('../controllers/podcastController');
const { protect, artistOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/', protect, artistOnly, upload.fields([{ name: 'cover', maxCount: 1 }]), createPodcast);
router.post('/:id/episodes', protect, artistOnly, upload.fields([{ name: 'audio', maxCount: 1 }]), addEpisode);
router.get('/', getPodcasts);
router.get('/:id', getPodcastById);

module.exports = router;