const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

const imagemin = require('imagemin');

const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const sharp = require('sharp');


let bucket;

/**
 * Initalise firebase, setting variables based off env,
 * Get the bucket for storing images
 * 
 */
const init = () => {
    const firebaseConfig = {
        credential: admin.credential.cert(serviceAccount),
        apiKey: process.env.FIREBASE_API_KEY,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        appId: process.env.FIREBASE_APP_ID
    };
    admin.initializeApp(firebaseConfig);

    bucket = admin.storage().bucket();
}

/**
 * Get the current bucket
 * 
 * @returns {Object} - The Google Storage Bucket associated with Firebase
 */
const getBucket = () => {
    return bucket;
}

/**
 * Upload a file based off a user and a provided file
 * 
 * @param {Object} user - A Bemo app user object 
 * @param {Object} file - A Google Cloud Storage file object
 */
const upload2 = (user, file) => {

    // Convert mimetype to extension
    // List also acts as a valid file extension filter
    const mimetypeExtensions = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
    }

    return new Promise((resolve, reject) => {

        if (mimetypeExtensions[file.mimetype]) {
            const fileName = `${user._id}/PFP-${new Date().getTime()}.${mimetypeExtensions[file.mimetype]}`;
            imagemin.buffer(file.data, {
                plugins: [
                    imageminJpegtran(),
                    imageminPngquant(),
                ]
            }).then(compressedFile => {
                // File successfully compressed
                console.log(file.data);
                sharp(file.data)
                    .rotate()
                    .resize(500, 500)
                    .toBuffer()
                    .then((data) => {
                        const cloudFile = getBucket().file(fileName); // NAME THE FILE
                        const stream = cloudFile.createWriteStream();
                        stream.write(data);
                        stream.end();
                        resolve(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        err.message = err;
                        err.status = 500;
                        reject(err);
                    })



            }).catch((err) => {
                // Compressional failed
                console.log(err);
                const error = {
                    msg: "Invalid file type",
                    status: 400
                }
                reject(error);
            });
        } else {
            const error = {
                msg: "Invalid file type",
                status: 400
            }
            reject(error)
        }
    });




}


const upload = (user, file) => {

    // Convert mimetype to extension
    // List also acts as a valid file extension filter
    const mimetypeExtensions = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
    }

    return new Promise((resolve, reject) => {

        if (mimetypeExtensions[file.mimetype]) {
            const fileName = `${user._id}/PFP-${new Date().getTime()}.${mimetypeExtensions[file.mimetype]}`;
            // console.log(file.data);
            sharp(file.data)
                .rotate()
                .resize(500, 500) // Resize
                .toBuffer()
                .then((data) => {

                    imagemin.buffer(data, {
                        plugins: [
                            imageminJpegtran(),
                            imageminPngquant(),
                        ]
                    }).then((compressedFile) => {
                        const cloudFile = getBucket().file(fileName); // NAME THE FILE
                        const stream = cloudFile.createWriteStream();
                        stream.write(compressedFile);
                        stream.end();
                        resolve(compressedFile);
                    }).catch((err) => {
                        console.log(err);
                        err.message = err;
                        err.status = 500;
                        reject(err);
                    });

                    
                })
                .catch((err) => {
                    console.log(err);
                    err.message = err;
                    err.status = 500;
                    reject(err);
                })
        }
    });



}



/**
 * Get a user's profile photo
 * 
 * @param {String} fileName - A string containing a Google Storage url
 * @returns {Promise} - A promise that resolves if file is found, rejects if not found 
 */
const getPhoto = async (fileName) => {

    const file = await bucket.file(fileName);

    return new Promise((resolve, reject) => {
        if (file.exists()) {
            // FILE EXISTS
            file.download({})
                .then((data) => {
                    const contents = data[0];  // contents is the file as Buffer
                    console.log(contents);

                    let buff = Buffer.from(contents, 'base64');
                    let base64data = buff.toString('base64');

                    resolve(`data:image/png;base64,${base64data}`); // Base64 data image
                })
                .catch((err) => {
                    let error;
                    if (err.response) {
                        error = {
                            status: err.response.statusCode,
                            msg: err.response.statusMessage
                        };
                    } else {
                        error = {
                            status: 500,
                            msg: "Error getting photo"
                        };
                    }
                    reject(error);
                });
        } else {
            // FILE DOES NOT EXIST
            const err = {
                msg: "Not Found",
                status: 404
            }
            reject(err);
        }
    });


}


module.exports = {
    getBucket,
    init,
    upload,
    getPhoto
};