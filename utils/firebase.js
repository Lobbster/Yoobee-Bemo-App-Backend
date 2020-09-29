const admin = require("firebase-admin");

const init = () => {
    const serviceAccount = require("../serviceAccountKey.json");
    const firebaseConfig = {
        credential: admin.credential.cert(serviceAccount),
        apiKey: process.env.FIREBASE_API_KEY,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        appId: process.env.FIREBASE_APP_ID
    };
    admin.initializeApp(firebaseConfig);
    
    const bucket = admin.storage().bucket();
    
    console.log(bucket);    
}

module.exports = {
    init
};