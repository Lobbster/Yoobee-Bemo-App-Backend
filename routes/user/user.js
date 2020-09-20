const router = require("express").Router();

//Get User by Id
router.get("/", (req, res, next) => {
  res.send(req.user)
});

module.exports = router;