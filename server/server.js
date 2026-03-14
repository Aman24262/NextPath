require('dotenv').config();

const connectDB = require('./src/config/db.js');
const cronJobs = require('./src/jobs/cronJobs.js');
const app = require('./src/app.js');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      cronJobs.initCronJobs();
    });
  })
  .catch((err) => {
    console.error('❌ Database Connection Failed:', err.message);
    process.exit(1);
  });