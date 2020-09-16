const router = require("express").Router();

// Login
const loginRoute = require("./login.js")
router.use("/login", loginRoute);

const signupRoute = require("./signup.js")
router.use("/signup", signupRoute);

module.exports = router;