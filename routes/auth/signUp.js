const router = require("express").Router();
const User = require("../../models/User.js");
const { registerUser } = require("../../utils/twilio.js");

// No Get Request Allowed
router.get("/", function (req, res) {
  res.status(405);
  res.send("405 Method Not Allowed");
});

// Create New User
router.post("/", (req, res) => {
  // Setup a New User object
  let newUser = req.body;

  // Run the twilio Register User utility then => add the users authy token to thier object
  registerUser(req.body.email, req.body.phone).then((authyRes) => {
    newUser["userToken"] = authyRes.user.id;

    // Save into the database a new user
    const user = new User(newUser);
    user.save().then((result) => {
      // If sucess return the new user object
      return res.status(201).send(result);
    });
  }).catch((error) => {
    // If error return the error object
    return res.status(400).send(error)
  });
});

module.exports = router;
