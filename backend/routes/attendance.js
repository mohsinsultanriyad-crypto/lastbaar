const express = require('express');
const router = express.Router();

const { Attendance } = require('../models');

// GET /api/attendance
router.get('/', async (req, res) => {
  const docs = await Attendance.find({});
  res.json(docs);
});

// POST /api/attendance
router.post('/', async (req, res) => {
  const doc = await Attendance.create(req.body);
  res.status(201).json(doc);
});

module.exports = router;
