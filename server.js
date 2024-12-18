/* #version=0.0.0-0#112 rm 2024-12-06T16:10:48 F776CAADD5DDE732 */
/* #version=0.0.0-0#111 rm 2024-12-06T16:10:14 9660A1CD7CCF48BF */
const googleAuth = require("./public/js/googleDriveAuthentication.js");
const googleUtility = require("./public/js/googleDriveUtilityFunctions.js");
const xhrCore = require("./public/js/xhrCore.js"); // import xhrCore from "./public/js/xhrCore.js";

const process = require('process');
const dotenv = require('dotenv');
dotenv.config();

var FireBase = require('./public/js/fireBase.js');
var fireBaseApp = new FireBase();

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

app.get('/register/userMail/:userMail/password/:password', async (req, res) => {
  debugger;
  var result = {ok: true, status: 'Ok'}
  var userMail = req.params.userMail;
  var password = req.params.password;
  if(!userMail || !password) {
    result.ok = false;
    result.status = 'invalid usermail or password prvided.'
    res.send(result)
  }
  var userId = Math.random().toString(36).slice(2); //generates alpha-numeric string
  var user = {mail: userMail, password: password};
  var payload = {
    node: 'user', 
    child: userId, 
    key: 'info',
    data: user
  };
  var response = await fireBaseApp.postData(payload);
  if(!response || !response.ok) {
    result.ok = false;
    result.status = response.status;
  }
  result.userId = userId;
  res.send(result);
})

app.get('/login/userId/:userId/password/:password', async (req, res) => {
  debugger;
  var result = {ok: true, status: 'Ok'}
  var userId = req.params.userId;
  var password = req.params.password;
  if(!userId || !password) {
    result.ok = false;
    result.status = 'invalid userId or, password prvided.'
    res.send(result)
  }
  var payload = {
    node: 'user', 
    child: userId
  };
  var response = await fireBaseApp.getData(payload);
  if(!response || !response.ok) {
    result.ok = false;
    result.status = response.status;
  }
  result.data = response.data.info;
  res.send(result);
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
})

app.get('/readFromFileById/:fileId', async (req, res) => {
  debugger;
  var result = {ok: true};
  var fileId = req.params.fileId;
  if(!fileId) {
    result.ok = false;
    result.status = 'Fileid not specified.';
    res.send(result);
    return;
  }
  var auth = await googleAuth.loadSavedCredentialsIfExist(); //await googleAuth.authorize();
  if (!auth) {
    result.ok = false;
    result.status = 'Authorization required.';
    res.send(result);
    return;
  }
  var response = await googleUtility.readExcelFromDrive(auth, fileId);
  if(!response || !response.ok){
    result.ok = false;
    result.status = response.status;
    res.send(result);
    return;
  }
  result.status = 'Ok';
  result.parsedData = response.parsedData;
  res.send(result);
})

app.get('/searchFolderFromDrive/:folderName', async (req, res) => {
  debugger;
  var result = {ok: true};
  var folderName = req.params.folderName;
  if(!folderName) {
    result.ok = false;
    result.status = 'Foldername not specified.';
    res.send(result);
    return;
  }
  var auth = await googleAuth.loadSavedCredentialsIfExist(); //await googleAuth.authorize();
  if (!auth) {
    result.ok = false;
    result.status = 'Authorization required.';
    res.send(result);
    return;
  }
  var response = await googleUtility.searchFolderByName(auth, folderName);
  if(!response || !response.ok){
    result.ok = false;
    result.status = response.status;
    res.send(result);
    return;
  }
  result.status = 'Ok';
  result.folders = response.folders;
  res.send(result);
})

app.get('/authorize', async (req, res) => {
  debugger;
  var result = await googleAuth.authorize();//.then(googleAuth.listFiles).catch(console.error);
  if(!result.ok || !result) {
    res.send(result);
    return;
  }
  if(result.status == 'Client is authorized already.') {
    res.send(result);
    return;
  }
  // console.log(result);
  // var authUrl = result.authUrl;
  oauth2Client = result.oauth2Client;
  var state = result.state;
  req.session.state = state;
  // result.ok = true;
  // result.status = result.status;
  res.send(result); // res.redirect(authUrl); //https://www.geeksforgeeks.org/express-js-res-redirect-function/
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
    // var response = await googleAuth.saveCredentials(tokens); //Saving to local
    var payload = {
      node: 'credential', 
      child: 'test', 
      key: 'tokens',
      data: tokens
    };
    var response = await fireBaseApp.postData(payload)
    if(!response.ok) {
      console.log(response.status);
      return;
    }

    //Returning the status to client
    var result = {ok: true, status: 'Authentication successful!'};

    res.send(result);
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    var result = {ok: false, status: 'Authentication failed.'};
    res.status(500).send(result);
  }
})
