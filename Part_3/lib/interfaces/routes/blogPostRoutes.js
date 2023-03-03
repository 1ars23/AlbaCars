const express = require('express');
const { validate } = require('../middlewares/validation');
const { blogPostValidation } = require('../validations/BlogPostValidation');
const { createBlogPost, getBlogPosts, getBlogPostById, updateBlogPost, deleteBlogPost } = require('../controllers/BlogPostController');

const router = express.Router();

router.get('/', getBlogPosts);
router.get('/:id', getBlogPostById);
router.post('/', validate(blogPostValidation), createBlogPost);
router.patch('/:id', validate(blogPostValidation), updateBlogPost);
router.delete('/:id', deleteBlogPost);

module.exports = router;
