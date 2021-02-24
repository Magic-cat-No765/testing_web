'use strict';
var button_state = true
var clicked = false
var tmp
var LOCK_HEADER_MENU = false
var GIF_PLAYING = false

function change_bg()
{
    elm = document.getElementById("main_bg")
    elm.style.backgroundImage = "url('bg.jpg')"
}

function change_color(button, rgb)
{
    button.style.background = "rgb(" + rgb[0] + ',' + rgb[1] + ',' + rgb[2] +')'
    console.log("rgb(" + rgb[0] + ',' + rgb[1] + ',' + rgb[2] +')')
}


var delta = -1
var play_flag = true
var fgx = 0
var fgy = 0

function slower_animation(func, time, mul, condition)
{
    setTimeout(() => {
        if(condition)
            return
        else
        {
            func()
            time = mul(time)
            slower_animation(func, time, mul, condition)
        }
    }, time);
}

function menu()
{
    clicked = !clicked
    if (clicked)
        FG_logo_foward()
    else
        FG_logo_backward()
}

function FG_logo_foward()
{
    console.log('Forward!')
    play_flag = !play_flag
    var home_button = document.getElementById("home_button")
    var foward_animation = setInterval(() => {
        if(play_flag || (fgy>=100 && fgx>=20))
        {
            clearInterval(foward_animation)
            fgx=0
            return
        }
        else
        {
            home_button.style.backgroundPosition = fgx + '% ' + fgy + '%'
            console.log(home_button.style.backgroundPosition)
            if(fgx>=100)
            {
                fgx=0
                fgy+=25
            }
            else if(fgx<100)
                fgx+=25
        }
    }, 20);

    var elms = document.getElementsByClassName("scroll_menu")[0].children
    for (let i=0; i<elms.length; i++)
    {
        elms[i].style.visibility = "visible"
        elms[i].style.opacity = "100%"
        document.getElementsByClassName("scroll_menu")[0].style.height = "100vh - 10vw"
        elms[i].style.height = "calc(100% / " + elms.length + ")"
        elms[i].style.top = "calc(10vw + ((100% - 10vw)/" + elms.length + ")*" + i +")"
    }

}

function FG_logo_backward()
{
    console.log('Backward!')
    play_flag = !play_flag
    var home_button = document.getElementById("home_button")
    setTimeout(() => {
        var foward_animation = setInterval(() => {
            if(!play_flag || (fgy<=0 && fgx<=0))
            {
                clearInterval(foward_animation)
                return
            }
            else
            {
                home_button.style.backgroundPosition = fgx + '% ' + fgy + '%'
                console.log(home_button.style.backgroundPosition)
                if(fgx<=0)
                {
                    fgx=100
                    fgy-=25
                }
                else if(fgx<=100)
                    fgx-=25
            }
        }, 20);

        var elms = document.getElementsByClassName("scroll_menu")[0].children
        for (let i=0; i<elms.length; i++)
        {
            elms[i].style.visibility = "hidden"
            elms[i].style.opacity= "0%"
            elms[i].style.top = "10vw"
        }
    }, 50);
}


//copy pasted codes

function makeMouseOutFn(elem){
    var list = traverseChildren(elem);
    return function onMouseOut(event) {
        var e = event.toElement || event.relatedTarget;
        if (!!~list.indexOf(e)) {
            return;
        }
        FG_logo_backward();
        // handle mouse event here!
};
}

function makeMouseInFn(elem){
    var list = traverseChildren(elem);
    return function onMouseIn(event) {
        var e = event.toElement || event.relatedTarget;
        if (!!~list.indexOf(e)) {
            return;
        }
        FG_logo_foward();
        // handle mouse event here!
};
}

//using closure to cache all child elements
    
                                                               
        
                                                           
//quick and dirty BFS children traversal, Im sure you could find a better one                                        
function traverseChildren(elem){
    var children = [];
    var q = [];
    q.push(elem);
    while (q.length>0)
    {
        var elem = q.pop();
        children.push(elem);
        pushAll(elem.children);
    }
        function pushAll(elemArray){
            for(let i=0;i<elemArray.length;i++)
            {
                q.push(elemArray[i]);
            }
            
        }
        return children;
}