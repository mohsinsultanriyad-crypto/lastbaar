const express = require('express');
const router = express.Router();

const { Advance } = require('../models');

// GET /api/advances
router.get('/', async (req, res) => {
  const docs = await Advance.find({});
  res.json(docs);
});

// POST /api/advances
router.post('/', async (req, res) => {
  const doc = await Advance.create(req.body);
  res.status(201).json(doc);
});

module.exports = router;
