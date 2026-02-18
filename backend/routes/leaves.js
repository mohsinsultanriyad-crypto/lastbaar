const express = require('express');
const router = express.Router();
// TODO: Implement leaves logic
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});
module.exports = router;
