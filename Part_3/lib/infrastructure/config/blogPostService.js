const { ObjectId } = require('mongoose').Types;

class BlogPostService {
  constructor(blogPostRepository, userBlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
    this.userBlogPostRepository = userBlogPostRepository;
  }

  async getAllBlogPosts() {
    const blogPosts = await this.blogPostRepository.getAllBlogPosts();
    return blogPosts;
  }

  async getBlogPostById(blogPostId) {
    if (!ObjectId.isValid(blogPostId)) {
      throw new Error('Invalid blog post ID');
    }

    const blogPost = await this.blogPostRepository.getBlogPostById(blogPostId);
    if (!blogPost) {
      throw new Error('Blog post not found');
    }

    return blogPost;
  }

  async addBlogPost(userId, title, content) {
    const blogPost = await this.blogPostRepository.addBlogPost(title, content);
    await this.userBlogPostRepository.addUserBlogPost(userId, blogPost._id);
    return blogPost;
  }

  async updateBlogPost(blogPostId, title, content) {
    if (!ObjectId.isValid(blogPostId)) {
      throw new Error('Invalid blog post ID');
    }

    const blogPost = await this.blogPostRepository.getBlogPostById(blogPostId);
    if (!blogPost) {
      throw new Error('Blog post not found');
    }

    blogPost.title = title;
    blogPost.content = content;
    await blogPost.save();
    return blogPost;
  }

  async deleteBlogPost(blogPostId) {
    if (!ObjectId.isValid(blogPostId)) {
      throw new Error('Invalid blog post ID');
    }

    const blogPost = await this.blogPostRepository.getBlogPostById(blogPostId);
    if (!blogPost) {
      throw new Error('Blog post not found');
    }

    await this.userBlogPostRepository.deleteUserBlogPostByBlogPostId(blogPostId);
    await blogPost.remove();
  }
}

module.exports = BlogPostService;
