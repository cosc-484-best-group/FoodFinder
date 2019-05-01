
// ===========================
//  JS Fav Array Manipulation
// ===========================
function removeit(json, arr)
{
    var success = false;
    for(var i = 0; i < arr.length; i++)
    {
        var ele = arr[i];
        if (ele.name === json.name && ele.city === json.city && 
            ele.state === json.state && ele.lat === json.lat && 
            ele.long === json.long)
        {
            arr.splice(i, 1);
            success = true;
        }
    }
    return success;
}

function addit(json, arr)
{
    var exi = exists(json, arr);
    var success = false;
    if(!exi)
    {
        arr.push(json);
        success = true;
    }
    return success;
}

function exists(json, arr)
{
    var exists = false;
    for(var i = 0; i < arr.length; i++)
    {
        var ele = arr[i];
        if (ele.name === json.name && ele.city === json.city && 
            ele.state === json.state && ele.lat === json.lat && 
            ele.long === json.long)
        {
            exists = true;
        }
    }
    return exists;
}



function goback()
{
    window.history.back();
}

function forcehttps()
{
    if (location.protocol !== "https:")
        location.protocol = "https:";
}


forcehttps();
