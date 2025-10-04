// const mongoose = require('mongoose');

// const applicationSchema = new mongoose.Schema(
// 	{
// 		user: {
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: 'User',
// 			required: true,
// 		},
// 		company: {
// 			type: String,
// 			required: [true, 'Company is required'],
// 			trim: true,
// 		},
// 		position: {
// 			type: String,
// 			required: [true, 'Position is required'],
// 			trim: true,
// 		},
// 		status: {
// 			type: String,
// 			enum: ['applied', 'interview', 'offer', 'rejected', 'withdrawn'],
// 			default: 'applied',
// 		},
// 		appliedDate: {
// 			type: Date,
// 			default: Date.now,
// 		},
// 		location: String,
// 		notes: String,
// 	},
// 	{
// 		timestamps: true,
// 	}
// );

// module.exports = mongoose.model('Application', applicationSchema);
import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide the company name'],
    trim: true,
  },
  jobTitle: {
    type: String,
    required: [true, 'Please provide the job title'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Interviewing', 'Offer', 'Rejected'],
    default: 'Applied',
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  jobUrl: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
  },
  salary: {
    type: String,
    trim: true,
  },
  skills: {
    type: [String], // An array of strings
  },
  followUpDate: {
    type: Date,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Creates the reference to the User model
    required: true,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

export default mongoose.model('Application', ApplicationSchema);