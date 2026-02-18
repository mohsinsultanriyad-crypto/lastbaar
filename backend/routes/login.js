const express = require('express');
const router = express.Router();
// TODO: Implement login logic
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});
module.exports = router;
