
app.controller('MainController', ['$scope', '$http', function ($scope, $http) 
{

	function setYelpScopes(yelpData)
	{	
            $scope.all = yelpData;
            $scope.name = yelpData.name;
            $scope.image = yelpData.image_url;

            if(yelpData.is_closed)
                $scope.isshutdown = "(Closed)";
            else
                $scope.isshutdown = "";

            $scope.rating = yelpData.rating + "/5";
            $scope.price = yelpData.price;
            $scope.phone = yelpData.display_phone;
            $scope.location = yelpData.location.city + ", " + yelpData.location.state;
            $scope.coordinates = yelpData.coordinates; 
			if(yelpData.price == "$")
				$scope.price = "low";
			else if(yelpData.price == "$$")
				$scope.price = "medium";
			else if(yelpData.price == "$$$")
				$scope.price = "high";            
			else if(yelpData.price == "$$$$")
				$scope.price = "very high";

			var cates = "";
            for(i = 0; i < yelpData.categories.length; i++)
                if(i == 0)
                    cates += yelpData.categories[i].title;
                else
                    cates += ", " + yelpData.categories[i].title;
            $scope.categories = cates;

            var resloc = yelpData.location.address1;
            if(yelpData.location.address2)
                resloc += " " + yelpData.location.address2;
            if(yelpData.location.address3)
                resloc += " " + yelpData.location.address3;
            resloc += " " + yelpData.location.city + ", " + yelpData.location.state;
            resloc += " " + yelpData.location.country + " " + yelpData.location.zip_code;
            
            $scope.resloc = resloc;
			//$scope.distance = yelpData.distance + " miles";
			
			var trans = "";
            for(i = 0; i < yelpData.transactions.length; i++)
                if(i == 0)
                    trans += yelpData.transactions[i];
                else
                    trans += ", " + yelpData.transactions[i];
            $scope.transactions = trans;

    }

    //circle stuff
    $scope.plus = "+";
    $scope.neary = false;
    $scope.flip = function()
    {
        $scope.neary = !$scope.neary;
        if($scope.plus == "+")
            $scope.plus = "-";
        else
        {
            $scope.plus = "+";
            circle.setMap(null);
            document.getElementById("slider").value = 50;
        }
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
        document.getElementsByName("radBox")[0].value = r
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
        if(user)
        {
            $scope.loggedin = true;
            var locs = JSON.parse(sessionStorage.getItem('favorites'));
            // console.log(locs);
            for(i = 0; i < locs.length; i++)
            {
                var loc = locs[i];
                // console.log(loc);
                var newSpot = {
                    name: loc.name,
                    lat: loc.lat, 
                    lon: loc.long, 
                    loc: loc.city + ", " + loc.state
                };
                addMarker(newSpot, starred);
            }

            // // REST URL
            // var url = "/init?locations=" + locs;
            // var data = new FormData();

            // // Set the configurations for the uploaded file
            // var config =
            // {
            //     transformRequest: angular.identity,
            //     transformResponse: angular.identity,
            //     headers: 
            //     {
            //         'Content-Type': undefined
            //     }
            // }

            // // Sends the file data off
            // $http.get(url, data, config).then(
            //     // Success
            //     function (response)
            //     {
            //         // yelp data for each mongo rid
            //         var yelpDataList = response.data;
            //         for(i = 0; i < yelpDataList.length; i++)
            //         {
            //             yelpData = yelpDataList[i];
            //             var newSpot = {
            //                 name: yelpData.name,
            //                 lat: yelpData.coordinates.latitude, 
            //                 lon: yelpData.coordinates.longitude, 
            //                 loc: yelpData.location.city + ", " + yelpData.location.state
            //             };
            //             addMarker(newSpot, starred);
            //         }
            //     }
            // );
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
    $scope.nearby = function () 
    {

        
        // var range = 1000; //meters
        var price = "\"1, 2, 3\"";

        var multiplier = 1000;
        var range = document.getElementById("slider").value * multiplier; //meters


        // REST URL
        var url = "/places?lat=" + mycoords[0] + 
            "&long=" + mycoords[1] +
            "&range=" + range + 
            "&price=" + price;
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
    $scope.yelp = function () 
    {

        var term = document.getElementById("term").value;
        var loc = document.getElementById("location").value;

        // both text fields empty
        if(!term && !loc || term == "me")
        {
            // hides bottom data panel
            $scope.visible = false;
            return;
        }

        // need to use google api for coords to city state
        //if (loc === "")
        //    loc = myloc;

        // REST URL
        var url = "/yelp?term=\"" + term +"\"&location=\"" + loc + "\"";
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
                var yelpData = response.data;

                // no yelp data found
                if(!yelpData)
                {
                    // hides bottom data panel
                    $scope.visible = false;
                    return;
                }

                setYelpScopes(yelpData);
                
                $scope.favorite = unstar;

                var newSpot = {
                    name: yelpData.name,
                    lat: yelpData.coordinates.latitude, 
                    lon: yelpData.coordinates.longitude, 
                    loc: yelpData.location.city + ", " + yelpData.location.state
                };
                addMarker(newSpot, selected);

                document.getElementById("term").value = yelpData.name;
                document.getElementById("location").value = yelpData.location.city + ", " + yelpData.location.state;

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
        var url = "/yelp?term=\"" + term +"\"&location=\"" + loc + "\"";
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
        var url = "/favorite?email=" + email + "&term=\"" + term +"\"&location=\"" + loc + "\"";
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
