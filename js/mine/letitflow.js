
// ==============================
//  MAIN
// ==============================

// term box to location box
$("#term").keyup(function (event) 
{
    if (event.keyCode == 13)  // enter
    {
        textbox = $("#location");
        boxNum = textbox.index(this);
        if (textbox[boxNum + 1] != null) 
        {
            next = textbox[boxNum + 1];
            next.focus();
            next.select();
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
        button = $("#submit");
        buttonNum = button.index(this);
        if (button[buttonNum + 1] != null) 
        {
            next = button[buttonNum + 1];
            next.focus();
            next.select();
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
        textbox = $("#mypassword");
        boxNum = textbox.index(this);
        if (textbox[boxNum + 1] != null) 
        {
            next = textbox[boxNum + 1];
            next.focus();
            next.select();
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
        button = $("#login");
        buttonNum = button.index(this);
        if (button[buttonNum + 1] != null) 
        {
            next = button[buttonNum + 1];
            next.focus();
            next.select();
            next.toggleClass('active');
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
        textbox = $("#username");
        boxNum = textbox.index(this);
        if (textbox[boxNum + 1] != null) 
        {
            next = textbox[boxNum + 1];
            next.focus();
            next.select();
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
        textbox = $("#password");
        boxNum = textbox.index(this);
        if (textbox[boxNum + 1] != null) 
        {
            next = textbox[boxNum + 1];
            next.focus();
            next.select();
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
        textbox = $("#passwordrepeat");
        boxNum = textbox.index(this);
        if (textbox[boxNum + 1] != null) 
        {
            next = textbox[boxNum + 1];
            next.focus();
            next.select();
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
        button = $("#create");
        buttonNum = button.index(this);
        if (button[buttonNum + 1] != null) 
        {
            next = button[buttonNum + 1];
            next.focus();
            next.select();
        }
        event.preventDefault();
        return false;
    }
});