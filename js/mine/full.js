
fullheight();
function fullheight() 
{
    var element = document.getElementById('main');
    var windowheight = document.body.scrollheight + "px";
    alert(windowheight);
    element.style.height = windowheight;
}

window.onresize = function(event)
{
    fullheight();
}