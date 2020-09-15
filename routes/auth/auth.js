const router = require("express").Router();

// Login
const loginRoute = require("./login.js")
router.use("/login", loginRoute);

module.exports = router;