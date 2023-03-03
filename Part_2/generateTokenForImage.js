const express = require('express');
const { sign } = require('jsonwebtoken');
const { resolve } = require('path');
const { existsSync } = require('fs');

const router = express.Router();

const SECRET_KEY = 'mysecretkey';
const IMAGE_UPLOAD_DIR = './images/';

router.post('/', (req, res) => {
  const { image_path } = req.body;
  const imagePath = resolve(IMAGE_UPLOAD_DIR, image_path);

  if (!existsSync(imagePath)) {
    return res.sendStatus(404);
  }

  const token = sign({ image_path }, SECRET_KEY, { expiresIn: '5m' });
  res.json({ token });
});




module.exports = router;
