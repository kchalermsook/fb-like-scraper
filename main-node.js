var FB = require('fb');
var json2csv = require('json2csv');
var fs = require('fs');
var USER_JSON_FILENAME = "user_json.txt";
FB.setAccessToken('CAACEdEose0cBAB9JExnzlj9fptCdVZAkbUdL9lUtVnZCWFXvIm2YAFS7ZCj6LiAiZAt49ANV5ZByAgxX0BVpMP6J9oCFy4wid5BtDFkKFZBgYTBkifyyIuXRLc8ji6XyaNPZARoxSn9lKbipnr1GKXOkpUKD9S0Wo88qHh0OB9evdYPP6wmKr5YYsZCIZCTjc9JrchHfTB3nT7QZDZD');


var getWhoLikePost = function(postId, limit) {
    FB.api(postId + '/likes?limit=' + limit + '&pretty=0', function(res) {
        if (!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        var content = JSON.stringify(res.data);
        fs.writeFile(USER_JSON_FILENAME, content, function(err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    });
};

var getCommentsOfPost = function(postId) {
    FB.api(postId + '/?fields=comments', function(res) {
        if (!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        console.log(res.comments.data);
    });
};

getWhoLikePost("1229825353714210", 1);
// getCommentsOfPost("1229825353714210");

// var fields = ['car', 'price', 'color'];
// var myCars = [
//   {
//     "car": "Audi",
//     "price": 40000,
//     "color": "blue"
//   }, {
//     "car": "BMW",
//     "price": 35000,
//     "color": "black"
//   }, {
//     "car": "Porsche",
//     "price": 60000,
//     "color": "green"
//   }
// ];


// json2csv({ data: myCars, fields: fields }, function(err, csv) {
//   if (err) console.log(err);
//   console.log(csv);
// });
