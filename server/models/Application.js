const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		company: {
			type: String,
			required: [true, 'Company is required'],
			trim: true,
		},
		position: {
			type: String,
			required: [true, 'Position is required'],
			trim: true,
		},
		status: {
			type: String,
			enum: ['applied', 'interview', 'offer', 'rejected', 'withdrawn'],
			default: 'applied',
		},
		appliedDate: {
			type: Date,
			default: Date.now,
		},
		location: String,
		notes: String,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Application', applicationSchema);
