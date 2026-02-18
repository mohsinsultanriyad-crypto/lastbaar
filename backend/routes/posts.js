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

module.exports = router;
