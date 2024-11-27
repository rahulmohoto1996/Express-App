/* #version=0.0.0-0#17 rm 2024-11-26T19:45:18 B27D251AAAB0B979 */
/* #version=0.0.0-0#16 rm 2024-11-26T19:44:43 A216DDC3A1ADAE8E */
var XMLHttpRequest = require('xhr2');

module.exports = class xhrCore {

    constructor() {
        console.log("Greetings from xhrCore API.");
    }

    async getFromUrl(url) {
        debugger;
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function() {
                if(this.readyState === 4) {
                    // console.log(this.responseText);
                    resolve(this.responseText);
                }
            });

            xhr.open("GET", url);

            xhr.send();
        })
    }

    async getFromUrl_test() {
        var url = "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%253A%252F%252Fwww.googleapis.com%252Fauth%252Fdrive.metadata.readonly%2520https%253A%252F%252Fwww.googleapis.com%252Fauth%252Fdrive.readonly&response_type=code&client_id=1089481054028-qnpr3i4g8jla69ig53qo23snv59visc1.apps.googleusercontent.com&redirect_uri=http%253A%252F%252Flocalhost%253A5000%252Foauth2callback"
        var result = await this.getFromUrl(url);
        console.log(result);
    }

}

// var $xhrCore = new xhrCore();

// module.exports = $xhrCore;