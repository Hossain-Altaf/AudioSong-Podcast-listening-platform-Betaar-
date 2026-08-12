const Playlist = require('../models/Playlist');

// @desc  Create playlist
// @route POST /api/playlists
const createPlaylist = async (req, res) => {
  try {
    const { name, isPublic } = req.body;
    const playlist = await Playlist.create({
      name,
      isPublic,
      user: req.user._id,
      songs: [],
    });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get logged-in user's playlists
// @route GET /api/playlists/my
const getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user._id }).populate('songs');
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add song to playlist
// @route PUT /api/playlists/:id/add
const addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your playlist' });
    }

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPlaylist, getMyPlaylists, addSongToPlaylist };