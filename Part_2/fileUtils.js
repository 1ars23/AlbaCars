const fs = require('fs');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

const BLOGS_JSON_FILE = './blogs.json';

async function saveBlogsToFile(blogs) {
  try {
    await writeFileAsync(BLOGS_JSON_FILE, JSON.stringify(blogs, null, 2));
    return "Success";
  } catch (e) {
    console.error('Error saving blogs to file', e);
    throw e;
  }
}

module.exports = { saveBlogsToFile };
