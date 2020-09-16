const express = require('express');
const router = express.Router();

// Home
router.get('/', (req, res) => res.send('Welcome To The Bemo API'));
 
module.exports = router;