
app.controller('MainController', ['$scope', '$http', function ($scope, $http) 
{

	function setYelpScopes(data)
	{	
            $scope.all = data;
            $scope.source = data.status;
            
            if(data.status == "both")
            {
                $scope.sourceimg = "both.png";
                $scope.sourcetitle = "MapFusion API";
            }
            else if(data.status == "yelp")
            {
                $scope.sourceimg = "yelp-fusion.png";
                $scope.sourcetitle = "Yelp-Fusion API";
            }
            else if(data.status == "google")
            {
                $scope.sourceimg = "google-places.png";
                $scope.sourcetitle = "GooglePlaces API";
            }
            else  // no data found
            {
                $scope.visible = false;
            }

            $scope.name = data.name; 
            
            if(data.image == "")
                $scope.image = "resturant.jpeg";
            else
                $scope.image = data.image;
            
            if(data.is_closed)
                $scope.isshutdown = "(Closed)";
            else
                $scope.isshutdown = "";

            $scope.rating = data.rating + "/5";

            $scope.phone = data.phone;
            $scope.location = data.location.address;
            $scope.website = data.website;

            if(data.opening_hours)
                $scope.open = data.opening_hours.open_now;
            $scope.hours = data.opening_hours;
            $scope.coordinates = data.coordinates.latitude + "," + data.coordinates.longitude; 
            
            if(data.price == "$")
				$scope.price = "low";
			else if(data.price == "$$")
				$scope.price = "medium";
			else if(data.price == "$$$")
				$scope.price = "high";            
			else if(data.price == "$$$$")
				$scope.price = "very high";

			var cates = "";
            for(i = 0; i < data.categories.length; i++)
                if(i == 0)
                    cates += data.categories[i].title;
                else
                    cates += ", " + data.categories[i].title;
            $scope.categories = cates; 

			// //$scope.distance = yelpData.distance + " miles";
			
			var trans = "";
            for(i = 0; i < data.transactions.length; i++)
                if(i == 0)
                    trans += data.transactions[i];
                else
                    trans += ", " + data.transactions[i];
            $scope.transactions = trans;

    }


    $scope.circle = "circle";
    $scope.rectangle = "rectangle";
    $scope.polygon = "polygon";
    $scope.patterns = ["circle", "rectangle", "polygon"];

    $scope.drawingPattern = "None"
    $scope.setDrawingPattern = function(type){
        switch(type){
            case $scope.circle:
                searchByCircle();
                $scope.drawingPattern = $scope.circle
                break;
            case $scope.rectangle:
                searchByRectangle();
                $scope.drawingPattern = $scope.rectangle
                break;
            case $scope.polygon:
                searchByPolygon();
                $scope.drawingPattern = $scope.polygon
                break;
            default:
                return;
        }
    }


    //circle stuff
    $scope.plus = "+";
    $scope.neary = false;
    $scope.flip = function()
    {
        $scope.neary = !$scope.neary;
        // if($scope.plus == "+")
        // {
        //     $scope.plus = "-";
            
        //     var val = 5;
        //     if (document.getElementsByName("slider").value)
        //         val = document.getElementsByName("slider").value;

        //     multiplier = 1000;
        //     document.getElementById("radBox").value = val;
        //     document.getElementById("slider").value = val;
        //     drawCircle(mycoords[0], mycoords[1], multiplier * val);
        // }
        // else
        // {
        //     $scope.plus = "+";
        //     circle.setMap(null);
        //     document.getElementById("slider").value = 50;
        // }
    }

    $scope.circle = function(r)
    {
        //Google circle API takes the radius in meters (https://developers.google.com/maps/documentation/javascript/shapes#circles)
        //convert user-input from km to m
        multiplier = 1000;
        drawCircle(mycoords[0],mycoords[1], multiplier * parseFloat(r));
    }
    
    $scope.setSliderFromBox = function()
    {
       r=parseFloat(document.getElementsByName("radBox")[0].value);
       document.getElementById("slider").value=r;
       $scope.circle(r);
        
    }

    $scope.setBoxFromSlider = function() {
        r = document.getElementById("slider").value;
        document.getElementById("radBox").value = r
        $scope.circle(r); 
    }

    

    // Pull mongo saved datapoints passes to yelp and marks on map
    $scope.init = function () 
    {

        // hides bottom data panel
        $scope.visible = false;
        $scope.loggedin = false;

        // clear textboxes on refresh
        document.getElementById("term").value = "";
        document.getElementById("location").value = "";

        // pull from HTML5 local storage
        var user = sessionStorage.getItem('username');
        // console.log("USER: " + user);
        if(user)
        {
            $scope.loggedin = true;
            // favorites marker logic in maps.js
        }


        if($scope.loggedin)
            document.getElementById('loginbutton').innerHTML = user;
        else
            document.getElementById('loginbutton').innerHTML = "Login";

    };

    $scope.login = function()
    {
        if($scope.loggedin)
        {
            $scope.loggedin = false;
            document.getElementById('loginbutton').innerHTML = "Login";
            sessionStorage.removeItem('email');  // delete data from local storage
            sessionStorage.removeItem('username');  // delete data from local storage
            sessionStorage.removeItem('favorites');  // delete data from local storage

            // TODO refresh when logout
            location.href = "/";
        }
        else
            location.href = "/login";
    }

    // Sends textbox input to Yelp in Nodejs backend
    $scope.nearby = function (distance) 
    {

        // var range = 1000; //meters
        var price = "\"1, 2, 3\"";

        var multiplier = 1000;
        var range = distance * multiplier; //meters


        // REST URL
        var url = "/places?lat=" + mycoords[0] + 
            "&long=" + mycoords[1] +
            "&range=" + range + 
            "&price=" + price +
            "/";
        var data = new FormData();
        
        // Set the configurations for the uploaded file
        var config =
        {
            transformRequest: angular.identity,
            transformResponse: angular.identity,
            headers: 
            {
                'Content-Type': undefined
            }
        }

        // Sends the file data off
        $http.get(url, data, config).then(
            // Success
            function (response)
            {
                var places = response.data;
                // console.log(places);
                places.forEach(place => {
                    // console.log(place)
                    // console.log(place.vicinity);
                    var newSpot = {
                        name: place.name,
                        lat: place.coordinates.latitude, 
                        lon: place.coordinates.longitude, 
                        loc: place.location.city + ", " + place.location.state
                    };
                    addMarker(newSpot, found);
                });
                // $scope.dta = places;
            }
        );

    };

    // Sends textbox input to Yelp in Nodejs backend
    $scope.yelp = function (term, loc) 
    {

        // both text fields empty
        if(!term || term == "me")
        {
            // hides bottom data panel
            $scope.visible = false;
            return;
        }

        var url = "";
        if(!loc)
            url = "/yelp?term=" + encodeURIComponent(term) + "&lat=" + mycoords[0] + "&long=" + mycoords[1] + "/";
        else
            url = "/yelp?term=" + encodeURIComponent(term) + "&location=" + encodeURIComponent(loc) + "/";

        // REST URL
        var data = new FormData();
        
        // Set the configurations for the uploaded file
        var config =
        {
            transformRequest: angular.identity,
            transformResponse: angular.identity,
            headers: 
            {
                'Content-Type': undefined
            }
        }

        // Sends the file data off
        $http.get(url, data, config).then(
            // Success
            function (response)
            {
                var data = response.data;

                // no yelp data found
                if(!data)
                {
                    // hides bottom data panel
                    $scope.visible = false;
                    return;
                }

                setYelpScopes(data);
                
                $scope.favorite = unstar;

                var newSpot = {
                    name: data.name,
                    lat: data.coordinates.latitude, 
                    lon: data.coordinates.longitude, 
                    loc: data.location.city + " " + data.location.state
                };
                addMarker(newSpot, selected);

                document.getElementById("term").value = data.name;
                document.getElementById("location").value = data.location.city + " " + data.location.state;

                // shows bottom data panel
                $scope.visible = true;

                if(sessionStorage.getItem('email'))
                    $scope.loggedin = true;
                else
                    $scope.loggedin = false;

            }
        );

    };

    // ^ yelp but doesnt place markers (called when marker clicked)
    $scope.zoom = function (markertype) 
    {
        //alert(markertype);
        var term = document.getElementById("term").value;
        var loc = document.getElementById("location").value;

        //console.log(term);
        //console.log(loc);

        // REST URL
        var url = "/yelp?term=\"" + term +"\"&location=\"" + loc + "\"/";
        var data = new FormData();

        // shows bottom data panel
        $scope.visible = true;


        // Set the configurations for the uploaded file
        var config =
        {
            transformRequest: angular.identity,
            transformResponse: angular.identity,
            headers: 
            {
                'Content-Type': undefined
            }
        }

        // Sends the file data off
        $http.get(url, data, config).then(
            // Success
            function (response)
            {
                var yelpData = response.data;

                // no yelp data found
                if(!yelpData)
                {
                    // hides bottom data panel
                    $scope.visible = false;
                    return;
                }

				setYelpScopes(yelpData);
				
				if(markertype == starred)
					$scope.favorite = star;
                else
                {
					$scope.favorite = unstar;

                    var newSpot = {
                        name: yelpData.name,
                        lat: yelpData.coordinates.latitude, 
                        lon: yelpData.coordinates.longitude, 
                        loc: yelpData.location.city + ", " + yelpData.location.state
                    };
                    editMarker(newSpot, selected);
                }
            }
        );

    };

    var star = "goldstar.png";
    var unstar = "unfilledstar.png";

    // Toggles if saved in mongo
    $scope.favor = function () 
    {

        var email = sessionStorage.getItem('email');
        var term = document.getElementById("term").value;
        var loc = document.getElementById("location").value;

        // REST URL
        var url = "/favorite?email=" + email + "&term=\"" + term +"\"&location=\"" + loc + "\"/";
        var data = new FormData();

        // Set the configurations for the uploaded file
        var config =
        {
            transformRequest: angular.identity,
            transformResponse: angular.identity,
            headers: 
            {
                'Content-Type': undefined
            }
        }

        // Sends the file data off
        $http.get(url, data, config).then(
            // Success
            function (response)
            {
                var dataList = response.data;
                var isfavorited = dataList[0];
                var yelpData = dataList[1];
                $scope.ress = isfavorited;
                
                var newSpot = {
                    name: yelpData.name,
                    lat: yelpData.coordinates.latitude, 
                    lon: yelpData.coordinates.longitude, 
                    loc: yelpData.location.city + ", " + yelpData.location.state
                };

                if(isfavorited)
                {
                    // TODO edit session favorites to remove new spot
                    var locs = JSON.parse(sessionStorage.getItem('favorites'));
                    var newdata = {name: yelpData.name, city: yelpData.location.city, state: yelpData.location.state, lat: yelpData.coordinates.latitude, long: yelpData.coordinates.longitude};
                    removeit(newdata, locs);
                    sessionStorage.setItem('favorites', JSON.stringify(locs));
                    // console.log("REM FAVS: " + sessionStorage.getItem('favorites'));

                    editMarker(newSpot, selected);
                    $scope.favorite = unstar;
                }
                else
                {
                    // edit session favorites to include new spot
                    var locs = JSON.parse(sessionStorage.getItem('favorites'));
                    var newdata = {name: yelpData.name, city: yelpData.location.city, state: yelpData.location.state, lat: yelpData.coordinates.latitude, long: yelpData.coordinates.longitude};
                    addit(newdata, locs);
                    sessionStorage.setItem('favorites', JSON.stringify(locs));
                    // console.log("ADD FAVS: " + sessionStorage.getItem('favorites'));


                    editMarker(newSpot, starred);
                    $scope.favorite = star;
                }
            }
        );

    };

}]);
