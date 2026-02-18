
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
    let doc = null;
    if (/^[a-fA-F0-9]{24}$/.test(id)) {
      doc = await Attendance.findByIdAndUpdate(id, req.body, { new: true });
    }
    if (!doc) {
      doc = await Attendance.findOneAndUpdate({ id }, req.body, { new: true });
    }
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
