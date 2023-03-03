const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');


describe('POST /addBlogPost', () => {
  test('It should respond with 201 status code and new blog post object', async () => {
    const requestBody = {
      title: 'Test Blog Post',
      description: 'This is a test new blog post',
      date_time: Date.now(),
      main_image: './images/4-Arshyan.jpg',
      additional_images_1: './images/4-Arshyan.jpg',
      additional_images_2: './images/6-Arshyan.jpg'

    }
    const res = await request(app)
      .post('/addBlogPost')
      .field('title', requestBody.title)
      .field('description', requestBody.description)
      .field('date_time', requestBody.date_time)
      .attach('main_image', requestBody.main_image)
      .attach('additional_images', requestBody.additional_images_1)
      .attach('additional_images', requestBody.additional_images_2)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    const resBlogPost = res.body;
    expect(resBlogPost.title).toEqual(requestBody.title);
    expect(resBlogPost.description).toEqual(requestBody.description);
    expect(resBlogPost.date_time).toEqual(parseInt(requestBody.date_time, 10));
    expect(resBlogPost.main_image).toBeDefined();
    expect(resBlogPost.additional_images).toBeDefined();
  });


  test('It should return a 422 error when main image file is missing', async () => {
    // Create a new blog post with invalid image files
    const res = await request(app)
      .post('/addBlogPost')
      .field('title', 'Test Blog Post')
      .field('description', 'This is a test blog post')
      .field('date_time', Date.now())
      .attach('additional_images', './images/4-Arshyan.jpg')
      .attach('additional_images', './images/6-Arshyan.jpg')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422);
    // Check that the server returns a 422 error and validation errors
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContainEqual({ location: "body", msg: "Main image is required and must be a JPG file.", param: "main_image" });
  });

  test('It should return a 422 error when main image file exceeds 1MB', async () => {
    // Create a new blog post with a main image file exceeding 1MB
    const res = await request(app)
      .post('/addBlogPost')
      .field('title', 'Test Blog Post')
      .field('description', 'This is a test blog post')
      .field('date_time', Date.now())
      .attach('main_image', './images/Aki_2.jpg')
      .attach('additional_images', './images/4-Arshyan.jpg')
      .attach('additional_images', './images/6-Arshyan.jpg')
      .set('Accept', 'application/json')
      .expect(500);
  });

  test('returns status code 422 and "title has special characters" error message if title contains special characters', async () => {
    // Check if title contains only valid characters
    const res4 = await request(app)
      .post('/addBlogPost')
      .field('title', 'Test Blog Post $%')
      .field('description', 'This is a test blog post')
      .field('date_time', Date.now())
      .attach('main_image', './images/4-Arshyan.jpg')
      .attach('additional_images', './images/4-Arshyan.jpg')
      .attach('additional_images', './images/6-Arshyan.jpg')
      .expect(422);
    expect(res4.body.errors[0].msg).toEqual('Title must be between 5 and 50 characters and must not contain special characters.');
  });

  test('returns status code 422 and "not unix time" error message if date_time is not a valid Unix timestamp', async () => {
    const res = await request(app)
      .post('/addBlogPost')
      .field('title', 'Test Blog Post')
      .field('description', 'This is a test blog post')
      .field('date_time', '2022-12-31T23:59:59.999Z')
      .attach('main_image', './images/4-Arshyan.jpg')
      .attach('additional_images', './images/4-Arshyan.jpg')
      .attach('additional_images', './images/6-Arshyan.jpg')
      .expect(422);

    expect(res.body.errors[0].param).toEqual('date_time');
    expect(res.body.errors[0].msg).toEqual('Invalid value');
  });

  test('adds a valid blog post and verifies if it is included in the list of all blog posts', async () => {
    const newBlogPost = {
      title: 'Test Blog Post',
      description: 'This is a test blog post',
      date_time: Date.now(),
      // add other required fields for the blog post here
    };

    // Add new blog post
    const addRes = await request(app)
      .post('/addBlogPost')
      .field('title', 'Test Blog Post')
      .field('description', 'This is a test blog post')
      .field('date_time', Date.now())
      .attach('main_image', './images/4-Arshyan.jpg')
      .attach('additional_images', './images/4-Arshyan.jpg')
      .attach('additional_images', './images/6-Arshyan.jpg')
      .expect(201);
    const addedBlogPost = addRes.body;

    // Get all blog posts
    const getAllRes = await request(app)
      .get('/getAllBlogPosts')
      .expect(200);
    const allBlogPosts = getAllRes.body;

    // Verify if added blog post is included in the list of all blog posts
    const addedBlogPostInAll = allBlogPosts.some((blogPost) => blogPost.reference === addedBlogPost.reference);
    expect(addedBlogPostInAll).toBe(true);
  });

  test('does not add an invalid blog post and verifies if it is not included in the list of all blog posts', async () => {
    const invalidBlogPost = {
      title: '', // missing required field
      description: 'This is a test blog post',
      date_time: Date.now(),
      // add other required fields for the blog post here
    };

    // Add invalid blog post
    const addRes = await request(app)
      .post('/addBlogPost')
      .field(invalidBlogPost)
      .expect(422);
    expect(addRes.body.errors.length).toBeGreaterThan(0); // expects at least one error

    // Get all blog posts
    const getAllRes = await request(app)
      .get('/getAllBlogPosts')
      .expect(200);
    const allBlogPosts = getAllRes.body;

    // Verify if invalid blog post is not included in the list of all blog posts
    const invalidBlogPostInAll = allBlogPosts.some((blogPost) => blogPost.reference === invalidBlogPost.reference);
    expect(invalidBlogPostInAll).toBe(false);
  });


});


// describe('GET /getImageByToken', () => {
//   // test('retrieves image data using token generated from Generate token API', async () => {
//   //   // generate a token for an image
//   //   const imagePath = './images/4-Arshyan.jpg';
//   //   const token = jwt.sign({ image_path: imagePath }, 'mysecretkey');

//   //   // retrieve the image using the generated token
//   //   const getImageByTokenRes = await request(app)
//   //     .get(`/getImageByToken?token=${token}&image_path=${imagePath}`)
//   //     .expect(200);

//   //   // check if the image data matches the original file data
//   //   const imageFilePath = path.join(__dirname, '../', imagePath);
//   //   const originalImageData = fs.readFileSync(imageFilePath);
//   //   expect(getImageByTokenRes.body).toEqual(originalImageData);
//   // });

//   test('It should generate a token for an image', async () => {
//     // Generate a token for the image
//     const tokenResponse = await request(app)
//       .post('/generateTokenForImage')
//       .field('image_path', '.images/4-Arshyan.jpg')
//       .expect(200);

//     console.log(tokenResponse.error);

//     // const { token } = tokenResponse.body;

//     // // Attempt to retrieve a different image using the same token
//     // const invalidResponse = await request(app)
//     //   .get('/getImageByToken')
//     //   .query({ image_path: './images/different-image.jpg', token })
//     //   .expect(401);

//     // expect(invalidResponse.body).toEqual({ error: 'Invalid token' });
//   });
// });