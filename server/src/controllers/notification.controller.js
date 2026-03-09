const Notification = require('../models/notification.model');

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        // Fetch notifications and sort by newest first
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching notifications', error: error.message });
    }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id, user: req.user.id });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: notification
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating notification', error: error.message });
    }
};