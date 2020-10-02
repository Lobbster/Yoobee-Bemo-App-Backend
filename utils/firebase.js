const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");


let bucket;

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

const getBucket = () => {
    return bucket;
}

const upload = (user, file) => {
    const bucket2 = getBucket();

    const fileName = `${user._id}/PFP-${new Date().getTime()}.jpg`;

    const file2 = bucket2.file(fileName); // NAME THE FILE
    const stream = file2.createWriteStream();
    stream.write(file.data);
    stream.end();
}

const getPhoto = async (fileName) => {

    const file = await bucket.file(fileName);

    return new Promise((resolve, reject) => {
        if (file.exists()) {
            // FILE EXISTS!
            file.download({}).then((data) => {
                const contents = data[0];  // contents is the file as Buffer
                console.log(contents);
                resolve(JSON.stringify(contents))
                // resolve("SUCCESS")
            })
            .catch((err) => {
                let error = {
                    status: err.response.statusCode,
                    msg: err.response.statusMessage
                };
                reject(error);
            });
        } else {
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