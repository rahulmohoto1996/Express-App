const express = require('express');
const router = express.Router(); // Create a new router instance

const FireBase = require('../public/js/fireBase.js');
const fireBaseApp = new FireBase();

router.get('/register/userMail/:userMail/password/:password', async (req, res) => {
  debugger;
  var result = {ok: true, status: 'ok'}
  var userMail = req.params.userMail;
  var password = req.params.password;
  if(!userMail || !password) {
    result.ok = false;
    result.status = 'invalid usermail or password provided.'
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

router.get('/login/userId/:userId/password/:password', async (req, res) => {
  debugger;
  var result = {ok: true, status: 'ok'}
  var userId = req.params.userId;
  var password = req.params.password;
  if(!userId || !password) {
    result.ok = false;
    result.status = 'invalid userId or, password provided.'
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

router.get('/reset/userMail/:userMail', async (req, res) => {
  debugger;
  var result = {ok: true, status: 'ok'}
  var userMail = req.params.userMail;
  if(!userMail) {
    result.ok = false;
    result.status = 'invalid usermail provided.'
    res.send(result)
  }

  let nodeName = "user";
  let path = "info/mail";
  let searchedParam = userMail;

  let response = await fireBaseApp.queryDB(nodeName, path, searchedParam);
  debugger;

  if(!response || !response.ok) {
    result.ok = false;
    result.status = response.status;
  }
  result.data = response.data;

  res.send(result);
})

module.exports = router;