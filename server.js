// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var Firebase = require("firebase");
    var firebaseRef = new Firebase("https://megastream.firebaseio.com/");

    

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


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.get('/*', function(req,res){
res.sendfile("index.html", { root: __dirname + "/app" });
});

app.use('/api', router);
  
    app.listen(8080);
    console.log("App listening on port 8080");

  