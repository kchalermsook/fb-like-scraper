var cookieFilename = "cookie";
var fs = require('fs');
var utils = require('utils');
var casper = require('casper').create({
    // verbose: true,
    // logLevel: 'debug',
    viewportSize : {
        width: 1600, height: 900
    },
    pageSettings: {
        loadImages: false, //The script is much faster when this field is set to false
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
    }
});
var data = fs.read(cookieFilename);
//First step is to open Facebook
casper.start();

casper.then(function() {
    phantom.cookies = JSON.parse(data);
});
// https://www.facebook.com/search/30/20/users-age-2/616836771737354/likers/intersect     // People who like Yamaha Tricity Thailand and are older than 20 and younger than 30
casper.thenOpen("https://www.facebook.com/ThaiProgrammerSociety/messages/", function() {
    console.log("Facebook website opened");
});

casper.then(function() {
    console.log("wait 3 secs for loading ");
    this.wait(3000); //Wait a bit so page loads (there are a lot of ajax calls and that is why we are waiting 6 seconds)
    this.capture('message.png');
});


casper.then(function() {
    docs = this.getElementsInfo('._gll a');
    // var all = [];
    // for (var i = 0; i < docs.length; i++) {
    //     name = docs[i].text;
    //     href = docs[i].attributes.href;
    //     all.push({
    //         href: href,
    //         name: name
    //     });
    // }
    utils.dump(all);
});


casper.run();
