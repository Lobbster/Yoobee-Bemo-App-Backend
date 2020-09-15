const router = require("express").Router();
const User = require("../models/User.js");

router.param("id", (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      } else {
        req.user = user;
        next();
      }
    })
    .catch(next);
});

router.get("/", (req, res, next) => {
  User.find({})
    .sort({ createdAt: "desc" })
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch(next);
});

//Post Request
router.post("/", (req, res) => {
  const user = new User(req.body);
  user.save().then((result) => {
    return res.status(201).send(result);
  });
});

//Get User by Id
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  console.log(`get request for user ${id} recived...`);
  res.status(200).send(req.user);
});

module.exports = router;
