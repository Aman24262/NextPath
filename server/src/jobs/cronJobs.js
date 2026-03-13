const cron = require('node-cron');
const User = require('../models/user.model');
const Assessment = require('../models/assessment.model');
const sendEmail = require('../utils/sendEmail');

// This function will check and send reminders
const checkAndSendReminders = async () => {
    try {
        console.log("Running Daily Cron Job: Checking for Assessment Reminders...");

        // Find the date exactly 24 hours ago
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // 1. Find all users who:
        // - Were created BEFORE 24 hours ago
        // - Haven't had a reminder sent yet
        const usersToRemind = await User.find({
            createdAt: { $lte: twentyFourHoursAgo },
            assessmentReminderSent: false
        });

        if (usersToRemind.length === 0) {
            console.log("Cron Job: No users need reminders today.");
            return;
        }

        console.log(`Cron Job: ${usersToRemind.length} users are eligible for a reminder. Verifying...`);

        // 2. Loop through eligible users and check if they actually completed the assessment
        for (const user of usersToRemind) {
            const hasCompletedAssessment = await Assessment.findOne({ user: user._id });

            if (!hasCompletedAssessment) {
                // User has NOT completed the assessment - Send Email!
                try {
                    await sendEmail({
                        email: user.email,
                        subject: 'Don\'t forget your NextPath Assessment! 🚀',
                        message: `
                            <h1>Hi ${user.name},</h1>
                            <p>We noticed it's been a day since you joined NextPath, but you haven't completed your initial Career Assessment yet!</p>
                            <p>To get the most out of our platform and receive personalized career recommendations, please log in and take the 5-minute assessment.</p>
                            <br/>
                            <a href="http://localhost:5173/dashboard" style="display:inline-block;padding:10px 20px;background-color:#4f46e5;color:#ffffff;text-decoration:none;border-radius:5px;font-weight:bold;">Go to Dashboard</a>
                            <br/><br/>
                            <p>Best Regards,</p>
                            <p>The NextPath Team</p>
                        `
                    });
                    
                    console.log(`Reminder sent successfully to ${user.email}`);

                } catch (emailError) {
                    console.error(`Failed to send reminder to ${user.email}`, emailError);
                }
            }

            // Regardless of whether they completed it or just got the email, 
            // set the flag to true so we never process them again.
            user.assessmentReminderSent = true;
            await user.save();
        }

        console.log("Cron Job: Assessment checking complete.");

    } catch (error) {
        console.error("Error in checkAndSendReminders Job:", error);
    }
};

// Initialize the cron job
const initCronJobs = () => {
    // Schedule task to run every day at Midnight (0 0 * * *)
    // For testing purposes, you could change this to '* * * * *' to run every minute
    cron.schedule('0 0 * * *', () => {
        checkAndSendReminders();
    });

    console.log("Cron jobs initialized.");
};

module.exports = { initCronJobs };
