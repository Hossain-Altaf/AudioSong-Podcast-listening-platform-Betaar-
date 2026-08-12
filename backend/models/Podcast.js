const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  audioUrl: { type: String, required: true },
  duration: { type: Number, default: 0 },
  episodeNumber: { type: Number, required: true },
});

const podcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
    },
    episodes: [episodeSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Podcast', podcastSchema);