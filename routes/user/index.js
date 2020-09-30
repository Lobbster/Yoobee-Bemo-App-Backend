const router = require("express").Router();

// Payment -------------------------------------------------
router.use("/", require("./user.js"));
router.use("/upload", require("./uploadProfile.js"));

module.exports = router;