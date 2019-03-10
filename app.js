
const express = require('express');
const app = express();
const router = express.Router();
const port = 80;


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


//make all resources avaliable on same level
app.use(express.static(__dirname + '/html/'));
app.use(express.static(__dirname + '/js/'));
app.use(express.static(__dirname + '/js/controllers/'));
app.use(express.static(__dirname + '/js/services/'));
app.use(express.static(__dirname + '/js/shared/'));
app.use(express.static(__dirname + '/js/mine/'));
app.use(express.static(__dirname + '/images/'));
app.use(express.static(__dirname + '/css/'));


//add the router
router.get('/',function(request, response)
{
  response.sendFile('index.html');
});
router.get('/about',function(request, response)
{
  response.sendFile('about.html');
});
router.get('/sitemap',function(request, response)
{
  response.sendFile('sitemap.html');
});

//run
app.use('/', router);
app.listen(process.env.port || port);
console.log('Running at Port ' + port);



// ======================================
//   REQUESTS
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
        //wait and then send list off    // MAKE BETTER!!!!!!!!!!!!!!!!!!!!!!!!1
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
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) 
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
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db)
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
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
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
        yelpData = response.jsonBody.businesses[0];
        prettyJson = JSON.stringify(yelpData, null, 4);
    
        //console.log(prettyJson);
        console.log("yelp data pulled");
        callmemaybe();

      }).catch(e => {
        console.log(e);
    });

}


