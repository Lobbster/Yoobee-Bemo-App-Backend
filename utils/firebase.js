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

module.exports = {
    getBucket,
    init
};