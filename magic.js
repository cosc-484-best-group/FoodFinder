
function hey()
{
    alert('hi');
}

function myMap() 
{
    
    var mapProp = 
    {
      center:new google.maps.LatLng(51.508742,-0.120850),
      zoom:5,
    };

    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

    var marker = new google.maps.Marker({
      position:myCenter,
      animation:google.maps.Animation.BOUNCE
    });
    
    marker.setMap(map); 
    
}


