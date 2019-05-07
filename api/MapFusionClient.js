'use strict';

const request = require('request');

class MapFusionClient 
{
    // Constructor
    constructor(google_api_key, yelp_api_key, verbose=false)
    {
        this.google_key = google_api_key;
        this.yelp_key = yelp_api_key;
        this.verbose = verbose;
    }
    
    // Finds a places basic info
    search(parameters, resp)
    {

        // Place parameters into the URL
        var url = 'https://foodfinder.xyz/api/mapfusion/search';

        // append api keys to args
        parameters['google_api_key'] = this.google_key;
        parameters['yelp_api_key'] = this.yelp_key;

        // Return a promise with the search id
        return new Promise(function(resolve, reject) 
        {
            request(url, { json: true, body: parameters }, (error, response, body) => 
            {
                if (error) 
                    return reject("Unreachable URL"); 
                
                if(body.status == "INVALID_REQUEST")
                    return reject(body);

                resolve(body, resp);

            });
        });
    }

    // Finds a places basic info
    nearby(parameters, resp)
    {

        // Place parameters into the URL
        var url = 'https://foodfinder.xyz/api/mapfusion/nearby-yelp';

        // append api keys to args
        parameters['google_api_key'] = this.google_key;
        parameters['yelp_api_key'] = this.yelp_key;

        // Return a promise with the search id
        return new Promise(function(resolve, reject) 
        {
            request(url, { json: true, body: parameters }, (error, response, body) => 
            {
                if (error) 
                    return reject("Unreachable URL"); 
                
                if(body.status == "INVALID_REQUEST")
                    return reject(body);

                resolve(body, resp);

            });
        });
    }
    
}

const createClient = (googleapikey, yelpapikey, args) => 
{
    return new MapFusionClient(googleapikey, yelpapikey, args);
};

module.exports = 
{   
    client: createClient
};