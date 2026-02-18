// PUT /api/workers/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let doc = null;
    if (/^[a-fA-F0-9]{24}$/.test(id)) {
      doc = await Worker.findByIdAndUpdate(id, req.body, { new: true });
    }
    if (!doc) {
      doc = await Worker.findOneAndUpdate({ id }, req.body, { new: true });
    }
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
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

module.exports = router;
