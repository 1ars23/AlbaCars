const express = require('express');
// const { readFileSync } = require('fs');
const slugify = require('slugify');

const router = express.Router();

const BLOGS_JSON_FILE = './blogs.json';

router.get('/', (req, res) => {
  try {
    const blogs = require(BLOGS_JSON_FILE);
    const formattedBlogs = blogs.map((blog) => ({
      ...blog,
      date_time: new Date(blog.date_time)?.toISOString(),
      //  dateTime: new Date(blog.dateTime),
      title_slug : slugify(blog.title, { lower: true, strict: true })

    }));
    res.json(formattedBlogs);

    // res.json(blogs);
  } catch (e) {
    console.error('Error getting blog posts', e);
    res.sendStatus(500);
  }
});

module.exports = router;
