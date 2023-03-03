const Joi = require('joi');
const { BlogPost } = require('../models');
const { UserBlogPost } = require('../models');

const blogPostSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

const createBlogPost = async (req, res) => {
  try {
    const { error } = blogPostSchema.validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const blogPost = await BlogPost.create(req.body);

    const userBlogPost = {
      user_id: req.user.id,
      blog_post_id: blogPost.id,
    };

    await UserBlogPost.create(userBlogPost);

    return res.status(201).json(blogPost);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().sort({ createdAt: -1 });
    return res.json(blogPosts);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

const getBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).send('Blog Post not found');
    }

    return res.json(blogPost);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

const updateBlogPostById = async (req, res) => {
  try {
    const { error } = blogPostSchema.validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const blogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!blogPost) {
      return res.status(404).send('Blog Post not found');
    }

    return res.json(blogPost);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

const deleteBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).send('Blog Post not found');
    }

    await blogPost.remove();

    await UserBlogPost.deleteMany({ blog_post_id: blogPost.id });

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

module.exports = {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPostById,
  deleteBlogPostById,
};
