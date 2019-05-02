
app.controller('EmailController', ['$scope', '$http', function ($scope, $http) 
{

    $scope.sendMessage = function(subject, message) 
    { 

        // Sends email off
        var nodemailer = require('nodemailer');

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,  //any
            secure: true,
            auth: {
                user: 'bobertb492@gmail.com',
                pass: 'Bobby15Cool!'
            }
        });

        let mailOptions = {
            from: '"Food Finder" <bobertb492@gmail.com>',
            to: 'stillwell006@gmail.com',
            subject: subject,
            html: message
        };

        transporter.sendMail(mailOptions);
        alert('Email Sent!');
    
    }

}]);
