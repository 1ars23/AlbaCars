const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Import API routes
const addBlogPostRouter = require('./addBlogPost');
const getAllBlogPostsRouter = require('./getAllBlogPosts');
const generateTokenForImageRouter = require('./generateTokenForImage');
const getImageByTokenRouter = require('./getImageByToken');

// Set up body parser middleware to parse request bodies as JSON
app.use(bodyParser.json());

// Register API routes
app.use('/addBlogPost', addBlogPostRouter);
app.use('/getAllBlogPosts', getAllBlogPostsRouter);
app.use('/generateTokenForImage', generateTokenForImageRouter);
app.use('/getImageByToken', getImageByTokenRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


module.exports = app
