import { v2 as cloudinary } from "cloudinary";
import { validateMediaUpload } from "../middleware/uploadMiddleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a new post
const createPost = [
  validateMediaUpload("postImage"), // Using validateMediaUpload instead of validateImageUpload
  async (req, res) => {
    try {
      const { title, content, communityId } = req.body;
      const authorId = req.userId; // From auth middleware

      // Validate required fields
      if (!title || !content || !communityId) {
        return res.status(400).json({
          error: "Title, content, and communityId are required.",
        });
      }

      // Check if community exists
      const communityExists = await prisma.community.findUnique({
        where: { id: communityId },
      });

      if (!communityExists) {
        return res.status(404).json({ error: "Community not found." });
      }

      // Upload media to Cloudinary (if provided)
      let imageUrl;
      if (req.files && req.files.postImage) {
        const file = req.files.postImage;
        const isVideo = req.isVideo; // Set by validateMediaUpload middleware

        // Configure upload based on resource type
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          resource_type: isVideo ? "video" : "image",
          folder: "post_media",
        });

        imageUrl = result.secure_url;
      }

      // Create the post
      const post = await prisma.post.create({
        data: {
          title,
          content,
          imageUrl, // Using existing imageUrl field for both images and videos
          communityId,
          authorId,
        },
        include: {
          author: {
            select: {
              id: true,
              userName: true,
            },
          },
          community: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(201).json({
        status: "success",
        data: post,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  },
];

// Update a post
const updatePost = [
  validateMediaUpload("postImage"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const userId = req.userId;

      // Find the post
      const post = await prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found." });
      }

      // Check if user is the author
      if (post.authorId !== userId) {
        return res
          .status(403)
          .json({ error: "You can only update your own posts." });
      }

      // Update media if provided
      let imageUrl = post.imageUrl;
      if (req.files && req.files.postImage) {
        // Delete old media if exists
        if (post.imageUrl) {
          // Extract the public ID from the URL
          const urlParts = post.imageUrl.split("/");
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split(".")[0];
          const folderName = urlParts[urlParts.length - 2];

          // Check if it's a video URL
          const isExistingVideo =
            post.imageUrl.includes("video") ||
            urlParts.some((part) => part.includes("video"));

          // Delete the resource with the appropriate resource_type
          await cloudinary.uploader.destroy(`post_media/${publicId}`, {
            resource_type: isExistingVideo ? "video" : "image",
          });
        }

        // Upload new media
        const isVideo = req.isVideo;
        const result = await cloudinary.uploader.upload(
          req.files.postImage.tempFilePath,
          {
            resource_type: isVideo ? "video" : "image",
            folder: "post_media",
          }
        );

        imageUrl = result.secure_url;
      }

      // Update the post
      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          title: title || post.title,
          content: content || post.content,
          imageUrl,
          updatedAt: new Date(),
        },
        include: {
          author: {
            select: {
              id: true,
              userName: true,
            },
          },
          community: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(200).json({
        status: "success",
        data: updatedPost,
      });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  },
];

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find the post
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Check if user is the author
    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own posts." });
    }

    // Delete media from Cloudinary if exists
    if (post.imageUrl) {
      // Extract the public ID from the URL
      const urlParts = post.imageUrl.split("/");
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split(".")[0];

      // Check if it's a video URL
      const isVideo =
        post.imageUrl.includes("video") ||
        urlParts.some((part) => part.includes("video"));

      // Delete the resource with the appropriate resource_type
      await cloudinary.uploader.destroy(`post_media/${publicId}`, {
        resource_type: isVideo ? "video" : "image",
      });
    }

    // Delete the post (comments and votes will cascade delete)
    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({
      status: "success",
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
// Get all posts (with optional community filter)
const getPosts = async (req, res) => {
  try {
    const { communityId } = req.query;

    const filter = communityId ? { communityId } : {};

    const posts = await prisma.post.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            userName: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
    });

    // Calculate vote count for each post
    const postsWithVoteCount = await Promise.all(
      posts.map(async (post) => {
        const upvotes = await prisma.vote.count({
          where: {
            postId: post.id,
            type: "UP",
          },
        });

        const downvotes = await prisma.vote.count({
          where: {
            postId: post.id,
            type: "DOWN",
          },
        });

        return {
          ...post,
          voteScore: upvotes - downvotes,
          upvotes,
          downvotes,
        };
      })
    );

    res.status(200).json({
      status: "success",
      results: posts.length,
      data: postsWithVoteCount,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get a single post by ID
const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            userName: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                userName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Get vote counts
    const upvotes = await prisma.vote.count({
      where: {
        postId: id,
        type: "UP",
      },
    });

    const downvotes = await prisma.vote.count({
      where: {
        postId: id,
        type: "DOWN",
      },
    });

    // Check if user has voted on this post
    let userVote = null;
    if (req.userId) {
      const vote = await prisma.vote.findUnique({
        where: {
          userId_postId: {
            userId: req.userId,
            postId: id,
          },
        },
      });

      if (vote) {
        userVote = vote.type;
      }
    }

    const postWithVotes = {
      ...post,
      voteScore: upvotes - downvotes,
      upvotes,
      downvotes,
      userVote,
    };

    res.status(200).json({
      status: "success",
      data: postWithVotes,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export { createPost, getPosts, getPost, updatePost, deletePost };
