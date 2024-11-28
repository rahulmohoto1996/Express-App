/* #version=0.0.0-0#70 rm 2024-11-28T19:18:37 D2345D4F47F7F180 */
/* #version=0.0.0-0#69 rm 2024-11-28T19:13:53 F8157FD306D2DA0B */
const googleAuth = require("./public/js/googleDriveAuthentication.js");
const googleUtility = require("./public/js/googleDriveUtilityFunctions.js");
const xhrCore = require("./public/js/xhrCore.js"); // import xhrCore from "./public/js/xhrCore.js";

const process = require('process');
const dotenv = require('dotenv');
dotenv.config();

var express = require('express')
var session = require('express-session');
var cors = require('cors')
var app = express()

var oauth2Client = null;
 
app.use(cors())
app.use(session({
  secret: process.env.secret_key, // Replace with a strong secret
  resave: false,
  saveUninitialized: false,
}));
// app.use(cors({
//   origin: ['http://localhost:8080', 'http://localhost:5000', 'https://express-app-r2vg.onrender.com'],
//   methods: 'GET,POST',
// }));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
const eventServiceHandler = require("./public/js/eventServiceHandler.js");
var events = eventServiceHandler.mockData.events;

app.get('/events', (req, res) => {
    res.send(events);
});

app.get('/events/:id', (req, res) => {
    const id = Number(req.params.id);
    const event = events.find(event => event.id === id);
    res.send(event);
});

app.get('/readFromSheet/', (req, res) => {
  debugger;
  var data = eventServiceHandler.downloadFile_test(); 
});

app.get('/listFiles/', async (req, res) => {
  debugger;
  var auth = await googleAuth.authorize();
  var list = await googleUtility.listFiles(auth);
})

app.get('/listFilesUnderFolder/:folderId/pageSize/:pageSize', async (req, res) => {
  debugger;
  var result = {ok: true};
  var folderId = req.params.folderId; //'1ZbV78lR5wQntzf1zgfQ5NlzTsgf2ThSg'; //This is boroghor folder ID
  var pageSize = req.params.pageSize;
  var auth = await googleAuth.loadSavedCredentialsIfExist(); //await googleAuth.authorize();
  if (!auth) {
    result.ok = false;
    result.status = 'Authorization required.';
    res.send(result);
    return;
  }
  var response = await googleUtility.listFilesUnderFolderId(auth, folderId, pageSize);
  if(!response || !response.ok){
    result.ok = false;
    result.status = response.status;
    res.send(result);
    return;
  }
  var files = response.files;
  if (files.length === 0) {
    // console.log('No files found.');
    result.status = 'No files found.';
    res.send(result);
    return;
  }
  result.status = 'Ok';
  result.files = files;
  res.send(result);
  // return result;
  // console.log('Files:');
  // files.map((file) => {
  //   console.log(`${file.name} (${file.id})`);
  // });
})

// app.get('/oauth2callback/', (req, res) => {
//   debugger;
//   res.send('Authentication Successful.');
// })

app.get('/authorize', async (req, res) => {
  debugger;
  var result = await googleAuth.authorize();//.then(googleAuth.listFiles).catch(console.error);
  // console.log(result);
  var authUrl = result.authUrl;
  oauth2Client = result.oauth2Client;
  var state = result.state;
  req.session.state = state;
  res.send(authUrl);
  // var $xhrCore = new xhrCore();
  // var htmlText = await $xhrCore.getFromUrl(authUrl);
  // res.render(htmlText);
  // res.header('Access-Control-Allow-Origin', '*');
  // res.redirect(authUrl); //https://www.geeksforgeeks.org/express-js-res-redirect-function/
})


app.get('/oauth2callback', async (req, res) => {
  debugger;
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('No authorization code found.');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // You can now use the tokens to make API requests on behalf of the user
    console.log('Tokens acquired:', tokens);

    // Saving tokens
    var response = await googleAuth.saveCredentials(tokens);
    if(!response.ok) {
      console.log(response.status);
      return;
    }

    res.send('Authentication successful!');
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    res.status(500).send('Authentication failed.');
  }
})

app.get('/xhrGetTest', (req, res) => {
  debugger;
  var $xhrCore = new xhrCore();
  $xhrCore.getFromUrl_test();
})