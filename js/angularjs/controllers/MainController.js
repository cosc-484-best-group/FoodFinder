
app.controller('MainController', ['$scope', '$http', function ($scope, $http) 
{

	var hoffset = 200;
	function setYelpScopes(yelpData)
	{	
     		$scope.all = yelpData;
            $scope.name = yelpData.name;
            $scope.image = yelpData.image_url;
            $scope.shutdown = yelpData.is_closed;
            $scope.rating = yelpData.rating + "/5";
            $scope.price = yelpData.price;
            $scope.phone = yelpData.display_phone;
            $scope.location = yelpData.location.city + ", " + yelpData.location.state;
            
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

    // Pull mongo saved datapoints passes to yelp and marks on map
    $scope.init = function () 
    {

        // REST URL
        var url = "/init";
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

        // hides bottom data panel
        $scope.visible = false;
        $scope.loggedin = false;


        // pull from HTML5 local storage
        var user = sessionStorage.getItem('username');
        if(user)
            $scope.loggedin = true;



        if($scope.loggedin)
            document.getElementById('loginbutton').innerHTML = user;
        else
            document.getElementById('loginbutton').innerHTML = "Login";


        // Sends the file data off
        $http.get(url, data, config).then(
            // Success
            function (response)
            {
                // yelp data for each mongo rid
                var yelpDataList = response.data;
                for(i = 0; i < yelpDataList.length; i++)
                {
                    yelpData = yelpDataList[i];
                    var newSpot = {
                        name: yelpData.name,
                        lat: yelpData.coordinates.latitude, 
                        lon: yelpData.coordinates.longitude, 
                        loc: yelpData.location.city + ", " + yelpData.location.state
                    };
                    addMarker(newSpot, starred);
                }
            }
        );

    };

    $scope.login = function()
    {
        if($scope.loggedin)
        {
            $scope.loggedin = false;
            document.getElementById('loginbutton').innerHTML = "Login";
        }
        else
            location.href = "/login";
    }

    // Sends textbox input to Yelp in Nodejs backend
    $scope.nearby = function () 
    {

        var range = 200; //meters

        // REST URL
        var url = "/places?lat=" + mycoords[0] + 
            "&long=" + mycoords[1] +
            "&range=" + range;
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

                // change height
                fullheight(hoffset);
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

        // change height
        fullheight(hoffset);
        
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

        var term = document.getElementById("term").value;
        var loc = document.getElementById("location").value;

        // REST URL
        var url = "/favorite?term=\"" + term +"\"&location=\"" + loc + "\"";
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
                var result = dataList[0];
                var yelpData = dataList[1];
                $scope.ress = result;
                
                var newSpot = {
                    name: yelpData.name,
                    lat: yelpData.coordinates.latitude, 
                    lon: yelpData.coordinates.longitude, 
                    loc: yelpData.location.city + ", " + yelpData.location.state
                };

                if(result)
                {
                    editMarker(newSpot, selected);
                    $scope.favorite = unstar;
                }
                else
                {
                    editMarker(newSpot, starred);
                    $scope.favorite = star;
                }
            }
        );

    };

}]);
