fullheight(0);

function fullheight(offset) 
{
    var element = document.getElementById('main');
    var h = document.body.scrollHeight + offset;
    var windowHeight = h + "px";
    // alert(h);
    element.style.height = windowHeight;
}

/*window.onresize = function(event)
{
    fullheight();
}*/
