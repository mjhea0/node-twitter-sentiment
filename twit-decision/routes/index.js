"use strict";

var path = require("path");
var twit = require('twit');
var sentimental = require('Sentimental');
var config = require("../config");
var async = require('async');

exports.index = function(req, res){
  res.render('index', { title: "Twit-Decision"});
};

exports.ping = function(req, res){
  res.send("pong!", 200);
};

exports.search = function(req, res) {
  // grab the request from the client
  var choices = JSON.parse(req.body.choices);
  // grab the current date
  var today = new Date();
  // establish the twitter config (grab your keys at dev.twitter.com)
  var twitter = new twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
  });
  console.log("----------")

  // grade 20 tweets from today with keyword choice and call callback
  // when done
  function getAndScoreTweets(choice, callback) {
    twitter.get('search/tweets', {q: '' + choice + ' since:' + today.getFullYear() + '-' + 
      (today.getMonth() + 1) + '-' + today.getDate(), count:20}, function(err, data) {
        // perfrom sentiment analysis (see below)
      if(err) {
        console.log(err);
        callback(err.message, undefined);
        return;
      }
      var score = performAnalysis(data['statuses']);
      console.log("score:", score)
      console.log("choice:", choice)
      callback(null, score);
    });
  }
  //Grade tweets for each choice in parallel and compute winner when
  //all scores are collected
  async.map(choices, getAndScoreTweets, function(err, scores) {
    if(err) {
      console.log("Unable to score all tweets");
      res.end(JSON.stringify(err));
    }
    var highestChoice = choices[0];
    var highestScore = scores.reduce(function(prev, cur, index) { 
      if(prev < cur) {
        highestChoice = choices[index];
        return cur;
      } else {
        return prev;
      }
    });
    res.end(JSON.stringify({'score': highestScore, 'choice': highestChoice}));
  });				      
}

function performAnalysis(tweetSet) {
  //set a results variable
  var results = 0;
  // iterate through the tweets, pulling the text, retweet count, and favorite count
  for(var i = 0; i < tweetSet.length; i++) {
    var tweet = tweetSet[i]['text'];
    var retweets = tweetSet[i]['retweet_count'];
    var favorites = tweetSet[i]['favorite_count'];
    // remove the hashtag from the tweet text
    tweet = tweet.replace('#', '');
    // perfrom sentiment on the text
    var score = sentimental.analyze(tweet)['score'];
    // calculate score
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
  // return score
  results = results / tweetSet.length;
  return results
}
