const Audiobook = require('../models/Audiobook');

// @desc  Create a new audiobook
// @route POST /api/audiobooks
const createAudiobook = async (req, res) => {
  try {
    const { title, author, narrator, description, category } = req.body;
    const coverImage = req.files?.cover ? req.files.cover[0].path : '';

    const audiobook = await Audiobook.create({
      title,
      author,
      narrator,
      description,
      category,
      coverImage,
      uploadedBy: req.user._id,
      chapters: [],
    });

    res.status(201).json(audiobook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add a chapter to an existing audiobook
// @route POST /api/audiobooks/:id/chapters
const addChapter = async (req, res) => {
  try {
    const audiobook = await Audiobook.findById(req.params.id);
    if (!audiobook) return res.status(404).json({ message: 'Audiobook not found' });

    if (audiobook.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your audiobook' });
    }

    if (!req.files?.audio) {
      return res.status(400).json({ message: 'Audio file required' });
    }

    const { title, chapterNumber } = req.body;
    audiobook.chapters.push({
      title,
      chapterNumber,
      audioUrl: req.files.audio[0].path,
    });

    await audiobook.save();
    res.status(201).json(audiobook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all audiobooks
// @route GET /api/audiobooks
const getAudiobooks = async (req, res) => {
  try {
    const audiobooks = await Audiobook.find().populate('uploadedBy', 'name');
    res.json(audiobooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single audiobook with chapters
// @route GET /api/audiobooks/:id
const getAudiobookById = async (req, res) => {
  try {
    const audiobook = await Audiobook.findById(req.params.id).populate('uploadedBy', 'name');
    if (!audiobook) return res.status(404).json({ message: 'Audiobook not found' });
    res.json(audiobook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAudiobook, addChapter, getAudiobooks, getAudiobookById };