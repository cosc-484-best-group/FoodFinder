'use strict';

const request = require('request');

class GooglePlacesClient 
{
    // Constructor
    constructor(apiKey, verbose=false)
    {
        this.apiKey = apiKey;
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

    // GOOGLE PLACES API

    // Finds a places basic info
    search(parameters, resp)
    {

        // Place parameters into the URL
        var url = this._formURL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?', parameters);
        if(this.verbose) console.log("URL: " + url);

        // Return a promise with the search id
        return new Promise(function(resolve, reject) 
        {
            request(url, { json: true }, (error, response, body) => 
            {
                if (error) 
                    return reject("Unreachable URL"); 
                
                if(body.status == "INVALID_REQUEST")
                    return reject(body);

                resolve(body, resp);

            });
        });
    }

    // Finds nearby places
    nearby(parameters, resp)
    {

        // Place parameters into the URL
        var url = this._formURL('https://maps.googleapis.com/maps/api/place/nearbysearch/json?', parameters);
        if(this.verbose) console.log("URL: " + url);

        // Return a promise with the search id
        return new Promise(function(resolve, reject) 
        {
            request(url, { json: true }, (error, response, body) => 
            {
                if (error) 
                    return reject("Unreachable URL"); 
                
                if(body.status == "INVALID_REQUEST")
                    return reject(body);

                resolve(body, resp);

            });
        });
    }

    // Finds a places details
    details(place_id, resp)
    {

        // Build Details URL
        var url = 'https://maps.googleapis.com/maps/api/place/details/json?';
        url += '&placeid=' + place_id;
        url += '&fields=address_component,adr_address,alt_id,formatted_address,geometry,icon,id,name,permanently_closed,photo,place_id,plus_code,scope,type,url,utc_offset,vicinity'
        url += ',formatted_phone_number,international_phone_number,opening_hours,website';
        url += ',price_level,rating,review,user_ratings_total';
        url += '&key=' + this.apiKey;
        if(this.verbose) console.log("URL: " + url);

        // Return a promise with the place details
        return new Promise(function(resolve, reject) 
        {
            request(url, { json: true }, (error, response, body) => 
            {
                if (error) 
                    return reject("Unreachable URL"); 
                
                if(body.status == "INVALID_REQUEST")
                    return reject(body);

                resolve(body);

            });
        });
    }

    // Finds photos of a place
    photos(photo_ids)
    {
        //https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=&key=YOUR_API_KEY
        // Build Photo URL
        var url = 'https://maps.googleapis.com/maps/api/place/photo?';
        url += '&photoreference=' + photo_ids[0].photo_reference;
        url += '&maxwidth=' + 500;
        url += '&key=' + this.apiKey;
        if(this.verbose) console.log("URL: " + url);

        // Return a promise with the place photo
        return new Promise(function(resolve, reject) 
        {
            request(url, { json: true }, (error, response, body) => 
            {
                if (error) 
                    return reject("Unreachable URL"); 
                
                if(body.status == "INVALID_REQUEST")
                    return reject(body);

                resolve(body);

            });
        });
    }
    
}

const createClient = (apiKey, options) => 
{
    // Creates new Client Object
    return new GooglePlacesClient(apiKey, options);
};

module.exports = 
{   
    client: createClient
};