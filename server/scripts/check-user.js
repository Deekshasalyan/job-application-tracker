import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/job-tracker';

const email = process.argv[2] || 'test1@example.com';
const candidate = process.argv[3] || 'Password123';

const run = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to DB for check-user');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      process.exit(0);
    }
    console.log('User _id:', user._id.toString());
    console.log('Stored password hash (first 60 chars):', String(user.password).substring(0, 60));
    const isMatch = await bcrypt.compare(candidate, user.password);
    console.log('bcrypt.compare result for candidate:', isMatch);
    process.exit(0);
  } catch (err) {
    console.error('Error in check-user:', err);
    process.exit(1);
  }
};

run();
