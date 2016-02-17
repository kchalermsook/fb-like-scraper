var cookieFilename = "cookie";
var fs = require('fs');
var utils = require('utils');
var moment = require('moment');
var USER_JSON_FILENAME = "user_json.txt";

var topics;
var currentTopic;
var currentUser;
var openFriendPage = function(userId) {
    casper.thenOpen("https://www.facebook.com/search/" + userId + "/friends", function() {
        console.log("Friend Page opened " + "https://www.facebook.com/search/" + userId + "/friends");
    });
};
var openAboutPage = function(userId) {
    casper.thenOpen("https://www.facebook.com/profile.php?id=" + userId + "&sk=about", function() {
        console.log("About Page opened" + "https://www.facebook.com/profile.php?id=" + userId + "&sk=about");
    });
};
var openWorkPage = function(userId) {
    casper.thenOpen("https://www.facebook.com/" + userId + "/about?section=education&pnref=about", function() {
        console.log("Work Page opened");
    });
};
var openLifeEventPage = function(userId) {
    casper.thenOpen("https://www.facebook.com/" + userId + "?sk=about&section=year-overviews&pnref=about", function() {
        console.log("Life Event Page opened");
    });
};

var openLikePage = function(userId) {
    casper.thenOpen("https://www.facebook.com/profile.php?id=" + userId + "&sk=likes", function() {
        console.log("Like Page opened");
    });
};

///
var TIME_SCROLL = 3000;
var scrollBottom = function(numberOfTime) {
    for (var i = 0; i < numberOfTime; i++) {
        var myI = i;
        casper.then(function() {
            this.scrollToBottom();
        });
        casper.then(function() {
            this.wait(TIME_SCROLL); //Wait a bit so page loads (there are a lot of ajax calls and that is why we are waiting 6 seconds)
        });
    }

};

var capture = function(name) {
    casper.then(function() {
        this.capture(name);
    });
};

var waitSec = function(numSec) {
    casper.then(function() {
        this.wait(numSec * 1000); //Wait a bit so page loads (there are a lot of ajax calls and that is why we are waiting 6 seconds)
    });
};

/// Data 
var getDataFriendID = function() {
    casper.then(function() {
        docs = this.getElementsInfo('div[data-bt]:not([data-bt=""])');
        var all = [];
        for (var i = 0; i < docs.length; i++) {
            attr = JSON.parse(docs[i].attributes["data-bt"]);
            if (attr.id) {
                // console.log(docs[i].attributes["data-gt"]);
                all.push({
                    userId: attr.id,
                });
            }
        }
        // utils.dump(all);
        var friendText = all.map(function(elem) {
            return elem.userId;
        }).join("|");
        currentUser.friendIds = friendText;
    });
};

var getDataBirthdate = function() {
    console.log("getDataBirthDate");
    casper.then(function() {
        if (this.exists('span._c24._50f3 div:nth-child(2)')) {
            console.log("exist getDataBirthDate");
            docs = this.getElementsInfo('span._c24._50f3 div:nth-child(2)');
            birthdate = docs[0].text;
            utils.dump(currentUser);
            currentUser.birthdate = birthdate;
        } else {
            console.log("not exist getDataBirthDate");
             utils.dump(currentUser);

            currentUser.birthdate = "";
        }




    });
};
var getDataArea = function() {
    console.log("getDataArea");
    casper.then(function() {
        currentUser.area = "";
        if (this.exists('._6a._5u5j._6b')) {
            docs = this.getElementsInfo('._6a._5u5j._6b');
            // utils.dump(docs);
            for (var i = 0; i < docs.length; i++) {
                if (docs[i].text.indexOf("Lives in") >= 0) {
                    area = docs[i].text;
                    console.log("area " + area);
                    currentUser.area = area;
                }
            }
        } else {

        }


    });
};

var getDataWork = function() {
    console.log("getDataWork");
    casper.then(function() {
        docs = this.getElementsInfo('div._4qm1[data-pnref=work] div._42ef > div._6a');
        var workText = docs.map(function(elem) {
            return elem.text;
        }).join("|");
        console.log("workText : " + workText);
    });
};

var getDataEducation = function() {
    console.log("getDataEducation");
    casper.then(function() {
        docs = this.getElementsInfo('div._4qm1[data-pnref=edu] div._42ef > div._6a');
        var workText = docs.map(function(elem) {
            return elem.text;
        }).join("|");
        console.log("education : " + workText);
    });
};

var getDataLifeEvent = function() {
    console.log("getDataLifeEvent");
    casper.then(function() {
        docs = this.getElementsInfo('li._2pi4');
        utils.dump(docs);
        var lifeEventText = docs.map(function(elem) {
            return elem.text;
        }).join("|");
        console.log("lifeEvent : " + lifeEventText);
    });
};

var getLikeAndTopic = function() {
    console.log("getLikeAndTopic");
    casper.then(function() {
        docs = this.getElementsInfo('div._3dc.lfloat._ohe._5brz > a:not(._3s-)');
        topics = [];
        for (var i = 0; i < docs.length; i++) {
            var topicLink = docs[i].attributes.href;
            var topicName = docs[i].attributes.name;
            topics.push({
                name: topicName,
                link: topicLink
            });
        }
        // utils.dump(topics);
        // var lifeEventText = docs.map(function(elem) {
        //     return elem.text;
        // }).join("|");
        // console.log("lifeEvent : " + lifeEventText );
    });
};

var addPageLikeDataToTopicArr = function() {
    casper.then(function() {
        docs = this.getElementsInfo('div.fsl.fwb.fcb > a');
        var pagesLike = docs.map(function(elem) {
            return elem.text;
        }).join("|");
        currentTopic.pages = pagesLike;
    });
};

var casper = require('casper').create({
    // verbose: true,
    // logLevel: 'debug',
    viewportSize: {
        width: 1900,
        height: 2400
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

var dataJsonUser = fs.read(USER_JSON_FILENAME);
var users = JSON.parse(dataJsonUser);
// utils.dump(users);
users.forEach(function(user) {
    console.log("raw data");
    utils.dump(user);
    //// 0. resolve id 
    casper.thenOpen("https://www.facebook.com/" + user.id, function() {
        if (this.getCurrentUrl().split("=").length >= 2) {
            newId = this.getCurrentUrl().split("=")[1];
            if (newId) {
                user.id = newId;
            }
        }
        currentUser = user;

        ///////////1. Get Friend IDS 
        // openFriendPage(user.id);
        // scrollBottom(1);
        // capture("friend.png");
        // getDataFriendID();
        ////////// 2. Get Birthdate 
        utils.dump(users);
        openAboutPage(user.id);
        scrollBottom(1);
        // capture("birthday.png");
        getDataBirthdate();
        //////////// 3. Get Area 
        capture("area.png");
        getDataArea();
    });

});

///// Last Step. Log the result 
casper.then(function() {
    console.log("log before end ");
    utils.dump(users);
});
casper.run();


// https://www.facebook.com/search/30/20/users-age-2/616836771737354/likers/intersect     // People who like Yamaha Tricity Thailand and are older than 20 and younger than 30

///////// 1. Get Friend IDS 
// openFriendPage("100005337915032");

// scrollBottom(5);

// getDataFriendID();

// casper.run();

////////// 2. Get Birthdate 
// openAboutPage("100007764045750");

// scrollBottom(1);

// capture("birthday.png");

// getDataBirthdate();

// casper.run();

//////////// 3. Get Area 
// openAboutPage("825145523");

// scrollBottom(1);

// capture("area.png");

// getDataArea();

// casper.run();
//////////// 4. Get Work 
// openWorkPage("825145523");

// scrollBottom(1);

// capture("work.png");

// getDataWork();

// casper.run();

//////////// 5. Get Education 
// openWorkPage("825145523");

// scrollBottom(1);

// capture("work.png");

// getDataEducation();

// casper.run();

//////////// 6. Get Life Event
// openLifeEventPage("825145523");

// scrollBottom(1);

// capture("lifeEvent.png");

// getDataLifeEvent();

// casper.run();

//////////// 7. Get Like And Topic
// openLikePage("100005337915032");

// scrollBottom(1);

// waitSec(5);

// capture("likes.png");

// getLikeAndTopic();

// casper.then(function() {
//     utils.dump(topics);
//     topics.forEach(function(topic) {
//         casper.thenOpen(topic.link, function() {
//             currentTopic = topic;
//             console.log("open link " + topic.link);
//             waitSec(2);
//             addPageLikeDataToTopicArr();
//         });
//     });
// });

// casper.then(function() {
//     utils.dump(topics);
// });
