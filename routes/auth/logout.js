const router = require("express").Router();

// Logout User
router.get('/', (req, res) => {
    console.log("logout")
    req.logout();
});

module.exports = router;
