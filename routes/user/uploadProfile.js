const { ensureAuthenticated } = require("../../utils/auth");
const firebase = require("../../utils/firebase");

const router = require("express").Router();

// Block everything except a put request
router.use("/", (req, res, next) => {
    if (req.method != "POST" && req.method != "GET") {
        res.send(`${req.method} METHOD NOT SUPPORTED`).status(405);
    } else {
        next();
    }
});

router.post("/", ensureAuthenticated, (req, res, next) => {
    if (req.files) {
        if (req.files.photo) {
            firebase.upload(req.user, req.files.photo);
            return res.send(req.files.photo);
        }
    }
    res.send("MISSING PROFILE PHOTO").status(400);
});

router.get("/", (req, res, next) => {
    firebase.getPhoto("5f73b5c85af4eb7af4464b9d/PFP-1601607157747.jpg")
        .then((contents) => {
            res.send(contents);
        })
        .catch((err) => {
            res.send(err).status(err.status);
        });
})

module.exports = router;