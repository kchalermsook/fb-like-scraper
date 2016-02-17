var getAllElementsWithAttribute = function(doc, tagName, attribute) {
    var matchingElements = [];
    var allElements = doc.getElementsByTagName(tagName);
    console.log(allElements);
    for (var i = 0, n = allElements.length; i < n; i++) {
        if (allElements[i].getAttribute(attribute) !== null) {
            // Element exists with attribute. Add to array.
            matchingElements.push(allElements[i]);
        }
    }
    return matchingElements;
}
var cookieFilename = "cookie";
var cookieFilename = "cookie";
var fs = require('fs');
var utils = require('utils');
var casper = require('casper').create({
    // verbose: true,
    // logLevel: 'debug',
    viewportSize: {
        width: 1600,
        height: 900
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
casper.thenOpen("https://www.facebook.com/browse/likes?id=1229991333697612&actorid=536678779695541", function() {
    console.log("Facebook website opened");
});

casper.then(function() {
    console.log("wait 6 secs for loading ");
    this.wait(3000); //Wait a bit so page loads (there are a lot of ajax calls and that is why we are waiting 6 seconds)
    this.capture('AfterLogin.png');
});
casper.then(function() {
    this.scrollToBottom();
    this.wait(3000); //Wait a bit so page loads (there are a lot of ajax calls and that is why we are waiting 6 seconds)
    this.capture('AfterLogin2.png');
});

casper.then(function() {
    docs = this.getElementsInfo('a[data-gt]:not([data-gt=""])');
    var all = [];
    for (var i = 0; i < docs.length; i++) {
        attr = JSON.parse(docs[i].attributes["data-gt"]);
        href = docs[i].attributes.href;
        if (attr.engagement) {
            // console.log(docs[i].attributes["data-gt"]);
            all.push({
                userId: attr.engagement.eng_tid,
                href: href,
                name: docs[i].text
            });
        }
    }
    utils.dump(all);
});

//Get all images greater than 100x100 pixels
// casper.then(function() {
//     var images = this.evaluate(function() {
//         var facebookImages = document.getElementsByTagName('img');
//         var allSrc = [];
//         for (var i = 0; i < facebookImages.length; i++) {
//             if (facebookImages[i].height >= 100 && facebookImages[i].width >= 100)
//                 allSrc.push(facebookImages[i].src);
//         }
//         return JSON.stringify(allSrc);
//     });
//     console.log(images);
// });

casper.run();
