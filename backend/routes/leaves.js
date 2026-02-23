
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const { Leave } = require('../models');

// SOFT DELETE /api/leaves/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Only match by custom string field "id"
    const updated = await Leave.findOneAndUpdate(
      { id },
      { $set: { deleted: true, deletedAt: new Date(), deduction: 0, effectiveDeduction: 0 } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Not found' });

    return res.json({ ok: true, id: updated.id });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

// GET /api/leaves
router.get('/', async (req, res) => {
  const docs = await Leave.find({ deleted: { $ne: true } });
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
