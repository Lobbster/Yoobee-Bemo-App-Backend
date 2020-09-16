const router = require("express").Router();

// Logout User
router.get('/', (req, res) => {
    req.logout();
    // Redirect Home
    res.redirect('/')
})

module.exports = router;
