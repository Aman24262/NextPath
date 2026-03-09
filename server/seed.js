const mongoose = require('mongoose');
require('dotenv').config(); 
const Question = require('./src/models/question.model'); 

const newQuestions = [
  {
    text: "I prefer to analyze raw data and metrics to find patterns before making a decision.",
    category: "Analytical"
  },
  {
    text: "I enjoy solving complex logical puzzles and breaking down intricate systems.",
    category: "Analytical"
  },
  {
    text: "I actively spend my time learning new coding languages, frameworks, or software tools.",
    category: "Technical"
  },
  {
    text: "I am deeply interested in understanding the underlying architecture and code of applications.",
    category: "Technical"
  },
  {
    text: "I thrive in highly collaborative environments where I am constantly communicating with others.",
    category: "Social"
  },
  {
    text: "I find it easy and enjoyable to explain complex concepts to beginners with patience.",
    category: "Social"
  },
  {
    text: "When a team project falls behind, I naturally step up to reorganize the timeline and assign tasks.",
    category: "Management"
  },
  {
    text: "I prefer to set the goals and structure for a team rather than simply following instructions.",
    category: "Management"
  },
  {
    text: "It is essential for me to design completely new, out-of-the-box concepts from scratch.",
    category: "Creative"
  },
  {
    text: "I value pushing the boundaries of innovation much more than sticking to proven, standard templates.",
    category: "Creative"
  }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
        console.log("✅ Connected to Database!");

        await Question.deleteMany({});
        console.log("🗑️ Old questions deleted.");

        await Question.insertMany(newQuestions);
        console.log("✨ 10 New Likert-Scale questions successfully added!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

seedDB();