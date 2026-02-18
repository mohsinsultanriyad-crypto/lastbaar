
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

// PUT /api/attendance/:id/status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body, id };
    const doc = await Attendance.findOneAndUpdate(
      { id },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
