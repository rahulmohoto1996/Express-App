/* #version=0.0.0-0#12 rm 2024-11-14T19:41:55 C426AD075C2EF7BA */
/* #version=0.0.0-0#11 rm 2024-11-14T19:02:02 7D061CE5873E1C90 */
const googleAuth = require("./googleDriveAuthentication.js");
const googleUtility = require("./googleDriveUtilityFunctions.js");

var express = require('express')
var cors = require('cors')
var app = express()
 
app.use(cors())

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
const eventServiceHandler = require("./eventServiceHandler.js");
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

app.get('/authorize/', (req, res) => {
  debugger;
  var data = googleAuth.authorize();//.then(googleAuth.listFiles).catch(console.error);
})

app.get('/listFiles/', async (req, res) => {
  debugger;
  var auth = await googleAuth.authorize();
  var list = await googleUtility.listFiles(auth);
})

app.get('/listFilesUnderFolder/', async (req, res) => {
  debugger;
  var folderId = '1ZbV78lR5wQntzf1zgfQ5NlzTsgf2ThSg'; //This is boroghor folder ID
  var auth = await googleAuth.authorize();
  var files = await googleUtility.listFilesUnderFolderId(auth, folderId);
  if (files.length === 0) {
    console.log('No files found.');
    return;
  }
  console.log('Files:');
  files.map((file) => {
    console.log(`${file.name} (${file.id})`);
  });
})

app.get('/oauth2callback/', (req, res) => {
  debugger;

})