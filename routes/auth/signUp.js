const passport = require("passport");
const customStrategy = require("passport-custom");
const router = require("express").Router();
const { registerUser } = require("../../utils/twilio.js");

router.get("/", function (req, res) {
  res.status(405);
  res.send("405 Method Not Allowed");
});

router.post("/", function (req, res) {
  console.log(req.body)
  registerUser(req.body.email, req.body.phone).then((result) => {
      res.send(result)
  });
});

module.exports = router;
