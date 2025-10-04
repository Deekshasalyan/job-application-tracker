import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/job-tracker';

const emailToFix = 'test1@example.com';
const newPassword = 'Password123';

const run = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to DB for password fix');

    const user = await User.findOne({ email: emailToFix });
    if (!user) {
      console.log('User not found:', emailToFix);
      process.exit(0);
    }

    // Hash new password and save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    console.log('Password updated for', emailToFix);
    process.exit(0);
  } catch (err) {
    console.error('Error updating password:', err);
    process.exit(1);
  }
};

run();
