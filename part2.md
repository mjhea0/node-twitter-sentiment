# Node Twitter Sentiment - Part 2

This is for the [Node-js-Denver-Boulder](http://www.meetup.com/Node-js-Denver-Boulder/) Meetup <3 Cheers!

You can grab the example code here.

> Miss part 1? Check it out [here](http://mherman.org/blog/2014/02/19/node-twitter-sentiment/).

Let's begin ...

Before adding additional functionality to the [Node Twitter Sentiment Analysis](https://github.com/mjhea0/node-twitter-sentiment) application, we need to refactor the code. Frankly, there are some mistakes that were made on purpose to highlight an issue that many new developers overlook when first working with Node.

Remember this function from *index.js* in the routes folder:

```javascript
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
  // set highest score
  var highestScore = -Infinity;
  // set highest choice
  var highestChoice = null;
  // create new array
  var array = [];
  // set score
  var score = 0;
  console.log("----------")

  // iterate through the choices array from the request
  for(var i = 0; i < choices.length; i++) {
    (function(i) {
    // add choice to new array
    array.push(choices[i])
    // grad 20 tweets from today
    twitter.get('search/tweets', {q: '' + choices[i] + ' since:' + today.getFullYear() + '-' + 
      (today.getMonth() + 1) + '-' + today.getDate(), count:20}, function(err, data) {
        // perfrom sentiment analysis (see below)
        score = performAnalysis(data['statuses']);
        console.log("score:", score)
        console.log("choice:", choices[i])
        //  determine winner
        if(score > highestScore) {
          highestScore = score;
          highestChoice = choices[i];
          console.log("winner:",choices[i])
        }
        console.log("")
      });
    })(i)
  }
  // send response back to the server side; why the need for the timeout?
  setTimeout(function() { res.end(JSON.stringify({'score': highestScore, 'choice': highestChoice})) }, 5000);   
};
```

Essentially we're grabbing the user inputted data, pulling tweets based on the inputs, and thenn calculating the sentiment of those tweets. The timeout is necessary because of how Node [works](http://stackoverflow.com/questions/7931537/whats-the-difference-between-asynchronous-non-blocking-event-base-architectu/9489547#9489547). Because Node is asynchronous, long running functions do not block other functions from running. Without the 5 second timout, the next function will append the results to the Dom without waiting for the function to finish running. Essentially, nothing is appended. Make sense?

Timeouts are problamic though. 

Again, the code has a function that sends the result in 5 seconds, regardless as to the execution state of the call to twitter. What happens though, if we run the program without a network connection? Or if Twitter is down? Or if we pulled in 10,000 tweets instead of 20?

It's still going to return results after 5 seconds. This is not what we want, obviously. So, how do we fix it? There's a number of different methods, none of which fully solve it in an elegant manner. In this post, we'll look at:

| Method           | URL                                                          | Library                                  |
|------------------|--------------------------------------------------------------|------------------------------------------|
| Async            | https://github.com/mjhea0/node-twitter-sentiment-async       | https://github.com/caolan/async          |
| Promises         | https://github.com/mjhea0/node-twitter-sentiment-promises    | https://github.com/kriskowal/q           |
| Data Binding     | https://github.com/mjhea0/node-twitter-sentiment-databinding | https://github.com/knockout/knockout                                      |
| Generators       | https://github.com/mjhea0/node-twitter-sentiment-generators  | n/a                                      |
| IcedCoffeeScript | n/a                                                          | https://github.com/maxtaco/coffee-script |


## Ascnc

- Add code and explanation

## Promises 

- Add code and explanation

## Data Binding

> Thanks to [Aaron Vandrey](http://www.meetup.com/Node-js-Denver-Boulder/members/103374712/) for developing the code and writing the following explanation.

Although there are a number of frontend MV* frameworks that could be used, we chose the [KnockoutJS](https://github.com/knockout/knockout) data binding library for simplicity. KnockoutJS uses “observables” to enable two-way data binding from the View (HTML) back to the View-model (JavaScript). 

From [10 things to know about KnockoutJS on day one])http://www.knockmeout.net/2011/06/10-things-to-know-about-knockoutjs-on.html)":

> Observables are functions. The actual value and subscribers to the observable are cached internally by the function. You set an observable’s value by passing the new value as the only argument to the function and you read the value by passing no arguments. 

We can use these functions to read the values from the form directly, hide and expose DIVs and change text on the screen. 

From the KnockoutJS data-binding [page](http://knockoutjs.com/documentation/binding-syntax.html): 

> Knockout’s declarative binding system provides a concise and powerful way to link data to the UI. It’s generally easy and obvious to bind to simple data properties or to use a single binding.
…
A binding consists of two items, the binding name and value, separated by a colon.

### Server Side Code

4. Views

Combining the functions in our *app.js* (more on this later) with Knockout’s declarative  data-binding syntax, we can set up the Jade template in the manner shown below. 

In the original Jade template there are placeholder DIVs set up that we then use jQuery to interact with - to display the error messages and results. We also used jQuery to update the styles applied to the DIVs. Since we are using data binding in this example, we will go ahead and set up the DIVs for errors and results and have their HTML and styles in the DOM at all times. Then using the “visible” data binding on the DIVs we can hide and expose them as needed. In the example below we have a couple of data-bind attributes that KnockoutJS will use to handle the two-way communication from the View to the ViewModel and vise-versa.

## Generators 

- Add code and explanation

## IcedCoffeeScript

- Add code and explanation


## Conclusion

Thanks to [John Rosendahl](http://www.meetup.com/Node-js-Denver-Boulder/members/74687302/) for help with writing the intro.
