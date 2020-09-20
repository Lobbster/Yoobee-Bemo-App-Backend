const passport = require("passport");
const router = require("express").Router();
const { sendUserVerify } = require("../../utils/twilio.js");

// If not trying to post then tell the user this method is not allowed.
router.use("/", function (req, res, next) {
  if (req.method != "POST" && req.method != "PUT") {
    return res.send("Method not allowed").status(405);
  }
  next();
});

// Start Login Process
router.post("/", function (req, res) {
  sendUserVerify(req.body.phone).then((data) => {
    res.send(data);
  });
});

// Verify Login Attempt
router.post("/verify", (req, res, next) => {
  console.log(req.body);
  passport.authenticate("passworless", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next({ message: "Missing User", error: 400 });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send({success: true});
    });
  })(req, res, next);
});

module.exports = router;
