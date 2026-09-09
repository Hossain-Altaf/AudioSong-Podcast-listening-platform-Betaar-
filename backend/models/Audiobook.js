const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  audioUrl: { type: String, required: true },
  duration: { type: Number, default: 0 },
  chapterNumber: { type: Number, required: true },
});

const audiobookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String, // book's actual author (not necessarily the uploading user)
      required: true,
    },
    narrator: {
      type: String,
      default: '',
    },
    uploadedBy: {
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
    chapters: [chapterSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Audiobook', audiobookSchema);