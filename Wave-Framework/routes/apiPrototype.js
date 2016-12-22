var express = require('express');
var request = require("request");
var keys = require("./../config/keys.json");
var http = require('http');
var

var router = express.Router();

//declare independent functions for each task

function nyTimes(){
    request.get({
        url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
        qs: {
            'api-key': keys.nyt,
            'q': searchTerm,
            'begin_date': beginDate,
            'end_date': endDate
        },
    }, function (err, response, body) {
        var apiReturn = JSON.parse(body);
        console.log(apiReturn.response.docs.length)
        articles = apiReturn.response.docs;

        for (i = 0; i < articles.length; i++) {
            try {
                console.log(articles[i].pub_date)
                console.log(articles[i].multimedia[1].url)
                // dates.push(articles[i].pub_date);
                // images.push(articles[i].multimedia[1].url);
            }
            catch (err) {
                continue
            }
        }
    }
}


function faceAtrributes() {
    var emotionKey = keys.emotion_key;
    var faceKey = keys.face_key;
    for (i = 0; i < images.length; i++) {
        var reqUrl = baseUrl + images[i]
        request({
            method: 'POST',
            url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
            headers: {
                "Content-Type": 'application/json',
                "Ocp-Apim-Subscription-Key": emotionKey
            },
            body: "{\"url\" : \"" + reqUrl + "\"}"
        }, function (error, response, body) {
            try {
                // scores.push(JSON.parse(body)[0].scores)
                console.log(JSON.parse(body)[0].scores)
            }
            catch (err) {
                console.log("not found")
            }
        });
    }
}

function faceDetect(){
    request({
        method: 'POST',
        url: 'https://api.projectoxford.ai/face/v1.0/detect?returnFaceAttributes=age,gender',
        headers: {
            "Content-Type": 'application/json',
            "Ocp-Apim-Subscription-Key": faceKey
        },
        body: "{\"url\" : \"" + reqUrl + "\"}"
    }, function (error, response, body) {
        try {
            console.log(JSON.parse(body)[0].faceAttributes);
        }
        catch (err) {
            console.log("not found")
        }
    })
}



router.post('/callApi', function(req, res){
    var searchTerm = req.body.searchTerm;
    var beginDate = req.body.beginDate;
    var endDate = req.body.endDate;
    var baseUrl = 'https://nytimes.com/'

    //declare all variable that will be used to pass data between .then functions
    var articles;
    var dates = [];
    var images = [];
    var scores = [];


    Promise.resolve()
        .then(function() {
            return new Promise(function(resolve, reject) {
                nyTimes()
            });
        })

        .then(function() {
            faceAtrributes()
        })

        .then(function() {
            faceDetect()
        });

    res.send(responseData);

})

module.exports = router




