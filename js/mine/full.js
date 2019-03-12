
fullheight();
function fullheight() 
{
    var element = document.getElementById('main');
    var h = document.body.scrollHeight + 120;
    var windowHeight = h + "px";
    // alert(h);
    element.style.height = windowHeight;
}

window.onresize = function(event)
{
    fullheight();
}