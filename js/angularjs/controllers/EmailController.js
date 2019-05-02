
app.controller('EmailController', ['$scope', '$http', function ($scope, $http) 
{

    $scope.sendMessage = function(subject, message) 
    { 

        // REST URL
        var url = "/sendmail?subject=" + encodeURI(subject) + "&message=" + encodeURI(message); 
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
                if(response)
                    alert("Message sent!");
            }
        );
    
    }

}]);
