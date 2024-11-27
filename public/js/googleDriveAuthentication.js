/* #version=0.0.0-0#35 rm 2024-11-27T13:56:58 DE92085BB907E778 */
/* #version=0.0.0-0#34 rm 2024-11-27T13:54:25 D32A106826A343E1 */
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
const VIRTUAL_CREDENTIALS_PATH = path.join(process.cwd(), 'virtualCredentials.json');

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
  async saveCredentials(client) {
    const content = await fs.readFile(VIRTUAL_CREDENTIALS_PATH); //await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
    console.log('Token Wrote Successfully.');
  },
  
  /**
   * Load or request or authorization to call APIs.
   *
   */
  async authorize() {
    debugger;
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    // await this.createVirtualCredentials();
    // console.log('Created Virtual Config File.');

    var content = await fs.readFile(CREDENTIALS_PATH);
    var keys = JSON.parse(content);
    var redirect_uris = keys.web.redirect_uris;
    var REDIRECT_URI = process.env.NODE_ENV === 'production' ? redirect_uris.find((n) => n.env == "prod") : redirect_uris.find((n) => n.env == "dev");
    REDIRECT_URI = REDIRECT_URI.uri;

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

    return {authUrl: authUrl, oauth2Client: oauth2Client, state: state};
    // try {
    //   client = await authenticate({
    //     scopes: SCOPES,
    //     keyfilePath: VIRTUAL_CREDENTIALS_PATH, //CREDENTIALS_PATH,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
    // console.log('Authenticated with Google.');
    // if (client.credentials) {
    //   await this.saveCredentials(client);
    //   this.deleteFile(VIRTUAL_CREDENTIALS_PATH);
    //   console.log('Virtual File Deleted Successfully.');
    // }
    // return client;
  },

  //Creating a virtual credential file
  async createVirtualCredentials() {
    var content = await fs.readFile(CREDENTIALS_PATH);
    var keys = JSON.parse(content);
    var client_secret = process.env.client_secret;
    var client_id = process.env.client_id;
    keys.web.client_secret = client_secret;
    keys.web.client_id = client_id;
    var redirect_uris = keys.web.redirect_uris;
    var REDIRECT_URI = process.env.NODE_ENV === 'production' ? redirect_uris.find((n) => n.env == "prod") : redirect_uris.find((n) => n.env == "dev");
    keys.web.redirect_uris = [REDIRECT_URI.uri];
    console.log(`${JSON.stringify(keys, null, 4)}`);
    await fs.writeFile(VIRTUAL_CREDENTIALS_PATH, JSON.stringify(keys));
  },

  //deleting a file
  deleteFile(path) {
    fs.unlink(path, (err) => {
      if (err) 
        throw err;
    });
    return {ok: true}
  }
}