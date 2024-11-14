const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

module.exports = {
    /**
   * Lists the names and IDs of up to 10 files.
   * @param {OAuth2Client} authClient An authorized OAuth2 client.
   */
  async listFiles(authClient) {
    debugger;
    const drive = google.drive({version: 'v3', auth: authClient});
    const res = await drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    });
    const files = res.data.files;
    if (files.length === 0) {
      console.log('No files found.');
      return;
    }
  
    console.log('Files:');
    files.map((file) => {
      console.log(`${file.name} (${file.id})`);
    });
  },

  /**
   * Lists the names and IDs of up to 10 files under specified folder id.
   * @param {OAuth2Client} authClient, @param folderId An authorized OAuth2 client.
   */
  async listFilesUnderFolderId(authClient, folderId) {
    debugger;
    const drive = google.drive({version: 'v3', auth: authClient});
    const res = await drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
      q: `'${folderId}' in parents` //https://stackoverflow.com/questions/60054640/how-to-use-google-drive-api-to-get-list-of-all-files-in-specific-folder
    });
    var files = res.data.files;
    return files;
  }
}