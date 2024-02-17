const Follow = require('./follow.model');
const User = require('../auth/auth.model'); // Adjust the path according to your project structure

// Function to follow a user
exports.followUser = async (req, res) => {
    const { followedId } = req.params;
    const followerId = req.user.id;

    if (followerId === followedId) {
        return res.status(400).json({ message: "You cannot follow yourself." });
    }

    try {
        const existingFollow = await Follow.findOne({ follower: followerId, followed: followedId });
        if (existingFollow) {
            return res.status(400).json({ message: "You are already following this user." });
        }

        const follow = new Follow({ follower: followerId, followed: followedId });
        await follow.save();
        res.status(201).json({ message: "User followed successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Function to unfollow a user
exports.unfollowUser = async (req, res) => {
    const { followedId } = req.params;
    const followerId = req.user.id;

    try {
        const follow = await Follow.findOneAndDelete({ follower: followerId, followed: followedId });
        if (!follow) {
            return res.status(404).json({ message: "Follow relationship not found." });
        }
        res.json({ message: "User unfollowed successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Function to list all followers of a user
exports.listFollowers = async (req, res) => {
    const { userId } = req.params; // Assuming you pass the user ID as a parameter

    try {
        const followers = await Follow.find({ followed: userId }).populate('follower', '-password');
        res.json(followers);
    } catch (error) {
        res.status(500).json({ message: 'Server error while retrieving followers', error: error.message });
    }
};

// Function to list all users a user is following
exports.listFollowings = async (req, res) => {
    const { userId } = req.params; // Assuming you pass the user ID as a parameter

    try {
        const followings = await Follow.find({ follower: userId }).populate('followed', '-password');
        res.json(followings);
    } catch (error) {
        res.status(500).json({ message: 'Server error while retrieving followings', error: error.message });
    }
};
