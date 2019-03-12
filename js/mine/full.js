
fullheight();
function fullheight() 
{
    var element = document.getElementById('main');

    var body = document.body,
    var html = document.documentElement;
    var windowheight = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

    alert(windowheight);
    element.style.height = windowheight + "px";
}

window.onresize = function(event)
{
    fullheight();
}