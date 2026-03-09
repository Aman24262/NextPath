const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Career = require('./src/models/career.model');

dotenv.config();

const careers = [
    {
        title: "Data Scientist",
        description: "Analyze complex data to help companies make smarter decisions.",
        traitMatrix: { Analytical: 95, Creative: 30, Social: 40, Technical: 90, Management: 50 },
        salaryRange: "₹8L - ₹20L PA",
        marketDemand: "High",
        difficulty: "Advanced",
        estimatedLearningTime: "8-10 Months"
    },
    {
        title: "UI/UX Designer",
        description: "Design beautiful, user-friendly interfaces for apps and websites.",
        traitMatrix: { Analytical: 50, Creative: 95, Social: 70, Technical: 60, Management: 40 },
        salaryRange: "₹5L - ₹15L PA",
        marketDemand: "High",
        difficulty: "Intermediate",
        estimatedLearningTime: "4-6 Months"
    },
    {
        title: "Product Manager",
        description: "Lead teams to build products, bridging the gap between tech, business, and design.",
        traitMatrix: { Analytical: 75, Creative: 60, Social: 90, Technical: 60, Management: 95 },
        salaryRange: "₹10L - ₹25L PA",
        marketDemand: "High",
        difficulty: "Advanced",
        estimatedLearningTime: "6-8 Months"
    },
    {
        title: "Full Stack Developer",
        description: "Build both the front-end user interfaces and back-end server logic of web apps.",
        traitMatrix: { Analytical: 85, Creative: 50, Social: 30, Technical: 95, Management: 40 },
        salaryRange: "₹6L - ₹18L PA",
        marketDemand: "High",
        difficulty: "Advanced",
        estimatedLearningTime: "6-9 Months"
    }
];

const seedCareers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB...');

        await Career.deleteMany();
        console.log('🗑️  Cleared old careers...');

        await Career.insertMany(careers);
        console.log('🚀 Successfully seeded 4 Core Careers!');

        process.exit();
    } catch (error) {
        console.error('❌ Error seeding careers:', error);
        process.exit(1);
    }
};

seedCareers();