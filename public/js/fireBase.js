/* #version=0.0.0-0#29 rm 2024-12-06T16:09:38 F659EC91655C190A */
/* #version=0.0.0-0#28 rm 2024-12-05T20:44:19 1E9792983DC3B7DC */
const process = require('process');
const dotenv = require('dotenv');
dotenv.config();
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
var { initializeApp } = require('firebase/app');
var { getDatabase, ref, set, child, get } = require('firebase/database');
// getAnalytics = require('firebase/analytics');

module.exports = class FireBase {

    fireBaseApp = null;
    db = null;

    constructor() {
        debugger;
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional

        const firebaseConfig = {
            apiKey: process.env.firebase_apiKey,
            authDomain: process.env.firebase_authDomain,
            // databaseURL: 'https://console.firebase.google.com/u/2/project/business-app-8ab80/database/business-app-8ab80-default-rtdb/data/~2F',
            databaseURL: process.env.firebase_databaseURL,
            projectId: process.env.firebase_projectId,
            storageBucket: process.env.firebase_storageBucket,
            messagingSenderId: process.env.firebase_messagingSenderId,
            appId: process.env.firebase_appId,
            measurementId: process.env.firebase_measurementId
        };

        // Initialize Firebase
        try {
            var fireBaseApp = initializeApp(firebaseConfig);
            this.fireBaseApp = fireBaseApp;
            // var database = fireBaseApp.database();
            var database = getDatabase(fireBaseApp, firebaseConfig.databaseURL);
            this.db = database;
            // const analytics = getAnalytics(fireBaseApp);
            console.log('FireBase initialized successfully!')
        } catch (error) {
            console.log('FireBase initialization failed.');
            console.log(error);
            return;
        }
    }

    //Post data to Firebase
    async postData(options = {node: null, child: null, key: null, data: null}) {
        debugger;
        var timestamp = Date.now();
        var db = this.db;
        var obj = {
            timestamp: timestamp
        }
        obj[options.key] = options.data;
        try {
            await set(ref(db, `${options.node}/${options.child}`), obj);
        } catch (error) {
            return { ok: false, status: `Unable to write to firebase. ${error}` }
        }
        return { ok: true, status: 'Ok' }
    }

    //Receive data from Firebase
    async getData(options={node: null, child: null}) {
        debugger;
        var result = {ok: true}
        var db = this.db;
        var dbRef = ref(db);
        await get(child(dbRef, `${options.node}/${options.child}`)).then((snapshot) => {
            if (snapshot.exists()) {
                // console.log(snapshot.val());
                result.data = snapshot.val();
                result.status = 'Ok';
            } else {
                // console.log("No data available");
                result.status = 'No data available';
            }
        }).catch((error) => {
            // console.error(error);
            result.ok = false;
            result.status = `Unable to read data from firebase. ${error}`
        });
        return result;
    }

}