# 🚀 NextPath - AI-Powered Career Assessment & Roadmap Generator

NextPath is a full-stack SaaS application that leverages Artificial Intelligence to analyze a user's strengths and dynamically generate highly personalized, 6-month career learning roadmaps.

*(Note to recruiter: Click the GIF below to see the AI assessment and roadmap generation in action!)*

![Project Preview](./preview.mp4) ## ✨ Features
* **🧠 AI Skill Assessment:** Users take a dynamic 10-question behavioral test. The AI (Groq LLaMA 3) analyzes their analytical, technical, social, management, and creative traits to recommend their Top 3 perfect career paths.
* **🗺️ Dynamic Learning Roadmaps:** Bypassing generic templates, the AI generates a custom 6-month timeline with specific phases, focuses, and 24 actionable learning milestones.
* **📈 Gamified Progress Tracking:** An interactive timeline allows users to check off milestones. The React frontend instantly updates the UI with toast notifications while seamlessly syncing the user's completion percentage to the MongoDB database.
* **⚡ Premium UI/UX:** Built for a seamless user experience featuring skeleton loaders, custom routing, and smooth Framer Motion page transitions.

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion, React Hot Toast, Axios
* **Backend:** Node.js, Express.js, JWT Authentication, RESTful APIs
* **Database:** MongoDB & Mongoose
* **AI Engine:** Groq API (LLaMA 3.3 70B Versatile Model) - *Engineered with strict JSON-mode prompting for reliable, parseable data structures.*

## 🚀 Getting Started (Local Development)

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/nextpath.git](https://github.com/yourusername/nextpath.git)