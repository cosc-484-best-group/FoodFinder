
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


// RETURNS MAPFUSION RESULTS
router.get('/mapfusion/search', function (req, res) 
{
    bothSearch(req.body, res);
});

// RETURNS MAPFUSION RESULTS
router.get('/mapfusion/nearby', function (req, res) 
{
    bothNearby(req.body, res);
});

// RETURNS GOOGLE RESULTS
router.get('/googleplaces', function (req, res) 
{
    gplace(req.body, res);
});

// RETURNS YELP RESULTS
router.get('/yelpfusion', function (req, res) 
{
    yelpfusion(req.body, res);
});


function bothSearch(args, res)
{
    gplace(send=false, args, res).then(googleData => {
      yelpfusion(send=false, args, res).then(yelpData => {
        res.status(200).send(bestofall(googleData, yelpData));
      }).catch(e => {
        console.log(e);
        res.status(500).send(e); 
      });
    }).catch(e => {
      console.log(e);
      res.status(500).send(e);
    });
}

function bothNearby(args, res)
{
  
  
    gplaces(send=false, args, res).then(yelpData => {
      res.status(200).send(yelpData);
    }).catch(e => {
      console.log(e);
      res.status(500).send(e); 
    });

}

function bestofall(googleData, yelpData)
{
  var json;  
  if(googleData == "ZERO_RESULTS" && !yelpData[0])
  {
    return {
      status: "none",
      name: "", 
      location:
      {
        city: "",
        state: "",
        zipcode: "",
        country: "",
        address: ""
      },
      coordinates:
      {
        latitude: "",
        longitude: ""
      },
      phone: "", 
      website: "",
      image: "",
      is_closed:"",
      opening_hours: "", 
      photos: "", 
      price: "",
      rating: "",
      reviews: "",
      categories: "",
      transactions: ""
    };
  }
  else if(googleData == "ZERO_RESULTS" && yelpData[0])
  {
    var y = yelpData[0];
    
    var addressfront = "";
    if(y.location.address1)
      addressfront += y.location.address1;
    if(y.location.address2)
      addressfront += " " + y.location.address2;
    if(y.location.address3)
      addressfront += " " + y.location.address3;
    if(addressfront)
      addressfront += ", ";

    json = {
      status: "yelp",
      name: y.name, 
      location:
      {
        city: y.location.city,
        state: y.location.state,
        zipcode: y.location.zip_code,
        country: y.location.country,
        address: addressfront + y.location.city + ", " + y.location.state + " " + y.location.zip_code + ", " + y.location.country
      },
      coordinates:
      {
        latitude: y.coordinates.latitude,
        longitude: y.coordinates.longitude
      },
      phone: y.display_phone, 
      website: "",
      image: y.image_url,
      is_closed: y.is_closed,
      opening_hours: "", 
      photos: "", 
      price: y.price,
      rating: y.rating,
      reviews: "",
      categories: y.categories,
      transactions: y.transactions
    };
  }
  else
  {
    // if yelp data and match
    if(yelpData[0] && googleData.result.formatted_address.startsWith(yelpData[0].location.display_address[0]))
    {
      var g = googleData.result;
      var y = yelpData[0];

      var opening_hours = "";
      if(g.opening_hours)
        opening_hours = g.opening_hours;
      var website = "";
      if(g.website)
        website = g.website;

      json = {
        status: "both",
        name: g.name, 
        location:
        {
          city: y.location.city,
          state: y.location.state,
          zipcode: y.location.zip_code,
          country: y.location.country,
          address: g.formatted_address
        },
        coordinates:
        {
          latitude: y.coordinates.latitude,
          longitude: y.coordinates.longitude
        },
        phone: g.formatted_phone_number, 
        website: website,
        image: y.image_url,
        is_closed: y.is_closed,
        opening_hours: opening_hours, 
        photos: g.photos, 
        price: y.price,
        rating: ((parseFloat(g.rating) + parseFloat(y.rating)) / 2.0), 
        reviews: g.reviews,
        categories: y.categories,
        transactions: y.transactions
      };
    }
    else // if not yelp data or does not match
    {

      var g = googleData.result;
      var loc = g.formatted_address.split(',');
      var country = loc[loc.length - 1].trim();
      var loc2 = loc[loc.length - 2].trim().split(' ');
      var zipcode = loc2[1];
      var state = loc2[0];
      var city = loc[loc.length - 3].trim();

      var opening_hours = "";
      if(g.opening_hours)
        opening_hours = g.opening_hours;
      var website = "";
      if(g.website)
        website = g.website;
      var price = ""
      if(g.price_level)
        price = g.price_level;

      json = {
        status: "google",
        name: g.name, 
        location:
        {
          city: city,
          state: state,
          zipcode: zipcode,
          country: country,
          address: g.formatted_address
        },
        coordinates:
        {
          latitude: g.geometry.location.lat,
          longitude: g.geometry.location.lng
        },
        phone: g.formatted_phone_number, 
        website: website,
        image: "",
        is_closed: "",
        opening_hours: opening_hours, 
        photos: g.photos, 
        price: price, 
        rating: g.rating, 
        reviews: g.reviews,
        categories: "",
        transactions: ""
      };
    }
  }
  return json;
}


const google_places = require('./googleplaces/googleplacescontroller');

// ======================================
//   GOOGLE PLACES API
// ======================================
function gplace(send=true, args, res)
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
        if(send)  res.status(200).send(response);
    }).catch(e => {
        console.log(e);
        reject(e);
        if(send)  res.status(500).send(e);
    });
  });
}

function gplaces(send=true, args, res)
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

    places.nearby(args).then(response => {
        console.log("google data pulled");        
        resolve(response);
        if(send)  res.status(200).send(response);
    }).catch(e => {
        console.log(e);
        reject(e);
        if(send)  res.status(500).send(e);
    });
  });
}


const yelp_fusion = require('yelp-fusion');

// ======================================
//   YELP API
// ======================================
function yelpfusion(send=true, args, res)
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
        if(send)  res.status(200).send(yelpData);
      }).catch(e => {
        console.log(e);
        reject(e);
        if(send)  res.status(500).send(e);
      });
  });
}

module.exports = router;