
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
    if(y.address1)
      addressfront += y.address1;
    if(y.address2)
      addressfront += " " + y.address2;
    if(y.address3)
      addressfront += " " + y.address3;
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
        website: g.website,
        image: y.image_url,
        is_closed: y.is_closed,
        opening_hours: g.opening_hours, 
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

      var str = "8600 Lasalle Rd #250C, Towson, MD 21286, USA";
      var str2 = "140 George St, The Rocks NSW 2000, Australia";
      
      var g = googleData.result;

      var loc = g.formatted_address.split(',');
      var country = loc[loc.length - 1].trim();
      var loc2 = loc[loc.length - 2].trim().split(' ');
      var zipcode = loc2[1];
      var state = loc2[0];
      var city = loc[loc.length - 3].trim();


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
        website: g.website,
        image: "",
        is_closed: "",
        opening_hours: g.opening_hours, 
        photos: g.photos, 
        price: g.price_level, 
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