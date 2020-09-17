const router = require("express").Router();
const { ensureAuthenticated } = require("../../utils/auth.js");
const Room = require("../../models/Room.js");

// If not trying to post then tell the user this method is not allowed.
router.use("/", function (req, res, next) {
  if (req.method != "POST" && req.method != "GET") {
    return res.send("Method not allowed").status(405);
  }
  next();
});


// List all rooms / FOR DEVELOPMENT
router.get("/", (req, res, next) => {
    Room.find({}, (err, data) => {
        if (!err) {
            return res.send(data).status(200);
        } else {
            return next(err);
        }
    })
});

// router.post("/", ensureAuthenticated, (req, res, next) => {
router.post("/", (req, res, next) => {
  let userId = "5f62876441576b09957f511b"; // TODO: Get the user from the request
  let users = [userId];

  if (req.body.recipient) {
    users.push(req.body.recipient);
    const room = new Room({ users: users });
    console.log(users);

    room
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
