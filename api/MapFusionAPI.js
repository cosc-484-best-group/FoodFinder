
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


// RETURNS GOOGLE RESULTS
router.get('/mapfusion', function (req, res) 
{
    both(req.body, res);
});


function both(args, res)
{
    gplaces(args, res).then(googleData => {
      yelpfusion(args, res).then(yelpData => {
        res.status(200).send(bestofall(googleData, yelpData));
      }).catch(e => {
        console.log(e);
      });
    }).catch(e => {
      console.log(e);
    });
}

function bestofall(googleData, yelpData)
{
  var json;  
  if(googleData == "ZERO_RESULTS" && !yelpData[0])
  {
    return {
      status: "none"
    };
  }
  else if(googleData == "ZERO_RESULTS" && yelpData[0])
  {
    var y = yelpData[0];
    json = {
      status: "yelp",
      name: y.name, 
      latitude: y.coordinates.latitude,
      longitude: y.coordinates.longitude,
      address: y.location.display_address,
      phone: y.display_phone, 
      image: y.image_url,
      is_closed: y.is_closed,
      price: y.price,
      rating: y.rating,
      categories: y.categories,
      transactions: y.transactions,
    };
  }
  else
  {
    // if yelp data and match
    if(yelpData[0] && googleData.result.formatted_address.startsWith(yelpData[0].location.display_address[0]))
    {
      var g = googleData.result;
      var y = yelpData[0];
      json = {
        status: "both",
        name: g.name, 
        latitude: y.coordinates.latitude,
        longitude: y.coordinates.longitude,
        address: g.formatted_address, 
        phone: g.formatted_phone_number, 
        website: g.website,
        image: y.image_url,
        is_closed: y.is_closed,
        opening_hours: g.opening_hours, 
        photos: g.photos, 
        google_place_id: g.place_id, 
        google_price: g.price_level, 
        yelp_price: y.price,
        google_rating: g.rating, 
        yelp_rating: y.rating,
        google_reviews: g.reviews,
        categories: y.categories,
        transactions: y.transactions,
      };
    }
    else // if not yelp data or does not match
    {
      var g = googleData.result;
      json = {
        status: "google",
        name: g.name, 
        latitude: g.geometry.location.lat,
        longitude: g.geometry.location.lng,
        address: g.formatted_address, 
        phone: g.formatted_phone_number, 
        website: g.website,
        opening_hours: g.opening_hours, 
        photos: g.photos, 
        google_place_id: g.place_id, 
        google_price: g.price_level, 
        google_rating: g.rating, 
        google_reviews: g.reviews,
      };
    }
  }
  return json;
}


const google_places = require('./googleplaces/googleplacescontroller');

// ======================================
//   GOOGLE PLACES API
// ======================================
function gplaces(args, res)
{
  return new Promise(function(resolve, reject) 
  {

    var google_api_key = args.google_api_key;
    if(!google_api_key)
    {
      resolve("Error: Google API key not passed");
      return;
    }
    const places = google_places.client(google_api_key);

    places.advancedSearch(args).then(response => {
        console.log("google data pulled");        
        resolve(response);
    }).catch(e => {
        console.log(e);
        reject(e);
    });
  });
}


const yelp_fusion = require('yelp-fusion');

// ======================================
//   YELP API
// ======================================
function yelpfusion(args, res)
{
  return new Promise(function(resolve, reject) 
  {

    var yelp_api_key = args.yelp_api_key;
    if(!yelp_api_key)
    {
      resolve("Error: Yelp API key not passed");
      return;
    }
    const yelper = yelp_fusion.client(args.yelp_api_key);

    yelper.search(args).then(response => {
        console.log("yelp data pulled");        
        const yelpData = response.jsonBody.businesses;
        resolve(yelpData);
      }).catch(e => {
        console.log(e);
        reject(e);
      });
  });
}

module.exports = router;