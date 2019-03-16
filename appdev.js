
// Dependencies
const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const router = express.Router();

var mongourl = "mongodb://localhost:27017/";


//add the router
router.get('/',function(request, response)
{
  response.sendFile(path.join(__dirname + '/html/index.html'));
});
router.get('/create',function(request, response)
{
    response.sendFile(path.join(__dirname + '/html/create.html'));
});
router.get('/login',function(request, response)
{
    response.sendFile(path.join(__dirname + '/html/login.html'));
});


//make all resources avaliable on same level
app.use(express.static(__dirname + '/html/'));
app.use(express.static(__dirname + '/js/angularjs/'));
app.use(express.static(__dirname + '/js/angularjs/controllers/'));
app.use(express.static(__dirname + '/js/backstretch/'));
app.use(express.static(__dirname + '/js/cors/'));
app.use(express.static(__dirname + '/js/mine/'));
app.use(express.static(__dirname + '/images/'));
app.use(express.static(__dirname + '/css/'));


app.use('/', router);


// ======================================
//   USER ACCOUNT REQUESTS
// ======================================

app.get('/login', function (request, resp) 
{
    var username = request.query.username;
    var password = request.query.password;

    // logic

    return true;
});

app.get('/create', function (request, resp) 
{
    var email = request.query.email;
    var username = request.query.username;
    var password = request.query.password;

    // logic

    return true;
});



// ======================================
//   GOOGLE PLACES REQUESTS
// ======================================
app.get('/places', function(request, resp)
{
    var lat = request.query.lat;
    var long = request.query.long;
    console.log("Coords: (" + lat + ", " + long + ")");

    var key = 'AIzaSyCQUvuEdmTO1JRZWHILlN2hbWuCJ8PyrN8';
    var outputtype = 'json';
    var location = lat + "," + long;
    var radius = 1000;
    var sensor = false;
    var types = "restaurant";
    var keyword = "fast";

    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/" + outputtype + "?" + 
        "key=" + key + 
        "&location=" + location + 
        "&radius=" + radius + 
        "&sensor=" + sensor + 
        "&types=" + types + 
        "&keyword=" + keyword;
    console.log("URL: " + url);

    https.get(url, function(response) {
        var body = '';
    response.on('data', function(chunk) {
        body += chunk;
    });

    response.on('end', function() {
        var places = JSON.parse(body);
        var locations = places.results;
        // var randLoc = locations[Math.floor(Math.random() * locations.length)];
        // console.log(locations);
        resp.send(locations);
    });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
});



// ======================================
//   GOOGLE PLACE REQUESTS
// ======================================
app.get('/place', function(request, resp)
{
    var term = request.query.term;
    var loc = request.query.location;

    var lat = request.query.lat;
    var long = request.query.long;

    console.log("Coords: (" + lat + ", " + long + ")");


    // required
    var key = 'AIzaSyCQUvuEdmTO1JRZWHILlN2hbWuCJ8PyrN8';
    var input = term;
    var inputtype = "textquery";

    // optional
    var outputtype = 'json';
    var location;
    if(loc)
        location = loc;
    else
        location = lat + "," + long;

    var radius = 1000;
    var sensor = false;
    var types = "restaurant";
    var keyword = "fast";

    https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyCQUvuEdmTO1JRZWHILlN2hbWuCJ8PyrN8&query=%22Ginos%20burgers%22&location=%22towson,%20md%22&radius=1000&sensor=false&types=restaurant&keyword=fast
    // https://maps.googleapis.com/maps/api/place/textsearch/output?parameters
    var url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/" + outputtype + "?" + 
        "key=" + key +
        "&input=\"" + input + 
        "\"&inputtype=" + inputtype
    console.log("URL: " + url);

    https.get(url, function(response) {
        var body = '';
        response.on('data', function(chunk) {
            body += chunk;
    });

    response.on('end', function() {
        var places = JSON.parse(body);
        var loc = places.results;
        resp.send(loc);
    });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
});

// ======================================
//   MAIN REQUESTS
// ======================================

// yelp data for each mongo datapoint on load
app.get('/init', function (request, resp) 
{
    pullmongo(function callback() 
    { 
        yelpDataList = [];
        for (i = 0; i < mongoData.length; i++)
        {
            //console.log(mongoData[i]);
            term = mongoData[i].name;
            loc = mongoData[i].city + ", " + mongoData[i].state;
            yelp(term, loc, function callback2()
            {
                yelpDataList.push(yelpData);
            });
        }
        //wait and then send list off    // MAKE BETTER!!!!!!!!!!!!!!!!!!!!!!!!
        proxy(1200, function callback3()
        {
            //console.log(yelpDataList);
            resp.send(yelpDataList);
        });
    });
});


// sends off yelp data on params passed in
app.get('/yelp', function (request, resp) 
{
  var term = request.query.term;
  var location = request.query.location;
  yelp(term, location, function callback() 
  {
        resp.send(yelpData);
  });
});


// GET method route pushes to mongo
app.get('/favorite', function (request, resp) 
{
  var term = request.query.term;
  var location = request.query.location;
  yelp(term, location, function callback() 
  { 
      pullmongo(function callback2()
      {
          // make sure not in there
          var alreadySaved = false;
          for (i = 0; i < mongoData.length; i++)
          {
              if(mongoData[i].name == yelpData.name && 
                 mongoData[i].city == yelpData.location.city &&
                 mongoData[i].state == yelpData.location.state)
              {
                  console.log("already saved");
                  alreadySaved = true;
              }
          }
          if(!alreadySaved) // favorite
          {
              pushmongo({"name": yelpData.name, "city": yelpData.location.city, "state": yelpData.location.state});
          }
          else // unfavorite
          {
              removemongo({"name": yelpData.name, "city": yelpData.location.city, "state": yelpData.location.state});
          }
          resp.send([alreadySaved, yelpData]);
      });
  });
});



function proxy(time, cb)
{
    setTimeout(cb, time);
}

// ======================================
//   MONGO
// ======================================
function pushmongo(json)
{
    var database = "foodfinder";
    var collection = "stars";
    MongoClient.connect(mongourl, { useNewUrlParser: true }, function(err, db) 
    {
        if (err) 
            throw err;
        var dbo = db.db(database);
        dbo.collection(collection).insertOne(json, function(err, res) 
        {
            if (err) 
                throw err;
            console.log("mongo data pushed");
            db.close();
        });
    });
}

function pullmongo(callback)
{
    var database = "foodfinder";
    var collection = "stars";
    MongoClient.connect(mongourl, { useNewUrlParser: true }, function(err, db)
    {
        if (err) 
            throw err;
        var dbo = db.db(database);
        dbo.collection(collection).find({}).toArray(function(err, res)
        {
            if (err) 
                throw err;
            mongoData = res;
            console.log("mongo data pulled");
            db.close();
            callback();
        });
    });
}

function removemongo(json)
{
    var database = "foodfinder";
    var collection = "stars";
    MongoClient.connect(mongourl, { useNewUrlParser: true }, function(err, db) {
        if (err) 
            throw err;
        var dbo = db.db(database);
        dbo.collection(collection).deleteOne(json, function(err, obj) 
        {
            if (err) 
                throw err;
            console.log("1 document deleted");
            db.close();
        });
    });
} 


// ======================================
//   YELP API
// ======================================
function yelp(term, loc, callmemaybe)
{
    const yelp = require('yelp-fusion');

    // from https://www.yelp.com/developers/v3/manage_app
    const apiKey = '4dIx9HKv-klKh_nvUWaHAZqe_a-wQqi49uoJICQIfxdWFj0VS-8uw1TfrFoe2CVsKJeX7BRv0nntSA4svU-G_qiSkfHxYIfk_D83YWoAjRMfuz21UMnzT5_PPA53XHYx';

    const searchRequest = 
    {
        term: term, //'Four Barrel Coffee',
        location:  loc //'san francisco, ca'
    };

    var client = yelp.client(apiKey);
    client.search(searchRequest).then(response => {
        yelpArray = response.jsonBody.businesses;
        // console.log()
        yelpData = yelpArray[0];
        prettyJson = JSON.stringify(yelpData, null, 4);
    
        //console.log(prettyJson);
        console.log("yelp data pulled");
        callmemaybe();

      }).catch(e => {
        console.log("yelp data not found");
    });

}

// ======================================
//   Starting both http & https servers
// ======================================
const httpServer = http.createServer(app);

httpServer.listen(80, () => {
 	console.log('HTTP Server running on port 80');
});