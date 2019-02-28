
const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;


//make all resources avaliable on same level
app.use(express.static(__dirname + '/html/'));
app.use(express.static(__dirname + '/js/'));
app.use(express.static(__dirname + '/images/'));
app.use(express.static(__dirname + '/css/'));


//add the router
router.get('/',function(req,res)
{
  res.sendFile('index.html');
});
router.get('/about',function(req,res)
{
  res.sendFile('about.html');
});
router.get('/sitemap',function(req,res)
{
  res.sendFile('sitemap.html');
});


app.use('/', router);
app.listen(process.env.port || port);

console.log('Running at Port ' + port);



// ======================================
// YELP API
// ======================================
const yelp = require('yelp-fusion');

// from https://www.yelp.com/developers/v3/manage_app
const apiKey = '4dIx9HKv-klKh_nvUWaHAZqe_a-wQqi49uoJICQIfxdWFj0VS-8uw1TfrFoe2CVsKJeX7BRv0nntSA4svU-G_qiSkfHxYIfk_D83YWoAjRMfuz21UMnzT5_PPA53XHYx';

const searchRequest = {
  term:'Four Barrel Coffee',
  location: 'san francisco, ca'
};

var prettyJson = {};
var client = yelp.client(apiKey);
client.search(searchRequest).then(response => {
  const firstResult = response.jsonBody.businesses[0];
  prettyJson = JSON.stringify(firstResult, null, 4);
  console.log(prettyJson);
}).catch(e => {
  console.log(e);
});
