const { getBucket, upload, getPhoto } = require("./firebase");
const { resize, compress } = require("./photos");
const User = require("../models/User.js");

/**
 * Upload a file based off a user and a provided file
 * 
 * @param {Object} user - A Bemo app user object 
 * @param {Object} file - A Google Cloud Storage file object
 * 
 * @returns {Promise} - Promise that resolves with the uploaded file buffer and rejects if something goes wrong during compression, resize or upload
 */
const uploadProfilePic = (user, file) => {

    // Convert mimetype to extension
    // List also acts as a valid file extension filter
    const mimetypeExtensions = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
    }

    return new Promise((resolve, reject) => {

        if (mimetypeExtensions[file.mimetype]) {
            resize(file.data, 250, 250)
                .then((data) => {
                    compress(data)
                        .then((compressedFile) => {
                            const fileName = `PFP-${new Date().getTime()}.${mimetypeExtensions[file.mimetype]}`;
                            const filePath = `${user._id}/${fileName}`;
                            upload(filePath, compressedFile);
                            updateUserDatabaseWithProfilePic(user._id, fileName)
                                .then((data) => { resolve(compressedFile) })
                                .catch((err) => { reject(err) });
                        }).catch((err) => {
                            err.msg = err;
                            err.status = 500;
                            reject(err);
                        });
                })
                .catch((err) => {
                    err.msg = err;
                    err.status = 500;
                    reject(err);
                })
        } else {
            reject({
                msg: "Invalid file type",
                status: 422
            });
        }
    });
}



/**
 * Update the user's profile picture in the MongoDB
 * 
 * @param {String} userId - MongoDB ID of user
 * @param {String} photoName - Name of profile photo in database
 * 
 * @returns {Promise} - Promise that resolves with the new user data and rejects if user can't be updated
 */
function updateUserDatabaseWithProfilePic(userId, photoName) {
    return new Promise((resolve, reject) => {
        User.updateOne(
            { _id: userId },
            { picture: photoName },
            (err, data) => {
                if (!err) {
                    resolve(data);
                }
                reject(err);
            }
        );
    })

}




/**
 * Get a user's profile photo
 * 
 * @param {String} userId - MongoDB ID of user
 * 
 * @returns {Promise} - Resolves if user is found (regardless of if they have a profile pic or not), rejects if something goes wrong while getting user. 
 */
const getProfilePic = (userId) => {
    return new Promise((resolve, reject) => {
        User.findOne(
            { _id: userId },
            (err, data) => {
                if (!err) {
                    if (data) {
                        if (data.picture) {
                            getPhoto(`${userId}/${data.picture}`)
                                .then((img) => {resolve(img)})
                                .catch(() => reject({ status: 500, msg: "Internal server error while getting photo" }))
                        } else {
                            resolve({ status: 204, msg: "No profile photo" });
                        }
                    } else {
                        resolve({ status: 404, msg: "User not found" });
                    }
                } else {
                    reject(err);
                }
            }
        ).catch((err) => {
            reject(err);
        })
    })

}


module.exports = {
    uploadProfilePic,
    getProfilePic
}