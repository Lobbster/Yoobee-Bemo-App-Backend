const router = require("express").Router();
const { ensureAuthenticated } = require("../../utils/auth.js");
const Channel = require("../../models/Channel.js");
const User = require("../../models/User.js");

// If not trying to post then tell the user this method is not allowed.
router.use("/", function (req, res, next) {
  if (req.method != "POST" && req.method != "GET") {
    return res.send("Method not allowed").status(405);
  }
  next();
});


// List all rooms the user is privy to
router.get("/", ensureAuthenticated, (req, res, next) => {
  let user = req.user;
  if (req.user.channels) {
    return res.send(user.channels).status(200);
  } else {
    return res.send([]).status(200);
  }
});

// router.post("/", ensureAuthenticated, (req, res, next) => {
router.post("/", (req, res, next) => {
  let userId = "5f62876441576b09957f511b"; // TODO: Get the user from the request
  let users = [userId];

  if (req.body.recipient) {
    users.push(req.body.recipient);
    const channel = new Channel({ users: users });
    console.log(users);

    channel
      .save()
      .then((result) => {
        // If success return the new room
        return res.status(201).send(result);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next({
      response: null,
      status: 400,
      error: "Bad Request",
    });
  }
});

module.exports = router;
