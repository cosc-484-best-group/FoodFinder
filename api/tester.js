

const mfclient = require('./MapFusionClient');
const client = mfclient.client();

var args = {
    term: "Ginos",
    location: "towson, md"
}

client.search(args).then(response => {
    console.log(response);
}).catch(e => {
    console.log(e);
});
