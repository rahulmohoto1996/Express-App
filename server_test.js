/* #version=0.0.0-0#2 rm 2024-11-29T19:35:55 37EC0DFDDFE337AD */
/* #version=0.0.0-0#1 rm 2024-11-29T19:35:12 6E93CEFB6C5E8278 */
//this includes all the test functions
app.get('/readFromSheet/', (req, res) => {
  debugger;
  var data = eventServiceHandler.downloadFile_test(); 
});

app.get('/listFiles/', async (req, res) => {
  debugger;
  var auth = await googleAuth.authorize();
  var list = await googleUtility.listFiles(auth);
})

app.get('/xhrGetTest', (req, res) => {
    debugger;
    var $xhrCore = new xhrCore();
    $xhrCore.getFromUrl_test();
  })
  
  app.get('/readxlsfiletest', async (req, res) => {
    debugger;
    var auth = await googleAuth.loadSavedCredentialsIfExist(); //await googleAuth.authorize();
    if (!auth) {
      result.ok = false;
      result.status = 'Authorization required.';
      res.send(result);
      return;
    }
    var response = await googleUtility.readExcelFromDrive_test(auth);
    debugger;
  })
  
  app.get('/searchFolderFromDriveTest', async (req, res) => {
    debugger;
    var auth = await googleAuth.loadSavedCredentialsIfExist(); //await googleAuth.authorize();
    if (!auth) {
      result.ok = false;
      result.status = 'Authorization required.';
      res.send(result);
      return;
    }
    var response = await googleUtility.searchFolderByName_test(auth);
    debugger;
  
  })

  app.get('/testSavingFirebase', async (req, res) => {
    debugger;
    var payload = {
      node: 'data', 
      child: '1', 
      data: 'Hello World'
    };
    // var message = 'Hello world';
    var result = await fireBaseApp.postData(payload);
    var status = result;
    res.status(200).send(status);
  });
  
  app.get('/testReadingFirebase', async (req, res) => {
    debugger;
    var payload = {
      node: 'data',
      child: '1'
    }
    var result = await fireBaseApp.getData(payload);
    res.status(200).send(result);
    debugger;
  })