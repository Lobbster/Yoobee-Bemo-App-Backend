const router = require("express").Router();

// Room -----------------------------------------------------
router.use("/", require("./room.js"));

// Messages -----------------------------------------------------
router.use("/message", require("./message.js"));


module.exports = router;