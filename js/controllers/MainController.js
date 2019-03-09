
app.controller('MainController', ['$scope', '$http', function ($scope, $http) 
{
    $scope.title = "Food Finder";

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

    // Sends textbox input to Yelp in Nodejs backend, then pushes to Mongo if not already in there
    $scope.yelp = function () 
    {

        var term = document.getElementById("term").value;
        var loc = document.getElementById("location").value;

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

                $scope.all = yelpData;
                $scope.name = yelpData.name;
                $scope.image = yelpData.image_url;
                $scope.shutdown = yelpData.is_closed;
                $scope.rating = yelpData.rating;
                $scope.price = yelpData.price;
                $scope.phone = yelpData.display_phone;
                $scope.location = yelpData.location.city + ", " + yelpData.location.state;
                
                var cates = "";
                for(i = 0; i < yelpData.categories.length; i++)
                {
                    if(i == 0)
                        cates += yelpData.categories[i].title;
                    else
                        cates += ", " + yelpData.categories[i].title;
                }
                $scope.categories = cates;
                
                var newSpot = {
                    name: yelpData.name,
                    lat: yelpData.coordinates.latitude, 
                    lon: yelpData.coordinates.longitude, 
                    loc: yelpData.location.city + ", " + yelpData.location.state
                };
                addMarker(newSpot, normal);

                document.getElementById("term").value = yelpData.name;
                document.getElementById("location").value = yelpData.location.city + ", " + yelpData.location.state;
            }
        );

    };

    // Sets textbox data to clicked marker, sends to Yelp and shows data in bottom
    $scope.zoom = function () 
    {

        var term = document.getElementById("term").value;
        var loc = document.getElementById("location").value;

        // REST URL
        var url = "/zoom?term=\"" + term +"\"&location=\"" + loc + "\"";
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

                $scope.all = yelpData;
                $scope.name = yelpData.name;
                $scope.image = yelpData.image_url;
                $scope.shutdown = yelpData.is_closed;
                $scope.rating = yelpData.rating;
                $scope.price = yelpData.price;
                $scope.phone = yelpData.display_phone;
                $scope.location = yelpData.location.city + ", " + yelpData.location.state;
                
                var cates = "";
                for(i = 0; i < yelpData.categories.length; i++)
                {
                    if(i == 0)
                        cates += yelpData.categories[i].title;
                    else
                        cates += ", " + yelpData.categories[i].title;
                }
                $scope.categories = cates;
            }
        );

    };

    // Toggles if saved in mongo
    $scope.favorite = function () 
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
                var result = response.data;
            }
        );

    };

}]);
