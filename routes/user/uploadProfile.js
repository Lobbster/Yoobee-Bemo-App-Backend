const router = require("express").Router();

// Block everything except a put request
router.use("/", (req, res, next) => {
  if (req.method != "PUT") {
    res.send(`${req.method} METHOD NOT SUPPORTED`).status(405);
  } else {
      next();
  }
});

router.put("/", (req, res, next) => {

});

module.exports = router;