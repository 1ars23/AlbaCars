const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const { sign } = require('jsonwebtoken');

const User = require('../models/User');
const UserBlogPost = require('../models/UserBlogPost');
const BlogPost = require('../models/BlogPost');
const { JWT_SECRET_KEY } = require('../config');
const { validateUser } = require('../validators/userValidator');

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json({ users });
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.sendStatus(404);
  }

  res.json({ user });
};

const addUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const user = new User({
    _id: uuidv4(),
    name,
    email,
    password,
  });

  await user.save();

  const accessToken = sign({ userId: user._id }, JWT_SECRET_KEY, {
    expiresIn: '1h',
  });

  res.json({ user, accessToken });
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser._id.toString() !== id) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { name, email, password },
    { new: true }
  );

  if (!updatedUser) {
    return res.sendStatus(404);
  }

  res.json({ user: updatedUser });
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    return res.sendStatus(404);
  }

  // Delete user_blog_post and blog_post for the deleted user
  await UserBlogPost.deleteMany({ user_id: id });
  await BlogPost.deleteMany({ user_id: id });

  res.json({ user: deletedUser });
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUserById,
  deleteUserById,
};
