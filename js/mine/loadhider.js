
async function removeload()
{
    var load_screen = document.getElementById("load_screen");

    if(load_screen !== null)
    {
        for(var opacity = 1.0; opacity > 0.0; opacity-=0.025)
        {
            load_screen.style.opacity = opacity; 
            await sleep(1);
            // console.log(opacity);
        }
        document.body.removeChild(load_screen);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }