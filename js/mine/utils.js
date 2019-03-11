
function goback() 
{
    window.history.back();
}

function forcehttps()
{
    if (location.protocol !== "https:") 
    {
        location.protocol = "https:";
    }
}