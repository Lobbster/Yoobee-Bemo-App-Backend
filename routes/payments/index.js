const router = require("express").Router();

// Payment -------------------------------------------------
router.use("/", require("./payment.js"));

// Transaction ---------------------------------------------
// router.use("/transaction", require("./transaction.js"));

module.exports = router;