require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const seedCourses = async () => {
  try {
    await connectDB();

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    const courses = [
      {
        courseCode: 'CS101',
        courseName: 'Operating Systems',
        professorName: 'Mr. Anandkumar Birajdar',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
      },
      {
        courseCode: 'CS201',
        courseName: 'Data Structures and Algorithms',
        professorName: 'Mr. Minal Shahakar',
        imageUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
      },
      {
        courseCode: 'CS301',
        courseName: 'Web Technologies and Frameworks',
        professorName: 'Prof. Rucha Shinde',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
      },
      {
        courseCode: 'CS401',
        courseName: 'Design and Analysis of Algorithms',
        professorName: 'Dr. Vinayak Malvade',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
      }
    ];

    await Course.insertMany(courses);
    console.log('Successfully seeded 4 courses with Unsplash images!');
    
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed database:', err);
    process.exit(1);
  }
};

seedCourses();
