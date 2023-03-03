const { body, validationResult } = require('express-validator');

const titleValidator = body('title')
  .isString()
  .isLength({ min: 5, max: 50 })
  .matches(/^[a-zA-Z0-9 ]+$/)
  .withMessage('Title must be between 5 and 50 characters and must not contain special characters.');

const descriptionValidator = body('description')
  .isString()
  .isLength({ max: 500 })
  .withMessage('Description must be less than or equal to 500 characters.');

const mainImageValidator = body('main_image')
  .custom((value, { req }) => {
    if (!req.files.main_image) {
      throw new Error('Main image is required and must be a JPG file.');
    }
    if (req.files.main_image[0].mimetype !== 'image/jpg' && req.files.main_image[0].mimetype !== 'image/jpeg') {
      throw new Error(req.files.main_image[0].mimetype);
    }
    if (req.files.main_image[0].size > 1000000) {
      throw new Error('Main image must be less than or equal to 1 MB.');
    }
    return true;
  });

const additionalImagesValidator = body('additional_images')
  .custom((value, { req }) => {
    if (!req.files) {
      return true; // Additional images are optional
    }
    const files = req.files.additional_images;
    if (files.length > 5) {
      throw new Error('Maximum number of additional images is 5.');
    }
    for (const file of files) {
      if (file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
        throw new Error('Additional images must be JPG files.');
      }
      if (file.size > 1000000) {
        throw new Error('Additional images must be less than or equal to 1 MB.');
      }
    }
    return true;
  });


const dateTimeValidator = body('date_time')
  .isNumeric()
  .custom((value) => {
    const now = Date.now() / 1000; // Convert to Unix time
    if (value < now) {
      throw new Error('Date and time must be in the future.');
    }
    return true;
  });

const addBlogPostValidation = [
  titleValidator,
  descriptionValidator,
  mainImageValidator,
  additionalImagesValidator,
  dateTimeValidator,
];

const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  addBlogPostValidation,
  checkValidationResult,
};
