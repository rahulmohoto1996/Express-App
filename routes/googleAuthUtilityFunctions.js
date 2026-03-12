const express = require('express');
const router = express.Router(); // Create a new router instance

var oauth2Client = null;

const googleAuth = require("../public/js/googleAuthCore.js");

const FireBase = require('../public/js/fireBase.js');
const fireBaseApp = new FireBase();

router.get('/authorize', async (req, res) => {
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


router.get('/oauth2callback', async (req, res) => {
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

module.exports = router;