
app.controller('AccountController', ['$scope', '$http', function ($scope, $http) 
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

    function redirectLogin(username, password)
    {
        location.href = "/login?username=" + username + "&password=" + password;
    }


    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
      }            
    
    $scope.init = function()
    {    
        // parameters = getUrlVars();
        // if(!isEmpty(parameters))
        // {
        //     var username = parameters.username;
        //     var password = parameters.password;

        //     // remove literal quotes
        //     username = username.substring(1, username.length - 1);
        //     password = password.substring(1, password.length - 1);

        //     document.getElementById("username").value = username;
        //     document.getElementById("password").value = password;
        // }
    }

    // Sends textbox input to Yelp in Nodejs backend
    $scope.login = function () 
    {

        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        // REST URL
        var url = "/loginaccount?username=\"" + username +"\"&password=\"" + password + "\"";
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
                // console.log(result);
                if(result)
                {
                    $scope.results = "Logged in!";
                    successColor();
                    setTimeout(redirectHome(), 50000);
                }
                else
                {
                    $scope.results = "Invalid Credentials"
                    document.getElementById("username").value = "";
                    document.getElementById("password").value = "";
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

        if(!email | !username | !password | !passwordrepeat)
        {
            $scope.results = "Required field(s) left empty";
            failureColor();
            $scope.visible = true;
            return;
        }

        if(email.includes(' '))
        {
            $scope.results = "No spaces are allowed in email";
            document.getElementById("email").value = "";
            failureColor();
            $scope.visible = true;
            return;
        }

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
        var url = "/createaccount?email=\"" + email +"\"&username=\"" + username +"\"&password=\"" + password + "\"";
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
                    setTimeout(redirectLogin(username, password), 50000);
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
