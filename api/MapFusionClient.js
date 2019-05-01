'use strict';

const request = require('request');

class MapFusionClient 
{
    // Constructor
    constructor(verbose=false)
    {
        // this.google_key = google_api_key;
        // this.yelp_api_key = yelp_api_key;
        this.verbose = verbose;
    }

    // Builds URL from parameters
    _formURL(baseURL, parameters)
    {
        var url = baseURL;
        if(parameters.inputtype != "phonenumber")
            url += Object.keys(parameters).map(function(k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(parameters[k]);
            }).join('&');
        else  // encoding phone number URL breaks the URL
            url += Object.keys(parameters).map(function(k) {
                return encodeURIComponent(k) + '=' + parameters[k];
            }).join('&');
        url += '&key=' + this.apiKey;
        return url;
    }

    // Finds a places basic info
    search(parameters, resp)
    {

        // Place parameters into the URL
        var url = 'https://foodfinder.xyz/api/mapfusion';
        console.log(parameters);


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

const createClient = (options) => 
{
    return new MapFusionClient(options);
};

module.exports = 
{   
    client: createClient
};