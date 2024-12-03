/* #version=0.0.0-0#44 rm 2024-12-03T14:45:11 8543EF57891F8418 */
/* #version=0.0.0-0#43 rm 2024-12-03T14:40:11 BF6C3794788D4F5C */
//KB: https://developers.google.com/drive/api/quickstart/nodejs
//KB: https://developers.google.com/identity/protocols/oauth2/web-server
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.readonly'

];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
// const VIRTUAL_CREDENTIALS_PATH = path.join(process.cwd(), 'virtualCredentials.json');

module.exports = {

    /**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async loadSavedCredentialsIfExist() {
    debugger;
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  },
  
  /**
   * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async saveCredentials(tokens) {
    debugger;
    if(!tokens) return {
      ok: false,
      status: 'Tokens not available.'
    }
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token
    });
    await fs.writeFile(TOKEN_PATH, payload);
    console.log('Token Wrote Successfully.');
    return {ok: true, status: 'Ok'}
  },
  
  /**
   * Load or request or authorization to call APIs.
   *
   */
  async authorize() {
    debugger;
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return {client: client, ok: true, status: 'Client is authorized already.'};
    }
    
    var content = await fs.readFile(CREDENTIALS_PATH);
    var keys = JSON.parse(content);
    var redirect_uris = keys.web.redirect_uris;
    var REDIRECT_URI = process.env.NODE_ENV === 'production' ? redirect_uris.find((n) => n.env == "prod") : redirect_uris.find((n) => n.env == "dev");
    REDIRECT_URI = REDIRECT_URI.uri;

    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID, // Your Google OAuth Client ID
        process.env.CLIENT_SECRET, // Your Google OAuth Client Secret
        REDIRECT_URI // Redirect URI for server
      );
  
      const state = crypto.randomBytes(32).toString('hex');
  
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES, // Add necessary scopes
        include_granted_scopes: true,
        state: state
      }); 

      return {authUrl: authUrl, oauth2Client: oauth2Client, state: state, ok: true, status: 'Authorization URL generated.'};

    } catch (error) {
      return {ok: false, status: `Authorization Failed. Error: ${error}`}
    }
  },

  //Creating a virtual credential file. 
  //Not used anymore.
  // async createVirtualCredentials() {
  //   var content = await fs.readFile(CREDENTIALS_PATH);
  //   var keys = JSON.parse(content);
  //   var client_secret = process.env.client_secret;
  //   var client_id = process.env.client_id;
  //   keys.web.client_secret = client_secret;
  //   keys.web.client_id = client_id;
  //   var redirect_uris = keys.web.redirect_uris;
  //   var REDIRECT_URI = process.env.NODE_ENV === 'production' ? redirect_uris.find((n) => n.env == "prod") : redirect_uris.find((n) => n.env == "dev");
  //   keys.web.redirect_uris = [REDIRECT_URI.uri];
  //   console.log(`${JSON.stringify(keys, null, 4)}`);
  //   await fs.writeFile(VIRTUAL_CREDENTIALS_PATH, JSON.stringify(keys));
  // },

  //deleting a file
  //Not used
  // deleteFile(path) {
  //   fs.unlink(path, (err) => {
  //     if (err) 
  //       throw err;
  //   });
  //   return {ok: true}
  // }
}