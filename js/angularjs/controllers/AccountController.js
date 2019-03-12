
app.controller('LoginController', ['$scope', '$http', function ($scope, $http) 
{

    function successColor()
    {
        document.getElementById("details").style.backgroundColor = "rgb(199, 234, 70)"; //lime
        document.getElementById("details").style.borderColor = "green";
    }

    function failureColor()
    {
        document.getElementById("details").style.backgroundColor = "rgb(255, 102, 102)";
        document.getElementById("details").style.borderColor = "rgb(102, 0, 0)";
    }

    function redirectHome()
    {
        location.href = "/";
    }

    function redirectLogin()
    {
        location.href = "/login";
    }

    // Sends textbox input to Yelp in Nodejs backend
    $scope.login = function () 
    {

        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        // REST URL
        var url = "/login?username=\"" + username +"\"&password=\"" + password + "\"";
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
                if(result)
                {
                    $scope.results = "Logged in!";
                    successColor();
                    setTimeout(redirectHome(), 20000);
                }
                else
                {
                    $scope.results = "Invalid Credentials"
                    failureColor();
                }
                $scope.visible = true;
            }
        );

    };

    // Sends textbox input to Yelp in Nodejs backend
    $scope.create = function () 
    {

        var email = document.getElementById("email").value;
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var passwordrepeat = document.getElementById("passwordrepeat").value;

        if(password !== passwordrepeat)
        {
            $scope.results = "Passwords unmatching";
            document.getElementById("password").value = "";
            document.getElementById("passwordrepeat").value = "";
            failureColor();
            $scope.visible = true;
            return;
        }

        // REST URL
        var url = "/create?email=\"" + email +"\"&username=\"" + username +"\"&password=\"" + password + "\"";
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
                if(result)
                {
                    $scope.results = "Account created!";
                    successColor();
                    setTimeout(redirectLogin(), 20000);
                }
                else
                {
                    $scope.results = "Unable to create account, please try again"
                    failureColor();
                }
                $scope.visible = true;
            }
        );

    };
    

}]);
