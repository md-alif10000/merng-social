const Post = require("../../models/Post");
const authCheck = require("../../utils/auth");
const { AuthenticationError } = require("apollo-server");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },

    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not Found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = await authCheck(context);
      console.log(user);

      const newPost = new Post({
        body,
        user: user._id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();
      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = authCheck(context);

      try {
        const post = await Post.findById(postId);

        if (user.username == post.username) {
          const deletedPost = await Post.findByIdAndDelete(postId);
          console.log("post deleted");
          return "Post deleted successfully....";
        } else {
          throw new AuthenticationError("You can't delete other's post");
        }
      } catch (error) {
        return error;
      }
    },
  },
};
