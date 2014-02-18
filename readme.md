# Node Twitter Streaming 

In this tutorial we'll be building an app to pull in real-time Tweets using a Twitter client library for Node called [Twit](https://github.com/ttezel/twit) along with [NodeJS](http://nodejs.org/), [Express](http://expressjs.com/), and [Sentimental](https://www.npmjs.org/package/Sentimental) (for sentiment analysis).

This is for the **[Node-js-Denver-Boulder Meetup](http://www.meetup.com/Node-js-Denver-Boulder/)** <3 Cheers!

> **Requirements**: This tutorial starts where this intro [tutorial](https://github.com/mjhea0/node-getting-started), Getting Started with Node, ends. If you've never set up a Node/Express application before, please start with the intro tutorial. Thanks.

## Project Setup

As you know, Node uses Javascript for both the client and server side. Because of this, the project structure is even more important to not only seperate out different concerns (client vs server) but also for your own understanding - e.g., so you can distinguish between client and server side code.

Let's get to it.

### 1. Setup basic project structure with Express

```sh
$ express twit-decision
```

### 2. Install dependencies for Node, Express, and Jade:

```sh
$ cd twit-decision && npm install
```

### 3. Your project structure should now look like this:

```sh
.
├── app.js
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── user.js
└── views
    ├── index.jade
    └── layout.jade
```

#### What's going on?

  - Server side code includes *app.js* (app configurations, middleware, and routing), the "routes" folder (controller/business logic), and the *views* folder (views, templates, partials)
  - Meanwhile, client side code includes the "public" folder (images, Javascript files, and stylesheets)

### 4. Run the server

```sh
$ node app
```

You should see the "Welcome to Express Text".

## Server Side Code

We'll start with the server side. Our server code will be responsible for serving up our main `index` page, which will display two input boxes where the end user can enter data for comparison. When the data is passed to the server, via jQuery and AJAX on the client end, the server connects to Twitter, pulls the live tweets, and processes sentiment. Finally, the server sends the results back to the client.

### Install Dependences

```sh
$ npm install twit --save
$ npm install sentimental --save
```



