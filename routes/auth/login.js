const passport = require("passport");
const customStrategy = require("passport-custom");
const router = require("express").Router();
const { registerUser } = require("../../utils/twilio.js");

// Auth Tests
passport.use(
  "passworless",
  new customStrategy(function (req, done) {
    // Find user by phone
    // Authy id = user.authId
    done(false);
  })
);

router.get("/", function (req, res) {
//   registerUser();
  res.status(405);
  res.send("405 Method Not Allowed");
});

// Login
router.post(
  "/",
  passport.authenticate("passworless", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

module.exports = router;
