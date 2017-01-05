// require necessary modules and variables
var express = require('express');
var app = express();
var request = require('request');
var mongo = require('mongodb').MongoClient;
var mongoUrl = process.env.IMAGESEARCH_DB;
var key = process.env.BING_IMAGESEARCH_API_KEY;
var timestamp = require('time-stamp');

// Use the Pug templating language and set the view directory to /views
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// on home page request
app.get('/', function (req, res) {
  res.render('index');
});

// if user requests recent search page
app.get('/recentsearch', function (req, res) {
  // search database for history
  mongo.connect(mongoUrl, function (err, db) {
    if (err) throw err;
    var collection = db.collection('searchStrings');
    collection.find({}, {
      _id: 0
    }).toArray(function (err, data) {
      if (err) throw err;
      res.end(JSON.stringify(data, null, 1));
      db.close();
    });
  });
});

// if user enters a search term
app.get('/:search', function (req, res) {
  // parse the url for the term to search and offset
  var query = req.params.search;
  var offset = req.query.offset;
  // define url and options for querying image API
  var options = {
    url: 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=' + query + '&count=10&offset=' + offset + '&mkt=en-us&safeSearch=Moderate',
    headers: {
      'Ocp-Apim-Subscription-Key': key
    }
  };
  // define function that queries image API
  function callback (error, response, body) {
    // if query is successful
    if (!error && response.statusCode == 200) {
      // create object to be saved in search history
      var searchHistoryObject = {
        term: query,
        date: timestamp('YYYY/MM/DD'),
        time: timestamp('HH:mm:ss')
      };
      // add the result object to the database
      mongo.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        var collection = db.collection('searchStrings');
        collection.insert(searchHistoryObject, function (err, data) {
          if (err) throw err;
          db.close();
        });
      });
      // take the returned information and send the result to the browser
      var info = JSON.parse(body);
      var array = [];
      for (var i = 0, l = info.value.length; i < l; i++) {
        var object = {
          url: info.value[i].contentUrl,
          snippet: info.value[i].name,
          thumbnail: info.value[i].thumbnailUrl,
          context: info.value[i].hostPageUrl
        };
        array.push(object);
      }
      res.end(JSON.stringify(array, null, 1));
    }
  }
  // query image API with options and callback function
  request(options, callback);
});

// listen to port for connections
app.listen(process.env.PORT || 8080, function (request, response) {
  console.log('Listening for connections...');
});
