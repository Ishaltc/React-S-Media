import Post from "../models/Post.js";
import User from "../models/User.js";
//  await post.populate("user", "first_name last_name cover picture username");

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find().populate(
      "user",
      "firstName,lastName,location"
    );

    res.status(201).json({ message: "Post created successfully", data: post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().populate(
      "user",
      "firstName,lastName,location"
    );
    res
      .status(200)
      .json({ message: "Post retrieved successfully", data: post });
  } catch (err) {
    res.status(5000).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }).populate(
      "user",
      "firstName,lastName,location"
    );
    res
      .status(200)
      .json({ message: "User post retrieved successfully", data: post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    ).populate("user", "firstName,lastName,location");

    res
      .status(200)
      .json({ message: "Post updated successfully", data: updatedPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
