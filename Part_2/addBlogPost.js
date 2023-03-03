const express = require('express');
const router = express.Router();
const { compressAndSaveImage } = require('./imageUtils');
const { body, validationResult } = require('express-validator');
const { addBlogPostValidation } = require('./validations');
const { saveBlogsToFile } = require('./fileUtils');

// const { addBlogPost } = require('../controllers/blogPostController');
const multer = require('multer');
const BLOGS_JSON_FILE = './blogs.json';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024
  },
  fileFilter: fileFilter
});

router.post('/', upload.fields([
  { name: 'main_image', maxCount: 1 },
  { name: 'additional_images', maxCount: 5 },
]), addBlogPostValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { title, description, date_time } = req.body;

  const mainImageFile = req.files['main_image'][0];
  const additionalImageFiles = req.files['additional_images'] || [];

  try {
    const blogs = require(BLOGS_JSON_FILE);
    const lastBlogPostRefNumber = blogs.length > 0 ? blogs[blogs.length - 1].reference : 0;
    const refNumber = global.parseInt(lastBlogPostRefNumber) + 1;
    const reference = refNumber.toString();
    const main_image = await compressAndSaveImage(mainImageFile, refNumber);
    const additional_images = await Promise.all(
      additionalImageFiles.map((image) => compressAndSaveImage(image, refNumber)),
    );

    const newBlogPost = {
      // refNumber,
      reference,
      title,
      // title_slug: title.replace(/\W+/g, '-').toLowerCase(),
      description,
      main_image,
      additional_images,
      // dateTime: new Date(date_time * 1000).toISOString(),
      date_time: global.parseInt(date_time),
    };

    blogs.push(newBlogPost);
    await saveBlogsToFile(blogs);
    res.status(201).json(newBlogPost);

    // return "Success";
    console.log(res);
  } catch (e) {
    console.log(res.status);
    console.error('Error adding blog post', e);
    res.sendStatus(500);
  }
});


module.exports = router;
