// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema(
// 	{
// 		name: {
// 			type: String,
// 			required: true,
// 			trim: true,
// 		},
// 		email: {
// 			type: String,
// 			required: true,
// 			unique: true,
// 			lowercase: true,
// 			trim: true,
// 		},
// 		password: {
// 			type: String,
// 			required: true,
// 		},
// 	},
// 	{ timestamps: true }
// );

// userSchema.pre('save', async function (next) {
// 	if (!this.isModified('password')) return next();
// 	const salt = await bcrypt.genSalt(10);
// 	this.password = await bcrypt.hash(this.password, salt);
// 	next();
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
// 	return bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
//   password: {
//     type: String,
//     required: [true, 'Please provide a password'],
//   },
    password: {
        type: String,
        required: true,
        select: false, // This is the likely culprit!
    },

}, { timestamps: true }); // Adds createdAt and updatedAt automatically

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);