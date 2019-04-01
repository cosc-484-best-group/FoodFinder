
// ======================================
//   DEPENDENCIES
// ======================================
const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const router = express.Router();
var mongourl = "mongodb://localhost:27017/";

// from https://www.yelp.com/developers/v3/manage_app
const YELP_API_KEY = "4dIx9HKv-klKh_nvUWaHAZqe_a-wQqi49uoJICQIfxdWFj0VS-8uw1TfrFoe2CVsKJeX7BRv0nntSA4svU-G_qiSkfHxYIfk_D83YWoAjRMfuz21UMnzT5_PPA53XHYx";
const yelper = require('yelp-fusion');


const SERVER_MODE = "server"; // run with https on server
const DEBUG_MODE = "debug"; // run locally
var mode = SERVER_MODE;

var input = process.argv[2]; // set as argument passed
if(input) //nonempty
    mode = input;
if(mode == "app" || mode == "app.js") //passed with prior parameter
    mode = SERVER_MODE;

if(mode == SERVER_MODE)
    console.log("SERVER MODE");
if(mode == DEBUG_MODE)
    console.log("DEBUG MODE");


// ======================================
//   ROUTING
// ======================================
router.get('/',function(request, response)
{
  response.sendFile(path.join(__dirname + '/html/index.html'));
});
router.get('/about',function(request, response)
{
    response.sendFile(path.join(__dirname + '/html/about.html'));
});
router.get('/create',function(request, response)
{
    response.sendFile(path.join(__dirname + '/html/create.html'));
});
router.get('/login',function(request, response)
{
    response.sendFile(path.join(__dirname + '/html/login.html'));
});
router.get('/news',function(request, response)
{
    response.sendFile(path.join(__dirname + '/html/news.html'));
});
router.get('/contact',function(request, response)
{
    response.sendFile(path.join(__dirname + '/html/contact.html'));
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
//   USER ACCOUNTS URL REQUESTS
// ======================================

app.get('/loginaccount', function (request, resp)
{
    var email = request.query.email;
    var password = request.query.password;

    var username = "";
    var locs = [];

    // cut off quotes
    email = email.substring(1, email.length - 1);
    password = password.substring(1, password.length - 1);

    // pull account where email = account.email
    pullaccount(email, function ()
    {

        // and password == account.password
        cryptPassword(password, function(error, hash)
        {
            comparePassword(password, account.password, function(error, isPasswordMatch)
            {
                if(isPasswordMatch)
                    resp.send({valid: true, email: email, username: username, favorites: locs});
                else
                    resp.send({valid: false, email: email, username: username, favorites: locs});
            });
        });

        // remember username and loc
        username = account.username;
        locs = account.favorites;

    });

});

app.get('/createaccount', function (request, resp)
{
    var email = request.query.email;
    var username = request.query.username;
    var password = request.query.password;

    // cut off quotes
    email = email.substring(1, email.length - 1);
    username = username.substring(1, username.length - 1);
    password = password.substring(1, password.length - 1);

    // encryption
    cryptPassword(password, function(error, hash)
    {
        pushaccount({email: email, username: username, password: hash, favorites: []});
        resp.send(true);  // catch if bad!!!
    });

});


// ======================================
//   MAIN URL REQUESTS
// ======================================
// goose
// db.data.insert({email: "stillwell006@gmail.com", username: "matt", password: "$2a$10$HI1L0S/AaQiKd0TNPBZHQeRBMzE1k9idceKkN6Q9LTuDGv91nN4X.", favorites: [{name: "Gino's Burgers & Chicken", city: "Towson", state: "MD", lat: 39.3958819737623, long: -76.5775761064767}] })


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

// sends off yelp data on params passed in
app.get('/places', function (request, resp)
{
    var lat = request.query.lat;
    var long = request.query.long;
    var range = request.query.range;
  yelps(lat, long, range, function callback()
  {
        resp.send(yelpArray);
  });
});


// GET method route pushes to mongo
app.get('/favorite', function (request, resp)
{
  var email = request.query.email;
  var term = request.query.term;
  var location = request.query.location;
  yelp(term, location, function callback()
  {
      pullfavorites(email, function callback2(favorites)
      {
          // make sure not in there
          var alreadySaved = false;
          for (i = 0; i < favorites.length; i++)
          {
              var fav = favorites[i];
              console.log(fav);
              if(fav.name == yelpData.name &&
                 fav.city == yelpData.location.city &&
                 fav.state == yelpData.location.state)
              {
                  console.log("already saved");
                  alreadySaved = true;
              }
          }
          if(!alreadySaved) // favorite
          {
              pushfavorite(email, {"name": yelpData.name, "city": yelpData.location.city, "state": yelpData.location.state, "lat": yelpData.coordinates.latitude, "long": yelpData.coordinates.longitude});
          }
          else // unfavorite
          {
              removefavorite(email, {"name": yelpData.name, "city": yelpData.location.city, "state": yelpData.location.state, "lat": yelpData.coordinates.latitude, "long": yelpData.coordinates.longitude});
          }
          resp.send([alreadySaved, yelpData]);
      });
  });
});


// db.data.insert({email: "stillwell006@gmail.com", username: "matt", password: "goose", favorites: [{name: "Ginos", city: "Towson", state: "MD", lat: 20, long: 30}, {name: "Nandos", city: "Towson", state: "MD", lat: 40, long: 30}] })
// ***********************************
//  foodfinder
//  data
//  {
//    * email:      STRING
//      username:   STRING
//      password:   STRING
//
//      favorites:  ARRAY
//      [
//         * name:   STRING
//         * city:   STRING
//         * state   STRING
//         * lat:    FLOAT
//         * long:   FLOAT
//      ]
//  }
// ***********************************

// ======================================
//   MONGO USER ACCOUNTS
// ======================================
function pushaccount(json)
{
    var database = "foodfinder";
    var collection = "data";
    MongoClient.connect(mongourl, { useNewUrlParser: true }, function(err, db)
    {
        if (err)
            throw err;
        var dbo = db.db(database);
        dbo.collection(collection).insertOne(json, function(err, res)
        {
            if (err)
                throw err;
            console.log("mongo account pushed");
            db.close();
        });
    });
}

function pullaccount(email, callback)
{
    var database = "foodfinder";
    var collection = "data";
    MongoClient.connect(mongourl, { useNewUrlParser: true }, function(err, db)
    {
        if (err)
            throw err;
        var dbo = db.db(database);
        dbo.collection(collection).find({ email: email }).toArray(function(err, resp)
        {
            if (err)
                throw err;
            account = resp[0];
            console.log("mongo account pulled");
            db.close();
            callback();
        });
    });
}


// ======================================
//   MONGO FAVORITES
// ======================================
function pullfavorites(email, callback)
{
    pullaccount(email, function()
    {
        callback(account.favorites);
    });
}

function pushfavorite(email, json)
{

    pullfavorites(email, function()
    {
        var currentfavs = account.favorites;
        currentfavs.push(json);

        console.log("New favs: " + currentfavs);

    });

    // var database = "foodfinder";
    // var collection = "stars";
    // MongoClient.connect(mongourl, { useNewUrlParser: true }, function(err, db)
    // {
    //     if (err)
    //         throw err;
    //     var dbo = db.db(database);
    //     dbo.collection(collection).insertOne(json, function(err, res)
    //     {
    //         if (err)
    //             throw err;
    //         console.log("mongo data pushed");
    //         db.close();
    //     });
    // });
}

function removefavorite(email, json)
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

    const searchRequest =
    {
        term: term, //'Four Barrel Coffee',
        location:  loc //'san francisco, ca'
    };

    var client = yelper.client(YELP_API_KEY);
    client.search(searchRequest).then(response => {
        yelpData = response.jsonBody.businesses[0];
        prettyJson = JSON.stringify(yelpData, null, 4);

        //console.log(prettyJson);
        console.log("yelp data pulled");
        callmemaybe();

      }).catch(e => {
        console.log(e);
    });

}

// ======================================
//   YELP PLACES NEARBY API
// ======================================
function yelps(lat, long, range, callmemaybe)
{

    const searchRequest =
    {
        term: 'food',
        latitude: lat,
        longitude: long,
        // radius: range   // meters
    };

    var client = yelper.client(YELP_API_KEY);
    client.search(searchRequest).then(response => {
        yelpArray = response.jsonBody.businesses;
        // yelpData = yelpArray[0];
        // prettyJson = JSON.stringify(yelpData, null, 4);

        //console.log(prettyJson);
        console.log("yelp data pulled");
        callmemaybe();

      }).catch(e => {
        console.log("yelp data not found");
    });

}


// ======================================
//   ENCRYPTION
// ======================================

var bcrypt = require('bcrypt-nodejs');

var cryptPassword = function(password, callback)
{
    bcrypt.genSalt(10, function(err, salt)
    {
        if (err)
            return callback(err);

        bcrypt.hash(password, salt, null, function(err, hash)
        {
            return callback(err, hash);
        });
    });
};

var comparePassword = function(plainPass, hashword, callback)
{
   bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch)
   {
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
};


// ======================================
//   HTTPS Certificate
// ======================================
if(mode == SERVER_MODE) // use https on server
{
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/foodfinder.xyz/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/foodfinder.xyz/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/foodfinder.xyz/chain.pem', 'utf8');

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };


    // ======================================
    //   Starting https server
    // ======================================
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, () => {
 	    console.log('HTTPS Server running on port 443');
    });
}

// ======================================
//   Starting http server
// ======================================
// else test locally without https
const httpServer = http.createServer(app);
httpServer.listen(80, () => {
 	console.log('HTTP Server running on port 80');
});
