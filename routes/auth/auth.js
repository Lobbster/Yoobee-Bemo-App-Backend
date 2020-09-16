const router = require("express").Router();

// Login -----------------------------------------------------
const loginRoute = require("./login.js")
router.use("/login", loginRoute);

// Signup ----------------------------------------------------
const signupRoute = require("./signup.js")
router.use("/signup", signupRoute);

// Logout ----------------------------------------------------
const logoutRoute = require("./logout.js")
router.use("/logout", logoutRoute);

module.exports = router;