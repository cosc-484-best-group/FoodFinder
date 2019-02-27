
function initMap() 
{

    var towsonu = new google.maps.LatLng(39.3938317, -76.6074833);

    var ginos = {name: "Gino's Burger and Fries", type: "American", cost: "low", lat: 39.3958583, lon: -76.5776393}
    var nandos = {name: "Nandos Peri Peri Chicken", type: "Peri", cost: "medium", lat: 39.4011696, lon: -76.60070523}
    
    var resturants = [ginos, nandos]
    
    var mapOptions = {
        center: towsonu,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    for(i = 0; i < resturants.length; i++)
    {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(resturants[i].lat, resturants[i].lon),
            title:resturants[i].name,
            visible: true
        });

        marker.setMap(map);
    }

}