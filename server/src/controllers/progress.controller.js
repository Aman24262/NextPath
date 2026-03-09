const Roadmap = require('../models/roadmap.model');

// @desc    Mark a task as completed and recalculate overall progress
// @route   PUT /api/progress/:roadmapId/task/:taskId
// @access  Private
exports.updateTaskStatus = async (req, res) => {
    try {
        const { roadmapId, taskId } = req.params;
        const { isCompleted } = req.body; // Expects a true or false value

        // 1. Find the user's roadmap
        const roadmap = await Roadmap.findOne({ _id: roadmapId, user: req.user.id });
        if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap not found or unauthorized' });
        }

        let taskFound = false;
        let totalTasks = 0;
        let completedTasks = 0;

        // 2. Loop through milestones and tasks to find the specific one
        roadmap.milestones.forEach(milestone => {
            milestone.tasks.forEach(task => {
                // Mongoose automatically gives every task inside an array its own _id!
                if (task._id.toString() === taskId) {
                    task.isCompleted = isCompleted;
                    taskFound = true;
                }
                
                // Keep track of the numbers for our math calculation
                totalTasks++;
                if (task.isCompleted) {
                    completedTasks++;
                }
            });
        });

        if (!taskFound) {
            return res.status(404).json({ message: 'Task not found in this roadmap' });
        }

        // 3. Calculate the new overall progress percentage
        roadmap.overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        // 4. Save the updated roadmap
        await roadmap.save();

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            overallProgress: roadmap.overallProgress,
            roadmap
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating progress', error: error.message });
    }
};