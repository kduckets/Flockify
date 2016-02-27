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
    

    // configuration =================

    //mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

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
     var router = express.Router(); 
     app.set('port', (process.env.PORT || 5000));

        router.post('/giphysearch', function(req, resp){
            var search = req.body.search;
            // Search with options using promise 
           
                giphy.search({q:req.body.search, limit:'50'}).then(function(res) {
                    return resp.json(res);
                    // Res contains gif data! 
                });
            });


            //     router.post('/podcastsearch', function(req, resp){
            // var audiosearch = new Audiosearch('9814e9a65391df3b5b523e1093bba9a63a089101f725d1b56fb3ac3ab3de44e3',
            //  '7f98e6cfab3cf8b59b4f3ab1472fa8ca65dc6628247b9940626a75d1cc824ef9');
            // var search = req.body.search;
            // // Search with options using promise 
           
            //  audiosearch.searchEpisodes(search).then(function (res) {
            //     var parser = new xml2js.Parser();

            //         return resp.json(res);
            //         // Res contains gif data! 
            //     });
            // });




                router.post('/podcastfeed', function(req, resp){
       
            var feed = req.body.feed;
            rsj.r2j(feed,function(res) {
                resp.setHeader('Content-Type', 'application/json');
                resp.send(res);

            })
           
   
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

  
