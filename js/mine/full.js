
fullheight();
function fullheight() 
{
    var elements = document.getElementsByClassName('fill');
    var windowheight = window.innerHeight + "px";
    alert('a');
    for(let el in elements)
        if(elements.hasOwnProperty(el))
            elements[el].style.height = windowheight;
}

window.onresize = function(event)
{
    fullheight();
}