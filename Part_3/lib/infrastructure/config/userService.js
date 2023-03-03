const { User, BlogPost, UserBlogPost } = require('../models');

module.exports = {
  getAllUsers: async () => {
    return await User.find();
  },

  getUserById: async (id) => {
    return await User.findById(id);
  },

  createUser: async (userData) => {
    return await User.create(userData);
  },

  updateUser: async (id, userData) => {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  },

  deleteUser: async (id) => {
    await UserBlogPost.deleteMany({ user_id: id });
    await BlogPost.deleteMany({ user_id: id });
    return await User.findByIdAndDelete(id);
  },

  addBlogPostToUser: async (userId, blogPostId) => {
    return await UserBlogPost.create({ user_id: userId, blog_post_id: blogPostId });
  },
};
