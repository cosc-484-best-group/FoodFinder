
fullheight();
function fullheight() 
{
    var element = document.getElementById('main');
    var h = document.body.scrollHeight;
    var windowHeight = h + "px";
    alert(h);
    var he = getActualHeight();
    alert(he);
    element.style.height = windowHeight;
}

function getActualHeight() 
{
    var actualHeight = window.innerHeight ||
                      document.documentElement.clientHeight ||
                      document.body.clientHeight ||
                      document.body.offsetHeight;

    return actualHeight;
}

window.onresize = function(event)
{
    fullheight();
}