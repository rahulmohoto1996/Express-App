/* #version=0.0.0-0#8 rm 2024-11-29T14:55:30 906F2AFAC1653204 */
/* #version=0.0.0-0#7 rm 2024-11-29T14:45:10 1C15B7859B641373 */
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const XLSX = require('xlsx');

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
   * @param {OAuth2Client} authClient, @param folderId An authorized OAuth2 client, @param pageSize
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
  },

  /**
   * Read XLSX file from google drive.
   * @param {OAuth2Client} authClient, @param fileId An authorized OAuth2 client
   */
  async readExcelFromDrive(authClient, fileId) {
    debugger;
    var result = {ok: true};
    try {
        const drive = google.drive({version: 'v3', auth: authClient});
        // Get the file as a stream
        const res = await drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'arraybuffer' }
        );

        // Parse the file using XLSX
        const buffer = Buffer.from(res.data); // Convert array buffer to Buffer
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON
        // console.log(data); // Log the parsed data
        result.status = 'Ok';
        result.parsedData = data;
    } catch (error) {
      result.ok = false;
      result.status = `Error reading file: ${error}`;
        // console.error('Error reading file:', error);
        // throw error;
    }
    return result;
  },

  readExcelFromDrive_test(auth) {
    debugger;
    var fileId = '1huuXH6UHB17KytXTQ5B0hFa2c5t1ilBz' //chini.xls file reading.
    var data = this.readExcelFromDrive(auth, fileId);
    console.log(data);
  }
}