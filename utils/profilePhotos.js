const { getBucket, upload } = require("./firebase");
const { resize, compress } = require("./photos");

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
                            const fileName = `${user._id}/PFP-${new Date().getTime()}.${mimetypeExtensions[file.mimetype]}`;
                            upload(fileName, compressedFile);
                            resolve(compressedFile);
                        }).catch((err) => {
                            console.log(err);
                            err.msg = err;
                            err.status = 500;
                            reject(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                    err.msg = err;
                    err.status = 500;
                    reject(err);
                })
        }
    });
}


module.exports = {
    uploadProfilePic
}