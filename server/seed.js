const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Tutor = require('./models/Tutor');
const User = require('./models/User');
const Session = require('./models/Session');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/educonnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Dummy Data for Tutors
const addDummyTutors = async () => {
  const tutors = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      qualifications: 'M.Sc. in Computer Science',
      subjects: ['Math', 'Physics'],
      hourlyRate: 20,
      availability: [{ day: 'Monday', timeSlots: ['9:00 AM - 11:00 AM'] }],
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      qualifications: 'B.Sc. in English Literature',
      subjects: ['English'],
      hourlyRate: 18,
      availability: [{ day: 'Tuesday', timeSlots: ['1:00 PM - 3:00 PM'] }],
    },
  ];

  try {
    const insertedTutors = await Tutor.insertMany(tutors);
    console.log('Dummy tutors added!');
    return insertedTutors; // Return inserted tutors to use their _id later
  } catch (error) {
    console.error('Error adding tutors:', error);
    return [];
  }
};

// Dummy Data for Users
const addDummyUsers = async () => {
  const users = [
    {
      name: 'Student A',
      email: 'studentA@example.com',
      password: 'password123', // This will be hashed
      role: 'student',
      wishlist: [],
    },
    {
      name: 'Student B',
      email: 'studentB@example.com',
      password: 'password123', // This will be hashed
      role: 'student',
      wishlist: [],
    },
  ];

  // Hash passwords before saving
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  try {
    const insertedUsers = await User.insertMany(users);
    console.log('Dummy users added!');
    return insertedUsers; // Return inserted users to use their _id later
  } catch (error) {
    console.error('Error adding users:', error);
    return [];
  }
};

// Dummy Data for Sessions
const addDummySessions = async (tutors, users) => {
  const sessions = [
    {
      tutor: tutors[0]._id, // Use the tutor's actual _id here
      student: users[0]._id, // Use the student's actual _id here
      subject: 'Math',
      scheduledTime: new Date(),
      status: 'completed',
    },
    {
      tutor: tutors[1]._id, // Use the tutor's actual _id here
      student: users[1]._id, // Use the student's actual _id here
      subject: 'English',
      scheduledTime: new Date(),
      status: 'pending',
    },
  ];

  try {
    await Session.insertMany(sessions);
    console.log('Dummy sessions added!');
  } catch (error) {
    console.error('Error adding sessions:', error);
  }
};

// Run the functions to add dummy data
const seedDatabase = async () => {
  const tutors = await addDummyTutors();
  const users = await addDummyUsers();
  await addDummySessions(tutors, users); // Pass the inserted tutors and users
  console.log('Database seeding complete!');
  mongoose.disconnect(); // Close the database connection after seeding
};

seedDatabase();
