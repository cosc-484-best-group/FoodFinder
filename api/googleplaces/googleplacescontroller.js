'use strict';

const google_places = require('./googleplaces');

class GooglePlacesController
{
    // Constructor
    constructor(apiKey, verbose=false)
    {
        this.apiKey = apiKey;
        this.verbose = verbose;
        this.places = google_places.client(apiKey, verbose);
    }


    // Finds nearby
    basicSearch(arg)
    {
        var $this = this;
        var args = {
            key: this.apiKey,
            location: arg.location,
            radius: arg.radius,
            rankby: 'distance'
        }
        return new Promise(function(resolve, reject) 
        {
            $this.places.nearby(args).then(response => {
                resolve(response);
                if($this.verbose) console.log(response);
            }).catch(e => {
                reject(e);
                console.log(e);
            });
        });
    }

    // Finds places that match input query
    basicSearch(arg)
    {
        var $this = this;
        var args = {
            input: arg.term + " " + arg.location,
            inputtype: 'textquery',
            fields: 'formatted_address,geometry,icon,id,name,permanently_closed,photos,place_id,plus_code,types,price_level,rating,user_ratings_total'
        }
        return new Promise(function(resolve, reject) 
        {
            $this.places.search(args).then(response => {
                resolve(response);
                if($this.verbose) console.log(response);
            }).catch(e => {
                reject(e);
                console.log(e);
            });
        });
    }

    // Finds places that match phone num
    phoneSearch(arg)
    {
        var $this = this;
        var args = {
            input: arg.phonenumstr,
            inputtype: 'phonenumber',
            fields: 'formatted_address,geometry,icon,id,name,permanently_closed,photos,place_id,plus_code,types,price_level,rating,user_ratings_total'
        }
        return new Promise(function(resolve, reject) 
        {
            $this.places.search(args).then(response => {
                resolve(response);
                if($this.verbose) console.log(response);
            }).catch(e => {
                reject(e);
                console.log(e);
            });
        });
    }

    // Returns details info on top result from input query
    advancedSearch(arg)
    {
        var $this = this;
        var args = {
            input: arg.term + " " + arg.location,
            inputtype: 'textquery',
            fields: 'formatted_address,geometry,icon,id,name,permanently_closed,photos,place_id,plus_code,types,price_level,rating,user_ratings_total'
        }
        return new Promise(function(resolve, reject) 
        {
            $this.places.search(args).then(response => {
                if(response.status == 'ZERO_RESULTS')
                {
                    resolve('ZERO_RESULTS');
                    return;
                }
                $this.places.details(response.candidates[0].place_id).then(response => {
                    resolve(response);
                    if($this.verbose) console.log(response);
                }).catch(e => {
                    reject(e);
                    console.log(e);
                });
            }).catch(e => {
                reject(e);
                console.log(e);
            });
        });
    }

    // Returns details info on top result from input query
    photoSearch(input)
    {
        var $this = this;
        var args = {
            input: input,
            inputtype: 'textquery',
            fields: 'formatted_address,geometry,icon,id,name,permanently_closed,photos,place_id,plus_code,types,price_level,rating,user_ratings_total'
        }
        return new Promise(function(resolve, reject) 
        {
            $this.places.search(args).then(response => {
                $this.places.photos(response.candidates[0].photos).then(response => {
                    resolve(response);
                    if($this.verbose) console.log(response);
                }).catch(e => {
                    reject(e);
                    console.log(e);
                });
            }).catch(e => {
                reject(e);
                console.log(e);
            });
        });
    }
}

const createClient = (apiKey, options) => 
{
    // Creates new Client Object
    return new GooglePlacesController(apiKey, options);
};

module.exports = 
{   
    client: createClient
};