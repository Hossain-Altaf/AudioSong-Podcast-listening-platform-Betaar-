const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'spotify-clone',
    resource_type: 'auto', // handles audio + images
    allowed_formats: ['mp3', 'wav', 'jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

module.exports = upload;