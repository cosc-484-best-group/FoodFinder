
fullheight();
function fullheight() 
{
    var elements = document.getElementById('main');
    var windowheight = window.innerHeight + "px";
    alert(windowheight);
    for(let el in elements)
        if(elements.hasOwnProperty(el))
            elements[el].style.height = windowheight;
}

window.onresize = function(event)
{
    fullheight();
}