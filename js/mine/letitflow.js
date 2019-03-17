
// ==============================
//  MAIN
// ==============================

// term box to location box
$("#term").keyup(function (event) 
{
    if (event.keyCode == 13)  // enter
    {
        textboxes = $("#location");
        currentBoxNumber = textboxes.index(this);
        if (textboxes[currentBoxNumber + 1] != null) 
        {
            nextBox = textboxes[currentBoxNumber + 1];
            nextBox.focus();
            nextBox.select();
        }
        event.preventDefault();
        return false;
    }
});

// location box to submit
$("#location").keyup(function (event) 
{
    if (event.keyCode == 13)  // enter
    {
        textboxes = $("#submit");
        currentBoxNumber = textboxes.index(this);
        if (textboxes[currentBoxNumber + 1] != null) 
        {
            nextBox = textboxes[currentBoxNumber + 1];
            nextBox.focus();
            nextBox.select();
        }
        event.preventDefault();
        return false;
    }
});


// ==============================
//  LOGIN
// ==============================

// username box to password box
$("#myusername").keyup(function (event) 
{
    if (event.keyCode == 13)  // enter
    {
        textboxes = $("#mypassword");
        currentBoxNumber = textboxes.index(this);
        if (textboxes[currentBoxNumber + 1] != null) 
        {
            nextBox = textboxes[currentBoxNumber + 1];
            nextBox.focus();
            nextBox.select();
        }
        event.preventDefault();
        return false;
    }
});

// password box to login button
$("#mypassword").keyup(function (event) 
{
    if (event.keyCode == 13)  // enter
    {
        textboxes = $("#login");
        currentBoxNumber = textboxes.index(this);
        if (textboxes[currentBoxNumber + 1] != null) 
        {
            nextBox = textboxes[currentBoxNumber + 1];
            nextBox.focus();
            nextBox.select();
        }
        event.preventDefault();
        return false;
    }
});


// ==============================
//  CREATE
// ==============================

// email box to username box
$("#email").keyup(function (event) 
{
    if (event.keyCode == 13)  // enter
    {
        textboxes = $("#username");
        currentBoxNumber = textboxes.index(this);
        if (textboxes[currentBoxNumber + 1] != null) 
        {
            nextBox = textboxes[currentBoxNumber + 1];
            nextBox.focus();
            nextBox.select();
        }
        event.preventDefault();
        return false;
    }
});

// username box to password box
$("#username").keyup(function (event) 
{
    if (event.keyCode == 13)  // enter
    {
        textboxes = $("#password");
        currentBoxNumber = textboxes.index(this);
        if (textboxes[currentBoxNumber + 1] != null) 
        {
            nextBox = textboxes[currentBoxNumber + 1];
            nextBox.focus();
            nextBox.select();
        }
        event.preventDefault();
        return false;
    }
});

// password box to passwordrepeat box
$("#password").keyup(function (event) 
{
    if (event.keyCode == 13)  // enter
    {
        textboxes = $("#passwordrepeat");
        currentBoxNumber = textboxes.index(this);
        if (textboxes[currentBoxNumber + 1] != null) 
        {
            nextBox = textboxes[currentBoxNumber + 1];
            nextBox.focus();
            nextBox.select();
        }
        event.preventDefault();
        return false;
    }
});

// passwordrepeat box to create button
$("#passwordrepeat").keyup(function (event) 
{
    if (event.keyCode == 13)  // enter
    {
        textboxes = $("#create");
        currentBoxNumber = textboxes.index(this);
        if (textboxes[currentBoxNumber + 1] != null) 
        {
            nextBox = textboxes[currentBoxNumber + 1];
            nextBox.focus();
            nextBox.select();
        }
        event.preventDefault();
        return false;
    }
});