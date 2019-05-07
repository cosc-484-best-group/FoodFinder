
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

    function redirectLogin()
    {
        location.href = "/login";
    }         
    
    // Sends textbox input to Yelp in Nodejs backend
    $scope.login = function () 
    {

        var email = document.getElementById("myemail").value;
        var password = document.getElementById("mypassword").value;

        // REST URL
        var url = "/loginaccount";
        var data = {"email": email, "password": password}
        
        // Set the configurations for the uploaded file

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "application/x-www-form-urlencoded",
            success: function(response){
                var result = response.valid;
                // console.log(result);
                if(result)
                {
                    $scope.results = "Logged in!";

                    // push to HTML5 local storage
                    sessionStorage.setItem('email', response.email);
                    sessionStorage.setItem('username', response.username);
                    sessionStorage.setItem('favorites', JSON.stringify(response.favorites));
                    
                    successColor();
                    setTimeout(redirectHome(), 50000);
                }
                else
                {
                    $scope.results = "Invalid Credentials"
                    document.getElementById("myemail").value = "";
                    document.getElementById("mypassword").value = "";
                    failureColor();
                }
                $scope.visible = true;
            }
        });
        // var config =
        // {
        //     transformRequest: angular.identity,
        //     transformResponse: angular.identity,
        //     headers: 
        //     {
        //         'Content-Type': undefined
        //     }
        // }

        // Sends the file data off
        // $http.get(url, data, config).then(
        //     // Success
        //     function (response)
        //     {
        //         var result = response.data.valid;
        //         // console.log(result);
        //         if(result)
        //         {
        //             $scope.results = "Logged in!";

        //             // push to HTML5 local storage
        //             sessionStorage.setItem('email', response.data.email);
        //             sessionStorage.setItem('username', response.data.username);
        //             sessionStorage.setItem('favorites', JSON.stringify(response.data.favorites));
                    
        //             successColor();
        //             setTimeout(redirectHome(), 50000);
        //         }
        //         else
        //         {
        //             $scope.results = "Invalid Credentials"
        //             document.getElementById("myemail").value = "";
        //             document.getElementById("mypassword").value = "";
        //             failureColor();
        //         }
        //         $scope.visible = true;
        //     }
        // );

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
        var url = "/createaccount";
        var data = {"email": email, "username": username, "password": password}
        
        // Set the configurations for the uploaded file
        // var config =
        // {
        //     transformRequest: angular.identity,
        //     transformResponse: angular.identity,
        //     headers: 
        //     {
        //         'Content-Type': undefined
        //     }
        // }

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "application/x-www-form-urlencoded",
            success: function(response){
                var result = response;
                if(result)
                {
                    $scope.results = "Account created!";
                    successColor();
                    setTimeout(redirectLogin(), 50000);
                }
                else
                {
                    $scope.results = "Unable to create account, please try again"
                    failureColor();
                }
                $scope.visible = true;
            }
        });
        // Sends the file data off
        // $http.get(url, data, config).then(
        //     // Success
        //     function (response)
        //     {
        //         var result = response;
        //         if(result)
        //         {
        //             $scope.results = "Account created!";
        //             successColor();
        //             setTimeout(redirectLogin(), 50000);
        //         }
        //         else
        //         {
        //             $scope.results = "Unable to create account, please try again"
        //             failureColor();
        //         }
        //         $scope.visible = true;
        //     }
        // );

    };
    

}]);
