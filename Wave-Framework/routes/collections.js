var express = require('express');
var router = express.Router();
var request = require("request");
var collection = require('./../config/updateCollection');

module.exports = function(app, passport) {

	app.get('/testing', function (req, res) {
		res.render('test.ejs');
	});

	app.get('/collections', isLoggedIn, function(req, res) {
        res.render('collections.ejs');
    });
	app.post('/addToCollection', isLoggedIn, function(req, res) {

		console.log("DEBUG");
		console.log(req.body.name);

		/*if (req.body.name.length <= 0)
			//dont do anything
*/
		var name = req.body.name;
		var data = {name: name, items : ["test", "testing"]}
		collection.addToCollection(req.user.id, data);
		res.render('collections.ejs');
	});
	app.get('/getCollections', isLoggedIn, function(req, res) {

		var collections = req.user.local.collections;

		for (i = 0; i < collections.length; i ++) {
			console.log(req.user.local.collections[i].name)
			console.log(req.user.local.collections[i].items)
		} 
		res.render('collections.ejs');
	});

}
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/auth');
}

