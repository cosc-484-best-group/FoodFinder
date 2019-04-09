
exports.search = function (key, args, cb)
{

  var https = require('https');

  var options = {
    'method': 'GET',
    'hostname': 'api.yelp.com',
    'path': buildURL(args),
    'headers': {
      'Authorization': 'Bearer ' + key
    }
  };

  var url = options.hostname + buildURL(args);
  console.log("URL: " + url);

  var req = https.request(options, function (res) 
  {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      cb(JSON.parse(Buffer.concat(chunks).toString()));
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  req.end();

}

function buildURL(args)
{

  // replace spaces with %20
  var term = args.term.replace(/\s/g, '%20');

  // build url path
  var path = '/v3/businesses/search?';
  path += 'term=' + term;

  if(args.hasOwnProperty('location'))
  {
    location = args.location.replace(/\s/g, '%20');
    path += '&location=' + location;
  }
  
  if(args.hasOwnProperty('latitude'))
  {
    path += '&latitude=' + args.latitude;
    path += '&longitude=' + args.longitude;
  }
  
  if(args.hasOwnProperty('radius'))
  {
    path += '&radius=' + args.radius;
  }

  if(args.hasOwnProperty('categories'))
  {
    categories = args.categories.replace(/\s/g, '%20');
    path += '&categories=' + categories;
  }

  if(args.hasOwnProperty('locale'))
  {
    path += '&locale=' + args.locale;
  }

  if(args.hasOwnProperty('limit'))
  {
    path += '&limit=' + args.limit;
  }

  if(args.hasOwnProperty('offset'))
  {
    path += '&offset=' + args.offset;
  }

  if(args.hasOwnProperty('sort_by'))
  {
    sort_by = args.sort_by.replace(/\s/g, '%20');
    path += '&sort_by=' + args.sort_by;
  }

  if(args.hasOwnProperty('price'))
  {
    price = args.price.replace(/\s/g, '%20');
    path += '&price=' + price;
  }

  if(args.hasOwnProperty('open_now'))
  {
    path += '&open_now=' + args.open_now;
  }

  if(args.hasOwnProperty('open_at'))
  {
    path += '&open_at=' + args.open_at;
  }

  if(args.hasOwnProperty('attributes'))
  {
    attributes = args.attributes.replace(/\s/g, '%20');
    path += '&attributes=' + attributes;
  }

  return path;
  
}