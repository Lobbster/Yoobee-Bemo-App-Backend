const router = require("express").Router();

// Logout User
router.get('/', (req, res) => {
    req.logout();
});

module.exports = router;
