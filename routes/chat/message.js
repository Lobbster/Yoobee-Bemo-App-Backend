const router = require("express").Router();


router.use("/", (req, res, next) => {  
    console.log(req.method)  
    let io = req.app.io;

    io.emit("msg", req.body)

    res.send("Hello").status(200);
})


module.exports = router;
