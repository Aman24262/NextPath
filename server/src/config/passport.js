require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const sendEmail = require('../utils/sendEmail');

console.log("--- GOOGLE AUTH DEBUG ---");
console.log("CLIENT_ID FOUND:", process.env.GOOGLE_CLIENT_ID ? "YES (Correct)" : "NO (It is Empty!)");
console.log("-------------------------");

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // Inside your new GoogleStrategy block:
            callbackURL: "https://nextpath-vv0x.onrender.com/api/auth/google/callback", // Must match your Google Cloud Console
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                // 1. Check if the user already exists in our database by Google ID
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // User already exists, log them in
                    return done(null, user);
                }

                // 2. Check if a user with the same email exists
                // (This happens if they signed up with email/password first, then later hit "Continue with Google")
                user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // Update the existing user to add the googleId to their account structure
                    user.googleId = profile.id;
                    await user.save();
                    return done(null, user);
                }

                // 3. User doesn't exist at all. Create a new user!
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    // Note: No password provided. The model now handles this properly.
                    isEmailVerified: true, // Google emails are already verified
                    profile: {
                        avatar: profile.photos[0].value
                    }
                });

                // Send Welcome Email to the new Google user
                try {
                    await sendEmail({
                        email: user.email,
                        subject: 'Welcome to NextPath! 🚀',
                        message: `
                            <h1>Welcome to NextPath, ${user.name}!</h1>
                            <p>We see you signed up with Google. We're thrilled to have you on board.</p>
                            <p>NextPath is your personal guide to building a successful career path.</p>
                            <p>To get started, please log in and complete your initial assessment so we can personalize your experience!</p>
                            <br/>
                            <p>Best Regards,</p>
                            <p>The NextPath Team</p>
                        `
                    });
                } catch (emailError) {
                    console.error("Google Welcome email failed to send:", emailError);
                }

                done(null, user);
            } catch (error) {
                console.error("Passport Google Error:", error);
                done(error, null);
            }
        }
    )
);
