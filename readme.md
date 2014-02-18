# Node Twitter Streaming 

In this tutorial we'll be building an app to pull in real-time Tweets using Twitter's [streaming API](https://dev.twitter.com/docs/streaming-apis) along with [NodeJS](http://nodejs.org/), [Express](http://expressjs.com/), and [Socket.IO](http://socket.io/).

For the **[Node-js-Denver-Boulder Meetup](http://www.meetup.com/Node-js-Denver-Boulder/)** <3 Cheers!

> **Requirements**: This tutorial starts where this intro [tutorial](https://github.com/mjhea0/node-getting-started), Getting Started with Node, ends. If you've never set up a Node/Express application before, please start with the intro tutorial.

## Project Setup

As you know, Node uses Javascript for both the client and server side. Because of this, the project structure is even more important to not only seperate out different concerns (client vs server) but also for your own understanding - e.g., so you can distinguish between client and server side code.

Let's get to it.

### 1. Setup basic project structure with Express

```sh
$ express twit-stream
```

### 2. Install dependencies:

```sh
$ cd twit-stream && npm install
```

### 3. Your project structure should look like this:

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

## Client Side Code


