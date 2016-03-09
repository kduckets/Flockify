// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var url = require('url'); //ACR api calls
    var fs = require('fs');
    var crypto = require('crypto'); //ACR api calls
    var request = require('request');
    var Firebase = require("firebase");
    var firebaseRef = new Firebase("https://megastream.firebaseio.com/");
    var giphy = require('giphy-api')();
    var Audiosearch = require('audiosearch-client-node');
    var rsj = require('rsj');
    var xml2js = require('xml2js');
    var http = require('http');

    // configuration =================

    app.use(express.static(__dirname + '/app'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    var bodyParser = require('body-parser');
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    var https = require('https');
    app.use(methodOverride());

    // listen (start app with node server.js) ======================================

    //routes
    app.set('port', (process.env.PORT || 5000));
    var router = express.Router();

    // Giphy comment search
    router.post('/giphysearch', function(req, resp){
      giphy.search({q: req.body.search, limit: '50'}).then(function(res) {
          return resp.json(res);
          // Res contains gif data!
      });
    });

    // podcast feed from Itunes
    router.post('/podcastfeed', function(req, resp){
      var feed = req.body.feed;
      rsj.r2j(feed,function(res) {
        resp.setHeader('Content-Type', 'application/json');
        resp.send(res);
      })
    });

    // Canistream it parser
    router.post('/findstreams', function(req, resp){
      var movie = req.body.movie;
      http.get({host: 'http://www.canistream.it/services/search?movieName=' + movie}, function(response) {
        var body = '';
        response.on('data', function(d) {
          body += d;
        });
        response.on('end', function() {
          var parsed = JSON.parse(body);
          return resp.json(parsed);
        });
      });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.get('/*', function(req,res){
  res.sendfile("index.html", { root: __dirname + "/app" });
});

app.use('/api', router);

// app.listen(8080);
// console.log("App listening on port 8080");

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


