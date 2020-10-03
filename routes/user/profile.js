const { ensureAuthenticated } = require("../../utils/auth");
const firebase = require("../../utils/firebase");
const { uploadProfilePic } = require("../../utils/profilePhotos");

const router = require("express").Router();

// Block everything except a POST & GET request
router.use("/", (req, res, next) => {
    if (req.method != "POST" && req.method != "GET") {
        res.send(`${req.method} METHOD NOT SUPPORTED`).status(405);
    } else {
        next();
    }
});

// Upload image to user
router.post("/", ensureAuthenticated, (req, res, next) => {
    if (req.files) {
        if (req.files.photo) {
            uploadProfilePic(req.user, req.files.photo)
                .then((file) => {
                    return res.json(file).status(201);
                })
                .catch((err) => {
                    return res.send(err.msg).status(err.status);
                });
        } else {
            return res.send("Missing file").status(400);
        }
    } else {
        return res.send("Missing file").status(400);
    }
});

// Get profile photo
router.get("/:profilePhoto", (req, res, next) => {
    firebase.getPhoto("5f73b5c85af4eb7af4464b9d/" + req.params.profilePhoto)
        .then((contents) => {
            const img = Buffer.from(contents.split(",")[1], 'base64');
            
            res.writeHead(200, {
               'Content-Type': 'image/jpg',
               'Content-Length': img.length
            });
            
            res.end(img); 
        })
        .catch((err) => {
            return res.send(err.msg).status(err.status);
        });
})

module.exports = router;