/* #version=0.0.0-0#26 rm 2024-12-05T20:06:46 F3EB631AD936D9B8 */
/* #version=0.0.0-0#25 rm 2024-12-05T19:51:56 63D3BDAD6C52698E */
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
            apiKey: "AIzaSyBeqPz-MwWlAE1YGB8IcoURfpdL5OHHwx8",
            authDomain: "business-app-8ab80.firebaseapp.com",
            // databaseURL: 'https://console.firebase.google.com/u/2/project/business-app-8ab80/database/business-app-8ab80-default-rtdb/data/~2F',
            databaseURL: 'https://business-app-8ab80-default-rtdb.firebaseio.com/',
            projectId: "business-app-8ab80",
            storageBucket: "business-app-8ab80.firebasestorage.app",
            messagingSenderId: "553611640274",
            appId: "1:553611640274:web:15accde607b2711136dc0b",
            measurementId: "G-QX74ZLG6RR"
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
    async postData(options = {node: null, child: null, data: null}) {
        debugger;
        var timestamp = Date.now();
        var db = this.db;
        try {
            await set(ref(db, `${options.node}/${options.child}`), {
                data: options.data,
                timestamp: timestamp
            });
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