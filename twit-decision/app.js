// module dependencies
var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  fs = require('fs'),
  twit = require('twit'),
  sentimental = require('Sentimental');

// twitter config file
var config = require('./config');

// create express app  
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routes
app.get('/', routes.index);
app.get('/ping', routes.ping);

function performAnalysis(tweetSet) {
	var results = 0;
	for(var i = 0; i < tweetSet.length; i++) {
		tweet = tweetSet[i]['text'];
		retweets = tweetSet[i]['retweet_count'];
		favorites = tweetSet[i]['favorite_count'];
		tweet = tweet.replace('#', '');
		var score = sentimental.analyze(tweet)['score'];
		results += score;
		if(score > 0){
			if(retweets > 0) {
				results += (Math.log(retweets)/Math.log(2));
			}
			if(favorites > 0) {
				results += (Math.log(favorites)/Math.log(2));
			}
		}
		else if(score < 0){
			if(retweets > 0) {
				results -= (Math.log(retweets)/Math.log(2));
			}
			if(favorites > 0) {
				results -= (Math.log(favorites)/Math.log(2));
			}
		}
		else {
			results += 0;
		}
	}
	results = results / tweetSet.length;
	return results
}

app.post('/query', function(req, res) {
	
	var choices = JSON.parse(req.body.choices);
	var today = new Date();
	
	var twitter = new twit({
		consumer_key: config.consumer_key,
		consumer_secret: config.consumer_secret,
		access_token: config.access_token,
		access_token_secret: config.access_token_secret
	});
	
	var highestScore = -Infinity;
	var highestChoice = null;
	var array = [];
	var score = 0;
	console.log("----------")
	for(var i = 0; i < choices.length; i++) {
		(function(i) {
			array.push(choices[i])
			twitter.get('search/tweets', {q: '' + choices[i] + ' since:' + today.getFullYear() + '-' + 
				(today.getMonth() + 1) + '-' + today.getDate(), count:20}, function(err, data) {
				score = performAnalysis(data['statuses']);
				console.log("score:", score)
				console.log("choice:", choices[i])
				if(score > highestScore) {
					highestScore = score;
					highestChoice = choices[i];
					console.log("winner:",choices[i])
				}
				console.log("")
			});
		})(i)
	}
	setTimeout(function() { res.end(JSON.stringify({'score': highestScore, 'choice': highestChoice})) }, 10000);
	
});

// create server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
