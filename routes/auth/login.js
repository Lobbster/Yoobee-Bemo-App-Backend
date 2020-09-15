const passport = require("passport");
const customStrategy = require("passport-custom");
const router = require("express").Router();
const { sendUserVerify, checkUserVerify } = require("../../utils/twilio.js");

router.get("/", function (req, res) {
  //   registerUser();
  res.status(405);
  res.send("405 Method Not Allowed");
});

passport.use(
  "passworless",
  new customStrategy((req, done) => {
    checkUserVerify(data.user.userToken, "Code").then((res) => {
        // If no errors =>
        if (!res.error) {
            // Confirm Auth =>
            done(null, data.user);
        }
    });
  })
);

router.post("/", function (req, res) {
  console.log(req.body)
  sendUserVerify(req.body.phone).then((data) => {
    res.send(data);
  })
});

router.post(
  "/verify",
  passport.authenticate("passworless", function (req, res) {
    console.log("Failed Login attempt");
  }),
  function (req, res) {
    console.log("Successful Login Attempt");
  }
);

module.exports = router;
