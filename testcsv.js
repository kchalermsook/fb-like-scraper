 var json2csv = require('json2csv');
 var fs = require('fs');
 // var data = fs.read("sample-json.txt");
 //First step is to open Facebook
 // users = JSON.parse(data);
 users = [{
     'id': 'test',
     'name': 'test',
     'friendIds': 'test',
     'birthdate': 'test',
     'area': 'test',
     'works': 'test',
     'educations': 'test',
     'lifeEvents': 'test',
     'likes': 'test'
 }];
 var fields = ['id', 'name', 'friendIds', 'birthdate', 'area', 'works', 'educations', 'lifeEvents', 'likes'];
 json2csv({
     data: users,
     fields: fields
 }, function(err, csv) {
     if (err) console.log(err);
     console.log(csv);
     fs.writeFile("result.csv", csv, function(err) {
         if (err) {
             return console.log(err);
         }

         console.log("The csv file was saved!");
     });
 });
