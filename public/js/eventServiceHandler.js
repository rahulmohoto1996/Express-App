/* #version=0.0.0-0#17 rm 2024-11-26T18:44:20 1E7241F37577ED50 */
/* #version=0.0.0-0#16 rm 2024-11-26T18:44:08 AAD00E1FA4B3A6E6 */
var XLSX = require("xlsx"); //Adding XLSX read from sheetJS library.
const googleAuth = require("./googleDriveAuthentication.js");
const googleUtility = require("./googleDriveUtilityFunctions.js");

module.exports = {

    mockData: {
        events : 
            [
                {
                    id: 1,
                    name: 'Charity Ball',
                    category: 'Fundraising',
                    description: 'Spend an elegant night of dinner and dancing with us as we raise money for our new rescue farm.',
                    featuredImage: 'https://placekitten.com/500/500',
                    images: [
                    'https://placekitten.com/500/500',
                    'https://placekitten.com/500/500',
                    'https://placekitten.com/500/500',
                    ],
                    location: '1234 Fancy Ave',
                    date: '12-25-2019',
                    time: '11:30'
                },
                {
                    id: 2,
                    name: 'Rescue Center Goods Drive',
                    category: 'Adoptions',
                    description: 'Come to our donation drive to help us replenish our stock of pet food, toys, bedding, etc. We will have live bands, games, food trucks, and much more.',
                    featuredImage: 'https://placekitten.com/500/500',
                    images: [
                    'https://placekitten.com/500/500'
                    ],
                    location: '1234 Dog Alley',
                    date: '11-21-2019',
                    time: '12:00'
                }
            ]
    },
    
    // getAllEvents: function() {
    //     app.get('/events', (req, res) => {
    //         res.send(events);
    //     });
    // },
    
    // getSelectedEventsFromId: function() {
    //     app.get('/events/:id', (req, res) => {
    //         const id = Number(req.params.id);
    //         const event = events.find(event => event.id === id);
    //         res.send(event);
    //     });
    // }

    //https://stackoverflow.com/questions/76210589/read-excel-file-from-google-shared-drive-in-app-script-without-insert
    // readFromSheetJS: function() {
    //     debugger;
    //     const filename = "1kgChini.xls"; // Please set the filename of XLSX
    //     const folderId = "1ZbV78lR5wQntzf1zgfQ5NlzTsgf2ThSg"; // Please set the folder ID.
    //     const sheetName = "Sheet1"; // Please set the sheet name you want to retrieve the values.
      
    //     // Retrieve XLSX file using the filename.
    //     const files = DriveApp.getFolderById(folderId).searchFiles(`title='${filename}' and mimeType='${MimeType.MICROSOFT_EXCEL}' and trashed=false`);
    //     const file = files.hasNext() && files.next();
    //     if (!file) throw new Error("No file.");
    //     const fileId = file.getId();
      
    //     // Retrieve values from XLSX data.
    //     const data = new Uint8Array(DriveApp.getFileById(fileId).getBlob().getBytes());
    //     const book = XLSX.read(data, { type: "array" });
    //     const csv = XLSX.utils.sheet_to_csv(book.Sheets[sheetName]);
    //     const values = Utilities.parseCsv(csv);
      
    //     console.log(values);
    // },

    // readFromSheetJS_test() {

    //     debugger;
    //     var test = this.readFromSheetJS();
    //     console.log(test);

    // }

    async downloadFile(realFileId) {
        debugger;
        // Get credentials and build service
        // TODO (developer) - Use appropriate auth mechanism for your app
      
        const {GoogleAuth} = require('google-auth-library');
        const {google} = require('googleapis');
      
        // const auth = new GoogleAuth({
        //   scopes: 'https://www.googleapis.com/auth/drive',
        // });
        // const service = google.drive({version: 'v3', auth});
        var auth = await googleAuth.authorize();
        var service = google.drive({version: 'v3', auth});
      
        fileId = realFileId;
        try {
          const file = await service.files.get({
            fileId: fileId,
            alt: 'media',
          });
          console.log(file.status);
          return file.status;
        } catch (err) {
          // TODO(developer) - Handle error
          throw err;
        }
    },

    async downloadFile_test() {
        var fileId = '1huuXH6UHB17KytXTQ5B0hFa2c5t1ilBz'; //This is 1kgChini.xls file --> 1huuXH6UHB17KytXTQ5B0hFa2c5t1ilBz
        var result = await this.downloadFile(fileId);
    }
    
    }