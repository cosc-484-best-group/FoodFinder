
fullheight();
function fullheight() 
{
    var element = document.getElementById('main');
    var windowheight = window.innerHeight + "px";
    alert(windowheight);
    element.style.height = windowheight;
}

window.onresize = function(event)
{
    fullheight();
}