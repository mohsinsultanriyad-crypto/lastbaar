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

module.exports = router;
