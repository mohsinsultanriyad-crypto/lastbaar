const express = require('express');
const router = express.Router();
// TODO: Implement advances logic
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});
module.exports = router;
