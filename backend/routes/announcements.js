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
    let doc = null;
    if (/^[a-fA-F0-9]{24}$/.test(id)) {
      doc = await Announcement.findByIdAndUpdate(id, req.body, { new: true });
    }
    if (!doc) {
      doc = await Announcement.findOneAndUpdate({ id }, req.body, { new: true });
    }
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
