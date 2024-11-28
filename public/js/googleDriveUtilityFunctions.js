/* #version=0.0.0-0#1 rm 2024-11-28T19:16:58 F03C145318171B28 */
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
  async listFilesUnderFolderId(authClient, folderId, pageSize) {
    debugger;
    var result = {ok: true, status: 'Ok'};
    var files = null;
    try {
      const drive = google.drive({version: 'v3', auth: authClient});
      const res = await drive.files.list({
        pageSize: pageSize || 10, //Default pageSize is 10.
        fields: 'nextPageToken, files(id, name)',
        q: `'${folderId}' in parents` //https://stackoverflow.com/questions/60054640/how-to-use-google-drive-api-to-get-list-of-all-files-in-specific-folder
      });
      files = res.data.files;
      result.files = files;
    } catch (error) {
      result.ok = false;
      result.status = error;
    }
    return result;
  }
}