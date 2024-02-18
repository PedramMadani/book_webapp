const Notification = require('./notification.model');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).send({ message: "Error fetching notifications" });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.id, _id: { $in: req.body.notificationIds } }, { $set: { read: true } });
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ message: "Error marking notifications as read" });
    }
};