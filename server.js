// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var Firebase = require("firebase");
    var giphy = require('giphy-api')();
    var Audiosearch = require('audiosearch-client-node');
    var rsj = require('rsj');
    var xml2js = require('xml2js');
    var http = require('http');
    var ejs = require('ejs');
    var Discogs = require('disconnect').Client;


    // configuration =================

    app.use(express.static(__dirname + '/app'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    var bodyParser = require('body-parser');
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    var https = require('https');
    app.use(methodOverride());

    //
    var env = process.env.NODE_ENV || 'production';
    var firebase_url = env == 'production'? 'https://flockify.firebaseIO.com' : 'https://resplendent-heat-6063.firebaseio.com';
    console.log("ENVIRONMENT IS:", env);
    console.log("FIREBASE_URL IS:", firebase_url);

    // app config
    app.set('port', (process.env.PORT || 5000));
    app.engine('html', ejs.renderFile);
    app.set('view engine', 'html');
    app.set('views', __dirname + "/app/views")
    // listen (start app with node server.js) ======================================



    //routes

    var router = express.Router();
    router.post('/wanotification', function(req, resp){
      var clientId = "FREE_TRIAL_ACCOUNT"; // No need to change
      var clientSecret = "PUBLIC_SECRET";  // No need to change
      var phoneNumbers = ["14152508533", "15086330105", "19789734390", "12566588765", "19783282088","19784306872","19788860125","19788521242"];
      var arrayLength = phoneNumbers.length;

      for (var i = 0; i < arrayLength; i++) {
      var jsonPayload = JSON.stringify({
      number: phoneNumbers[i],
      message: req.body.user + " posted a new album. Check it: https://flockify.herokuapp.com"
      });

      var options = {
      hostname: "api.whatsmate.net",
      port: 80,
      path: "/v1/whatsapp/single/message/1",
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "X-WM-CLIENT-ID": clientId,
          "X-WM-CLIENT-SECRET": clientSecret,
          "Content-Length": Buffer.byteLength(jsonPayload)
        }
      };

      var request = new http.ClientRequest(options);
      request.end(jsonPayload);

      request.on('response', function (response) {
      console.log('Heard back from the WhatsMate WA Gateway:\n');
      console.log('Status code: ' + response.statusCode);
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
          console.log(chunk);
      });
        });
      }
    });


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
var defaultView = process.env.DEFAULT_VIEW || 'index'; //NOTE: Temporary for refactoring -Oat
console.log(defaultView);

app.get('/', function(req, res){
  res.render(defaultView, {
    firebase_url: firebase_url
  })
});

app.use('/api', router);

// app.listen(8080);
// console.log("App listening on port 8080");
//
// ************************************
// This is the real meat of the example
// ************************************
(function() {

  // Step 1: Create & configure a webpack compiler
  var webpack = require('webpack');
  var webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : './webpack.config');
  var compiler = webpack(webpackConfig);

  // Step 2: Attach the dev middleware to the compiler & the server
  app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
  }));

  // Step 3: Attach the hot middleware to the compiler & the server
  app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  }));
})();

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
