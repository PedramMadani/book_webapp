const Post = require('./post.model');

// Create a new post
exports.createPost = async (req, res) => {
    const { text, photoUrl } = req.body;
    try {
        const newPost = new Post({
            user: req.user.id, // Assuming req.user is populated from the auth middleware
            text,
            photoUrl
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating a post', error: error.message });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    const { postId } = req.params;
    const { text, photoUrl } = req.body;
    try {
        const post = await Post.findOneAndUpdate(
            { _id: postId, user: req.user.id },
            { $set: { text, photoUrl } },
            { new: true }
        );
        if (!post) {
            return res.status(404).json({ message: "Post not found or user not authorized to update this post." });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating the post', error: error.message });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findOneAndDelete({ _id: postId, user: req.user.id });
        if (!post) {
            return res.status(404).json({ message: "Post not found or user not authorized to delete this post." });
        }
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting the post', error: error.message });
    }
};

// Like or unlike a post
exports.toggleLikePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        const index = post.likes.indexOf(req.user.id);
        if (index === -1) {
            // Like the post
            post.likes.push(req.user.id);
        } else {
            // Unlike the post
            post.likes.splice(index, 1);
        }
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error while toggling like on the post', error: error.message });
    }
};

// Add a comment to a post
exports.addCommentToPost = async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        post.comments.push({
            text,
            postedBy: req.user.id
        });
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error while adding a comment to the post', error: error.message });
    }
};

// Delete a comment from a post (assuming commentId is passed in the request)
exports.deleteCommentFromPost = async (req, res) => {
    const { postId, commentId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        // Remove the comment from the post
        post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting a comment from the post', error: error.message });
    }
};
