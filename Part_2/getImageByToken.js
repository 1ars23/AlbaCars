const express = require('express');
const { verify } = require('jsonwebtoken');
const { resolve } = require('path');

const router = express.Router();

const SECRET_KEY = 'mysecretkey';
const IMAGE_UPLOAD_DIR = './images/';

router.get('/', (req, res) => {
  const { image_path, token } = req.body;

  // Verify the token
  try {
    const decoded = verify(token, SECRET_KEY);
    if (decoded.image_path !== image_path) {
      throw new Error('Invalid token');
    }
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token or Token Expired' });
  }

  // Send the image file
  const imagePath = resolve(IMAGE_UPLOAD_DIR, image_path);
  res.setHeader('Content-Type', 'image/jpeg');
  res.sendFile(imagePath);
});

module.exports = router;
