var FB = require('fb');
FB.setAccessToken('CAACEdEose0cBAOofqM3dndTA1DzUEZCoZBZB1eUZC6ULtfYZAAfcVPVakOGaXfYzd4ZA6da1VcGKb0ZACc5FkRq7D1okMhy0ZC2RVerrpPEYECHHFQrT3EJMxtn8KDcTR1dGw8hPxV0UshIvqWbxiIm8N29YOIq6ZCJvdZC5niMZCVfqTwz4ZCr5ZAiSq4qPhZAJIRXvlN4XOvjPCC2QZDZD');


var getWhoLikePost = function(postId, limit) {
    FB.api(postId + '/likes?limit='+limit+'&pretty=0', function(res) {
        if (!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        console.log(res);
    });
};

var getCommentsOfPost = function(postId){
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