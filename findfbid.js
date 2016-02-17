var cookieFilename = "cookie";
var fs = require('fs');
var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false, //The script is much faster when this field is set to false
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
    }
});

//First step is to open Facebook
casper.start().thenOpen("http://findmyfbid.com", function() {
    console.log("findmyfbid website opened");
});


//Now we have to populate username and password, and submit the form
casper.then(function() {
    this.evaluate(function() {
        document.getElementsByName("url")[0].value = "krissada";
        document.getElementsByClassName("btn btn-primary")[0].click();
    });
});

//Wait to be redirected to the Home page, and then make a screenshot
casper.then(function() {
    console.log("url" + this.getCurrentUrl());
    // this.capture('AfterLogin.png');
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
