const router = require("express").Router();

// Payment -------------------------------------------------
router.use("/", require("./user.js"));
router.use("/profile", require("./profile.js"));

module.exports = router;