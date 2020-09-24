const router = require("express").Router();

// Logout User
router.get('/', (req, res) => {
    req.session.destroy((err) => {
        if(!err){
            req.logout();
            res.send({ status: "success", message: "Logged Out" })
        } else {
            console.log(err);
            res.send({ status: "fail", message: "Failed to logout"})
        }
    })
});

module.exports = router;
