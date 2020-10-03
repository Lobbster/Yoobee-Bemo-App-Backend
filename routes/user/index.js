const router = require("express").Router();

// Payment -------------------------------------------------
router.use("/", require("./user.js"));
router.use("/upload", require("./profile.js"));

module.exports = router;