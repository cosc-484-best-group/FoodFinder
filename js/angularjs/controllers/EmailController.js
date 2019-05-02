
app.controller('EmailController', ['$scope', '$http', function ($scope, $http) 
{

    $scope.sendMessage = function(subject, message) 
    {
        console.log("Subject: " + subject);
        console.log("Message: " + message);
    }

}]);
