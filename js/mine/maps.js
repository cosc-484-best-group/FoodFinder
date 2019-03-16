
var map;
var mycoords = [0, 0];

function initMap() 
{
    if (location.protocol == 'https:')
        getLocation();
    else  // does not work in http
    {
        var towsonu = new google.maps.LatLng(39.3938317, -76.6074833);
        mycoords = [39.3938317, -76.6074833]

        var mapOptions = {
            center: towsonu,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        map = new google.maps.Map(document.getElementById("map"), mapOptions); 
    }
}

function getLocation() 
{
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(showPosition);
    else
        console.log("Geolocation is not supported by this browser.");
}

function showPosition(position) 
{
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    mycoords = [lat, long]

    var mycenter = new google.maps.LatLng(lat, long);

    var mapOptions = {
        center: mycenter,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map = new google.maps.Map(document.getElementById("map"), mapOptions);


    // add me marker
    var meSpot = {
        name: "me",
        lat: lat,
        lon: long, 
        loc: "(" + lat + ", " + long + ")"
    };
    addMarker(meSpot, me);

}


var me = "orangefeather.png";
var found = "grayfeather.png";
var selected = "redfeather.png";
var starred = "goldfeather.png";

function addMarker(resturant, type) 
{
    //var image = 'img/flagred.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(resturant.lat, resturant.lon),
        // position: neighborhoods[iterator],
        map: map,
        icon: {                             
            url: type                      
        },
        title:resturant.name,
        // title:"Hello World!",
        draggable: false,
        animation: google.maps.Animation.DROP,
        visible: true
    });
    //markers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
        // your magic goes here
        //alert(marker.title);
        map.setCenter(marker.getPosition());
        // map.setZoom(18);
        smoothZoom(map, 18, map.getZoom()); // call smoothZoom, parameters map, final zoomLevel, and starting zoom level
        document.getElementById("term").value = resturant.name;
        document.getElementById("location").value = resturant.loc;
        // $scope.zoom();
        angular.element(document.getElementById('main')).scope().zoom(type);
    });

    marker.setMap(map);
}

function editMarker(resturant, type) {
    // console.log("fdf: " + type);
    //var image = 'img/flagred.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(resturant.lat, resturant.lon),
        // position: neighborhoods[iterator],
        map: map,
        icon: {                             
            url: type                      
        },
        title:resturant.name,
        // title:"Hello World!",
        draggable: false,
        // animation: google.maps.Animation.DROP,
        visible: true
    });
    //markers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
        // your magic goes here
        //alert(marker.title);
        map.setCenter(marker.getPosition());
        // map.setZoom(18);
        smoothZoom(map, 18, map.getZoom()); // call smoothZoom, parameters map, final zoomLevel, and starting zoom level

        document.getElementById("term").value = resturant.name;
        document.getElementById("location").value = resturant.loc;

        // $scope.zoom();
        angular.element(document.getElementById('peace')).scope().zoom(type);
    });

    marker.setMap(map);
}

// the smooth zoom function
function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
        return;
    }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}  