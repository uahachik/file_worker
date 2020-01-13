const express = require('express');

const Worker = require('../../models/Worker');

const router = express.Router();

// @rout    GET api/users
// @desc    Get all users
router.get('/', async (req, res) => {
  try {
    const users = await Worker.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
