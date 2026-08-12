const Podcast = require('../models/Podcast');

// @desc  Create a new podcast show
// @route POST /api/podcasts
const createPodcast = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const coverImage = req.files?.cover ? req.files.cover[0].path : '';

    const podcast = await Podcast.create({
      title,
      description,
      category,
      coverImage,
      host: req.user._id,
      episodes: [],
    });

    res.status(201).json(podcast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add an episode to an existing podcast
// @route POST /api/podcasts/:id/episodes
const addEpisode = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) return res.status(404).json({ message: 'Podcast not found' });

    if (podcast.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your podcast' });
    }

    if (!req.files?.audio) {
      return res.status(400).json({ message: 'Audio file required' });
    }

    const { title, episodeNumber } = req.body;
    podcast.episodes.push({
      title,
      episodeNumber,
      audioUrl: req.files.audio[0].path,
    });

    await podcast.save();
    res.status(201).json(podcast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all podcasts
// @route GET /api/podcasts
const getPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find().populate('host', 'name profilePicture');
    res.json(podcasts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single podcast with episodes
// @route GET /api/podcasts/:id
const getPodcastById = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id).populate('host', 'name profilePicture');
    if (!podcast) return res.status(404).json({ message: 'Podcast not found' });
    res.json(podcast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPodcast, addEpisode, getPodcasts, getPodcastById };