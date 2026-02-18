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
