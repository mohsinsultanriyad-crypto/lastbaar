
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const { Advance } = require('../models');

// SOFT DELETE /api/advances/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Advance.findOneAndUpdate(
      { id },
      { $set: { deleted: true, deletedAt: new Date(), amount: 0, effectiveAmount: 0 } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Not found' });

    return res.json({ ok: true, id: updated.id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET /api/advances
router.get('/', async (req, res) => {
  const docs = await Advance.find({ deleted: { $ne: true } });
  res.json(docs);
});

// POST /api/advances
router.post('/', async (req, res) => {
  const doc = await Advance.create(req.body);
  res.status(201).json(doc);
});

// PUT /api/advances/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body, id };
    const doc = await Advance.findOneAndUpdate(
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
