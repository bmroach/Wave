var express = require('express');
var request = require("request");
var keys = require("./../config/keys.json");
var http = require('http');
var async = require('async');

module.exports = function(app, passport){

    app.post('/callApis', function (req, res) {

        console.log(req.body)
        var searchTerm = req.body.query;
        var beginDate = req.body.startDate;
        var endDate = req.body.endDate;
        var responseList = []
        var data = []
        var emotionKey = keys.emotion_key;
        var baseUrl = "http://nytimes.com/"
        request.get({
          url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
          qs: {
              'api-key': keys.nyt,
              'q': searchTerm,
              'begin_date': beginDate,
              'end_date': endDate
          },
        }, function (err, response, body) {
            var articles = JSON.parse(body).response.docs;
            for (i = 0; i < articles.length; i++) {
                try {
                    responseList.push(baseUrl + articles[i].multimedia[1].url)
                }
                catch (err) {
                    continue
                }
        }
            async.forEach(responseList, function(image, callback){
                request({
                    method: 'POST',
                    url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
                    headers: {
                       "Content-Type": 'application/json',
                       "Ocp-Apim-Subscription-Key": emotionKey
                    },
                    body: "{\"url\" : \"" + image + "\"}"
                }, function (error, response, body){
                    console.log(image)
                    if (JSON.parse(body).length > 0){
                        var scores = JSON.parse(body)[0].scores
                        data.push({ 'image' : image, 'anger': scores.anger, 'contempt' : scores.contempt, 'disgust': scores.disgust, 'fear' : scores.fear, 'happiness' : scores.happiness, 'neutral' : scores.neutral, 'sadness' : scores.sadness, 'surprise' : scores.surprise})
                    }
                    callback(null);
                });
            }, function (err){
                res.send(data)
            })
        })
    })

}