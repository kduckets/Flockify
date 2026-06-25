// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var firebase = require("firebase");
    var giphy = require('giphy-api')('0s0sS8XT4hFsa792K9yoHRofdisgZJTf');
    var rsj = require('rsj');
    var xml2js = require('xml2js');
    var http = require('http');
    var ejs = require('ejs');
    var Discogs = require('disconnect').Client;
    var SpotifyWebApi = require('spotify-web-api-node');
    var Mailchimp = require('mailchimp-api-v3')
    var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);



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

    var spotifyApi = new SpotifyWebApi({
  clientId : process.env.SPOTIFY_CLIENT_ID,
  clientSecret : process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri : 'http://flockify.herokuapp.com/callback.html',
    });

    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant()
      .then(function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
      }, function(err) {
            console.log('Something went wrong when retrieving an access token', err);
      });


    //routes

    var router = express.Router();
    router.post('/wanotification', function(req, resp){
      var clientId = "kmditroia@gmail.com";
      var clientSecret = "1def0f5ac5a04884b8fd0434e755b884";
      var phoneNumbers = ["14152508533", "15086330105", "19789734390", "12566588765", "19783282088","19784306872","19789878891","19788521242","15083400792","19148829254","15084796150","15083403559"];
      var arrayLength = phoneNumbers.length;

      for (var i = 0; i < arrayLength; i++) {
      var jsonPayload = JSON.stringify({
      number: phoneNumbers[i],
      message: req.body.user + " posted a new album. Check it: https://flockify.herokuapp.com"
      });

      var options = {
      hostname: "api.whatsmate.net",
      port: 80,
      path: "/v3/whatsapp/single/text/message/11",
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

    router.post('/songkick', function(req, resp){
      var artist = encodeURI(req.body.artist);
      var ip = encodeURI(req.body.ip);
      var req_str = "/api/3.0/events.json?apikey=oiEBOxqRUq4nSFje&artist_name="+ artist +"&location=ip:"+ip;
      var options = {
      hostname: "api.songkick.com",
      port: 80,
      path: req_str,
      method: "GET",
      };
      var request = new http.ClientRequest(options);
      var req = http.get(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));

      var bodyChunks = '';
      res.on('data', function(chunk) {
      bodyChunks+= chunk;
        }).on('end', function() {
          var body = JSON.parse(bodyChunks);
          return resp.json(body);
          console.log('BODY: ' + body);
        })
      });
      req.on('error', function(e) {
        return resp.send(e);
        console.log('ERROR: ' + e.message);
      });
    })

      //
      // request.on('response', function (sk_response) {
      //   var body = '';
      // sk_response.on('data', function (sk_data) {
      //     body += sk_data;
      // sk_response.on('end', function() {
      //       var parsed = JSON.parse(body);
      //       return resp.json(parsed);
      //     });
      // });
      //   });
      // request.end();
      //});

    router.post('/emailnotification', function(req, resp){

      mailchimp.post('campaigns', {
         recipients : {'list_id':'3500f59233'},
         type: 'regular',
         settings :{'subject_line': req.body.user +' posted a new album.',
         'reply_to':'kmditroia@gmail.com',
         'from_name':'Flockify',
          'template_id':55}
        })
      .then(function(results) {
          console.log(results.id);
          mailchimp.post('/campaigns/' + results.id + '/actions/send');
          })
      .catch(function (err) {
          console.log(err);
        })
      });




    function deezerNormalizeAlbum(r) {
      var artist = r.artist || {};
      return {
        id: r.id,
        name: r.title,
        collectionType: r.record_type || 'album',
        artists: [{ name: artist.name || '' }],
        images: [
          { url: r.cover_xl || r.cover_big || r.cover_medium || '' },
          { url: r.cover_big || r.cover_medium || '' },
          { url: r.cover_medium || r.cover || '' }
        ],
        release_date: r.release_date || '',
        external_urls: { spotify: r.link || '' },
        uri: 'https://widget.deezer.com/widget/dark/album/' + r.id,
        copyrights: [{ text: '' }]
      };
    }

    function deezerFetch(path) {
      return new Promise(function(resolve) {
        https.get('https://api.deezer.com' + path, function(res2) {
          var body = '';
          res2.on('data', function(d) { body += d; });
          res2.on('end', function() {
            try { resolve(JSON.parse(body)); } catch(e) { resolve({}); }
          });
        }).on('error', function() { resolve({}); });
      });
    }

    router.get('/deezer/search', function(req, resp) {
      var q = encodeURIComponent(req.query.q || '');

      // Two searches in parallel: general + artist-specific
      Promise.all([
        deezerFetch('/search/album?q=' + q + '&limit=50'),
        deezerFetch('/search/album?q=artist:"' + q + '"&limit=50')
      ]).then(function(responses) {
        var seen = {};
        var items = [];

        var allowed = { 'album': true, 'ep': true };
        responses.forEach(function(data) {
          (data.data || []).forEach(function(r) {
            if (!seen[r.id] && allowed[r.record_type]) {
              seen[r.id] = true;
              items.push(deezerNormalizeAlbum(r));
            }
          });
        });

        // Full albums first, then EPs, then singles — newest first within each type
        var order = { 'album': 0, 'ep': 1, 'single': 2 };
        items.sort(function(a, b) {
          var typeOrder = (order[a.collectionType] || 3) - (order[b.collectionType] || 3);
          if (typeOrder !== 0) return typeOrder;
          return (b.release_date || '').localeCompare(a.release_date || '');
        });

        resp.json({ albums: { items: items, total: items.length } });
      }).catch(function(e) { resp.status(500).json({ error: e.message }); });
    });

    router.get('/deezer/albums/:id', function(req, resp) {
      deezerFetch('/album/' + req.params.id).then(function(data) {
        if (!data.id) return resp.status(404).json({ error: 'Album not found' });
        resp.json(deezerNormalizeAlbum(data));
      }).catch(function(e) { resp.status(500).json({ error: e.message }); });
    });

    function ensureSpotifyToken() {
      return spotifyApi.clientCredentialsGrant().then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
      });
    }

    router.get('/spotify/test', function(req, resp) {
      ensureSpotifyToken().then(function() {
        var token = spotifyApi.getAccessToken();
        var options = {
          hostname: 'api.spotify.com',
          path: '/v1/search?q=test&type=album&limit=1',
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
        };
        var req2 = https.request(options, function(res2) { // eslint-disable-line
          var body = '';
          res2.on('data', function(d) { body += d; });
          res2.on('end', function() {
            try { body = JSON.parse(body); } catch(e) { /* leave as string */ }
            resp.status(res2.statusCode).json({ status: res2.statusCode, body: body });
          });
        });
        req2.on('error', function(e) { resp.status(500).json({ error: e.message }); });
        req2.end();
      }).catch(function(err) {
        resp.status(500).json({ error: err.message });
      });
    });

    router.get('/spotify/search', function(req, resp) {
      var q = req.query.q;
      var types = (req.query.type || 'artist,album').split(',');
      ensureSpotifyToken().then(function() {
        return spotifyApi.search(q, types);
      }).then(function(data) {
        resp.json(data.body);
      }).catch(function(err) {
        console.log('Spotify search error:', JSON.stringify(err));
        resp.status(err.statusCode || 500).json({ error: err.message, details: err.toString() });
      });
    });

    router.get('/spotify/albums/:id', function(req, resp) {
      ensureSpotifyToken().then(function() {
        return spotifyApi.getAlbum(req.params.id);
      }).then(function(data) {
        resp.json(data.body);
      }).catch(function(err) {
        console.log('Spotify album error:', JSON.stringify(err));
        resp.status(err.statusCode || 500).json({ error: err.message, details: err.toString() });
      });
    });

    router.get('/spotify_client_token', function(req, resp){
      spotifyApi.clientCredentialsGrant()
        .then(function(data) {
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);

          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token']);
          var access_token = spotifyApi.getAccessToken();
          console.log(access_token);
          resp.json(access_token);
        }, function(err) {
              console.log('Something went wrong when retrieving an access token', err);
              resp.status(500).json({ error: 'Failed to retrieve Spotify access token', details: err.message });
        });

      });



    // Giphy comment search
    router.post('/giphysearch', function(req, resp){
      giphy.search({q: req.body.search, limit: '50'}).then(function(res) {
        console.log(res);
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
  // app.use(require("webpack-hot-middleware")(compiler, {
  //   log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  // }));
})();

var port = process.env.PORT || 8000;

app.listen(port, function() {
  console.log("App is running on port " + port);
});

