function getAllElementsWithAttribute(attribute) {
    var matchingElements = [];
    var allElements = document.getElementsByTagName('*');
    for (var i = 0, n = allElements.length; i < n; i++) {
        if (allElements[i].getAttribute(attribute) !== null) {
            // Element exists with attribute. Add to array.
            matchingElements.push(allElements[i]);
        }
    }
    return matchingElements;
}
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
casper.start().thenOpen("https://facebook.com", function() {
    console.log("Facebook website opened");
});


//Now we have to populate username and password, and submit the form
casper.then(function() {
    console.log("Login using username and password");
    this.evaluate(function() {
        document.getElementById("email").value = "hideoaki@gmail.com";
        document.getElementById("pass").value = "Ooaakk01";
        document.getElementById("loginbutton").children[0].click();
    });
});

//Wait to be redirected to the Home page, and then make a screenshot
casper.then(function() {
    console.log("wait 6 secs for loading ");
    var cookies = JSON.stringify(phantom.cookies);
    fs.write(cookieFilename, cookies, 644);
    this.wait(6000); //Wait a bit so page loads (there are a lot of ajax calls and that is why we are waiting 6 seconds)
    // this.capture('AfterLogin.png');
});
// open the page we want 
casper.thenOpen("https://www.facebook.com/browse/?type=page_fans&page_id=760197027443228", function() {
    console.log("Open to the page we want and wait 3 secs");
    this.wait(3000);

});

casper.then(function() {
    this.evaluate(function() {
        users = getAllElementsWithAttribute("data-gt");
        console.log("finish get all users");
        console.log(users);
    });
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
