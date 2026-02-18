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
    let doc = null;
    if (/^[a-fA-F0-9]{24}$/.test(id)) {
      doc = await Post.findByIdAndUpdate(id, req.body, { new: true });
    }
    if (!doc) {
      doc = await Post.findOneAndUpdate({ id }, req.body, { new: true });
    }
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
