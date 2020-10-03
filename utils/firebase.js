const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");


let bucket;

/**
 * Initalise firebase, setting variables based off env,
 * Get the bucket for storing images
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
 * Upload a file to Google Cloud Storage
 * 
 * @param {Object} path - Where should the file be stored and what with what file extension
 * @example "photos/myPhoto.jpg"
 * @param {Object} buffer - A file buffer
 */
const upload = (path, buffer) => {
    const cloudFile = getBucket().file(path);
    const stream = cloudFile.createWriteStream();
    stream.write(buffer);
    stream.end();
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
    upload,
    getBucket,
    init,
    getPhoto
};