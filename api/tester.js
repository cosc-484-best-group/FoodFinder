
const GOOGLE_API_KEY = "AIzaSyCQUvuEdmTO1JRZWHILlN2hbWuCJ8PyrN8";
const YELP_API_KEY = "4dIx9HKv-klKh_nvUWaHAZqe_a-wQqi49uoJICQIfxdWFj0VS-8uw1TfrFoe2CVsKJeX7BRv0nntSA4svU-G_qiSkfHxYIfk_D83YWoAjRMfuz21UMnzT5_PPA53XHYx";

const mapfusion = require('./MapFusionClient');
const client = mapfusion.client(GOOGLE_API_KEY, YELP_API_KEY);


var args = {
    term: "Ginos",
    location: "towson, md"
}

client.search(args).then(response => {
    // console.log(response);
}).catch(e => {
    console.log(e);
});
