const express = require('express');
const router = express.Router();
const { Post } = require('../models');

// GET /api/posts
router.get('/', async (req, res) => {
  const docs = await Post.find({});
  res.json(docs);
});

// POST /api/posts
router.post('/', async (req, res) => {
  const doc = await Post.create(req.body);
  res.status(201).json(doc);
});


// PUT /api/posts/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body, id };
    const doc = await Post.findOneAndUpdate(
      { id },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


// DELETE /api/posts/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  let result;
  if (/^[a-fA-F0-9]{24}$/.test(id)) {
    // Try Mongo ObjectId
    result = await Post.deleteOne({ _id: id });
    if (result.deletedCount > 0) {
      return res.json({ ok: true });
    }
  }
  // Try custom id field
  result = await Post.deleteOne({ id });
  if (result.deletedCount > 0) {
    return res.json({ ok: true });
  }
  return res.status(404).json({ ok: false, error: 'Not found' });
});

module.exports = router;
