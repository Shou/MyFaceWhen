
// ==UserScript==
// @name            MyFaceWhen
// @description     Your faces when
// @version         0.1
// @include         http*://*.zetaboards.com/*/topic/*
// @include         http*://*.zetaboards.com/*/post/*
// @author          Shou
// @copyright       2013, Shou
// @license         GPL-3
// ==/UserScript==

// {{{ Constants

var imgs = "MFW-imgs"

// }}}

// {{{ Utils

// log :: String -> IO ()
function log(x){
    console.log("MFW :: " + x)
}

// | No more Flydom!
// speedcore :: String -> Obj -> Tree -> Elem
function speedcore(tagname, attrs, childs){
    var e = document.createElement(tagname);
    for (k in attrs){
        if (typeof attrs[k] === "object")
            for (l in attrs[k])
                e[k][l] = attrs[k][l];
        else e[k] = attrs[k];
    }
    for (var i = 0; i < childs.length; i = i + 3){
        var el = speedcore( childs[i]
                          , childs[i + 1]
                          , childs[i + 2]
                          );
        e.appendChild(el);
    }
    return e;
}

// }}}

// images :: IO (Object String String)
function images(){
    try {
        return JSON.parse(localStorage[igms])

    } catch(e) {
        console.log(e)
        return {}
    }
}

// replacer :: String -> String
function replacer(x){
    log("Replacing...")
    var is = images()

    for (var k in is) {
        x = x.replace(RegExp(k, 'g'), "[img]" + is[k] + "[/img]")
    }

    return x
}

// TODO insert instead of append, in case it exists
// addEmoticon :: Event -> IO ()
function addEmoticon(e){
    while (true) {
        var k = prompt("Emoticon name?")
        if (k == null) break

        var i = prompt("Emoticon link?")
        if (i === null) break

        log("Adding " + k + ": " + i)

        var is = images()
        is[k] = i

        localStorage[imgs] = JSON.stringify(is)

        var e = document.getElementById("emot_list")
        var img = document.createElement("img")

        img.title = k
        img.alt = k
        img.src = i

        e.appendChild(img)
    }
}

// removeEmoticon :: Event -> IO ()
function removeEmoticon(e){
    while (true) {
        var k = prompt("Emoticon name?")
        if (k === null) break

        log("Removing " + k)

        var is = images()
        delete is[k]

        localStorage[imgs] = JSON.stringify(is)

        var e = document.getElementById("emot_list")
        var es = e.children

        for (var i = 0; i < es; i++)
            if (es[i].title === k) es[i].parentNode.removeChild(es[i])
    }
}

// thread :: IO ()
function thread(){
}

// post :: IO ()
function post(){
    log("Post page")

    var e = document.getElementById("emot_list")
    var is = images()

    for (var k in is) {
        var li = document.createElement("li")
        var img = document.createElement("img")

        img.title = k
        img.alt = k
        img.src = is[k]

        li.appendChild(img)
        x.appendChild(li)
    }

    var w = document.getElementById("c_emot")
    var ui = speedcore("div", { id: "mfw_add" }, [
        "input", { type: "button"
                 , value: "Add emoticon"
                 , onclick: addEmoticon
                 }, [],
        "input", { type: "button"
                 , value: "Remove emoticon"
                 , onclick: removeEmoticon
                 }, []
    ])

    w.appendChild(ui)
}


// main :: IO ()
function main(){
    log("Init...")

    if (window.location.pathname.split('/')[2] === "topic") thread()
    else if (window.location.pathname.split('/')[2] === "post") post()
}

log("penis")
console.log("penis")

main()

