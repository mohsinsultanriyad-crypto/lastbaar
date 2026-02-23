
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const { Advance } = require('../models');

// SOFT DELETE /api/advances/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const actorId = req.header('X-Actor-Id');
    const actorRole = req.header('X-Actor-Role');
    let doc = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      doc = await Advance.findById(id);
    }
    if (!doc) {
      doc = await Advance.findOne({ id });
    }
    if (!doc) return res.status(404).json({ error: 'Not found' });
    if (actorRole === 'worker' && doc.workerId !== actorId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // Soft delete
    doc.deleted = true;
    doc.deletedAt = new Date();
    doc.deletedBy = actorRole;
    // Salary logic: set effectiveAmount to 0
    doc.effectiveAmount = 0;
    await doc.save();
    return res.json({ ok: true, id: doc.id, _id: doc._id });
  } catch (e) {
    return res.status(400).json({ error: e.message });
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
