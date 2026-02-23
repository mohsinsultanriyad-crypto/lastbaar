
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const { Leave } = require('../models');

// SOFT DELETE /api/leaves/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const actorId = req.header('X-Actor-Id');
    const actorRole = req.header('X-Actor-Role');
    let doc = null;
    // Only call findById if id is valid ObjectId and 24 hex chars
    if (typeof id === 'string' && id.length === 24 && mongoose.Types.ObjectId.isValid(id)) {
      doc = await Leave.findById(id);
    }
    if (!doc) {
      doc = await Leave.findOne({ id });
    }
    if (!doc) return res.status(404).json({ error: 'Not found' });
    if (actorRole === 'worker' && doc.workerId !== actorId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // Soft delete
    doc.deleted = true;
    doc.deletedAt = new Date();
    doc.deletedBy = actorRole;
    // Salary logic: set deduction fields to 0
    if ('deduction' in doc) doc.deduction = 0;
    if ('finalDeductionAmount' in doc) doc.finalDeductionAmount = 0;
    doc.effectiveDeduction = 0;
    await doc.save();
    return res.json({ ok: true, id: doc.id, _id: doc._id });
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
