const cloudinary = require('../config/cloudinary');

const uploadImageToCloudinary = (fileBuffer, folder = 'uploads') => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(fileBuffer);
      });
}

module.exports = uploadImageToCloudinary;