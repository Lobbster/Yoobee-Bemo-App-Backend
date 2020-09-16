const router = require("express").Router();
const User = require("../models/User.js");
const { ensureAuthenticated } = require('../utils/auth');

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

// ----------------------------------------------------------------
// DEACTIVATED AS WE CURRENTLY HAVE NO NEED TO LIST USERS

// router.get("/", ensureAuthenticated, (req, res, next) => {
//   console.log(req.user)
//   User.find({})
//     .sort({ createdAt: "desc" })
//     .then((users) => {
//       return res.status(200).send(users);
//     })
//     .catch(next);
// });

// ----------------------------------------------------------------
// MOVED TO AUTH / SIGNUP

//Post Request
// router.post("/", (req, res) => {
//   const user = new User(req.body);
//   user.save().then((result) => {
//     return res.status(201).send(result);
//   });
// });

// ----------------------------------------------------------------

//Get User by Id
router.get("/", ensureAuthenticated, (req, res, next) => {
  // User.findById(req.user._id).then((user) => {
  //   res.status(200).send(user);
  // })
  res.send(req.user);
});

module.exports = router;
