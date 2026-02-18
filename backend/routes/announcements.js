const express = require('express');
const router = express.Router();
const { Announcement } = require('../models');

// GET /api/announcements
router.get('/', async (req, res) => {
  const docs = await Announcement.find({});
  res.json(docs);
});

// POST /api/announcements
router.post('/', async (req, res) => {
  const doc = await Announcement.create(req.body);
  res.status(201).json(doc);
});


// PUT /api/announcements/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body, id };
    const doc = await Announcement.findOneAndUpdate(
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
