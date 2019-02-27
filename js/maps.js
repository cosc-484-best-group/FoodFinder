
function initMap() 
{
    latLng = new google.maps.LatLng(-8.064903, -34.896872)
    var mapOptions = {
        center: latLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var marker = new google.maps.Marker({
        position: latLng,
        title:"Hello World!",
        visible: true
    });

    marker.setMap(map);
}