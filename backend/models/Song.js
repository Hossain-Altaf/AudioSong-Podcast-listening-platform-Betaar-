const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    audioUrl: {
      type: String,
      required: true, // Cloudinary URL
    },
    coverImage: {
      type: String,
      default: '',
    },
    lyrics: {
      type: String,
      default: '',
    },
    genre: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    plays: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Song', songSchema);