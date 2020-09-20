const router = require("express").Router();

//Get User by Id
router.get("/", (req, res, next) => {
  if (req.user){
    res.status(201).send(req.user);
  } else {
      next("Loggin required")
  }
});

module.exports = router;