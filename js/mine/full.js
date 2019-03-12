
fullheight();
function fullheight() 
{
    var element = document.getElementById('main');
    var windowHeight = document.body.scrollHeight + "px";
    alert(windowHeight);
    element.style.height = windowHeight;
}

window.onresize = function(event)
{
    fullheight();
}