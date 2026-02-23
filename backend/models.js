
const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({}, { strict: false });
const attendanceSchema = new mongoose.Schema({}, { strict: false });
const leaveSchema = new mongoose.Schema({
	deleted: { type: Boolean, default: false },
	deletedAt: Date,
	deletedBy: String, // "worker" or "admin"
	deduction: { type: Number, default: 0 }, // legacy, if used
	effectiveDeduction: { type: Number, default: 0 }, // used for payroll, set to 0 if deleted
}, { strict: false });

const advanceSchema = new mongoose.Schema({
	deleted: { type: Boolean, default: false },
	deletedAt: Date,
	deletedBy: String, // "worker" or "admin"
	amount: Number, // already present
	effectiveAmount: { type: Number, default: 0 }, // used for payroll, set to 0 if deleted
}, { strict: false });
const postSchema = new mongoose.Schema({}, { strict: false });
const announcementSchema = new mongoose.Schema({}, { strict: false });

const Worker = mongoose.model('Worker', workerSchema, 'workers');
const Attendance = mongoose.model('Attendance', attendanceSchema, 'attendance');
const Leave = mongoose.model('Leave', leaveSchema, 'leaves');
const Advance = mongoose.model('Advance', advanceSchema, 'advances');
const Post = mongoose.model('Post', postSchema, 'posts');
const Announcement = mongoose.model('Announcement', announcementSchema, 'announcements');

module.exports = {
	Worker,
	Attendance,
	Leave,
	Advance,
	Post,
	Announcement
};
