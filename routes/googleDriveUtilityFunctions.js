const express = require('express');
const router = express.Router(); // Create a new router instance

const googleAuth = require("../public/js/googleDriveAuthentication.js");
const googleUtility = require("../public/js/googleDriveUtilityFunctions.js");

router.get('/listFilesUnderFolder/:folderId/pageSize/:pageSize', async (req, res) => {
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

router.get('/readFromFileById/:fileId', async (req, res) => {
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

router.get('/searchFolderFromDrive/:folderName', async (req, res) => {
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

module.exports = router;