const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
var PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname+'/'));
app.use(bodyParser.urlencoded({extended: true}));

// sets ejs templating engine
app.set('view engine', 'ejs');

// Endpoint variables
var path = '/';
var hall  = '/hall';
var mainHTML = __dirname + '/index.html';
var hallHTML = __dirname + '/hall.html';

// Mongo variables
var db;
var scores = 'Scores Collection';
var DB_link = 'mongodb://Ralph:NotNow123@ds011439.mlab.com:11439/memory-stinks';

// HTTP methods
var GET_main = (req, res) => {
	res.sendFile(mainHTML);
};

var GET_scores = (req, res) => {
	var cursor = db.collection(scores).find()
		.toArray((err, results) => {
			if (err) return console.log(err);
			res.render('hall.ejs', {scores: results});
		});
};

var POST_scores = (req, res) => {
	db.collection(scores).save(req.body, (err, result) => {
		if (err) return console.log(err);
		console.log('Score saved to database');
		res.redirect(hall);
		console.log('Successful Redirect to Hall of Fame');
	})
};

// HTTP requests
app.get(path, GET_main);
app.get(hall, GET_scores);
app.post(hall, POST_scores);

// Mongo connection and server initiation
MongoClient.connect(DB_link, (err, database) => {
	if (err) return console.log(err);
	db = database;
	app.listen(PORT, () => {
		console.log('Node server running... ');
	})
});