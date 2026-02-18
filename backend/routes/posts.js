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

module.exports = router;
