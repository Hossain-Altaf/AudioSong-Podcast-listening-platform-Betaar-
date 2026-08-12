const Song = require('../models/Song');

// @desc  Upload a new song
// @route POST /api/songs
// @access Private (artist only)
const uploadSong = async (req, res) => {
  try {
    const { title, genre, lyrics } = req.body;

    if (!req.files || !req.files.audio) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    const audioUrl = req.files.audio[0].path;
    const coverImage = req.files.cover ? req.files.cover[0].path : '';

    const song = await Song.create({
      title,
      genre,
      lyrics,
      audioUrl,
      coverImage,
      artist: req.user._id,
    });

    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all songs
// @route GET /api/songs
const getSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate('artist', 'name profilePicture');
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single song
// @route GET /api/songs/:id
const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('artist', 'name profilePicture');
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadSong, getSongs, getSongById };