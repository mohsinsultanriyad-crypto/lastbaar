
const express = require('express');
const router = express.Router();
const { Worker } = require('../models');

// GET /api/workers
router.get('/', async (req, res) => {
  const docs = await Worker.find({});
  res.json(docs);
});

// POST /api/workers
router.post('/', async (req, res) => {
  const doc = await Worker.create(req.body);
  res.status(201).json(doc);
});

// PUT /api/workers/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body, id };
    const doc = await Worker.findOneAndUpdate(
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
