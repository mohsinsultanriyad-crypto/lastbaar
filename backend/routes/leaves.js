
const express = require('express');
const router = express.Router();
const { Leave } = require('../models');

// GET /api/leaves
router.get('/', async (req, res) => {
  const docs = await Leave.find({});
  res.json(docs);
});

// POST /api/leaves
router.post('/', async (req, res) => {
  const doc = await Leave.create(req.body);
  res.status(201).json(doc);
});

// PUT /api/leaves/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body, id };
    const doc = await Leave.findOneAndUpdate(
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
