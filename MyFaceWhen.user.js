
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

// keys :: Object a b -> [a]
function keys(o){
    var tmp = []

    for (var k in o) tmp.push(k)

    return tmp
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
        return JSON.parse(localStorage[imgs])

    } catch(e) {
        console.log(e.toString())
        return {}
    }
}

// replacer :: String -> String
function replacer(x){
    log("Replacing...")
    var is = images()

    for (var k in is) {
        log(k)

        var ek = k.replace(/([^a-zA-Z0-9])/g, "\\$1")

        try {
            x = x.replace(RegExp(ek, 'g'), "[img]" + is[k] + "[/img]")

        } catch(e) {
            log(e.toString())
        }
    }

    return x
}

// TODO insert instead of append, in case it exists
// addEmoticon :: Event -> IO ()
function addEmoticon(e){
    var is = images()

    while (true) {
        var k = prompt("Emoticon name?")
        if (k == null) break

        var i = prompt("Emoticon link?")
        if (i === null) break

        log("Adding " + k + ": " + i)

        is[k] = i

        var e = document.getElementById("emot_list")
        var li = document.createElement("li")
        var img = document.createElement("img")

        img.title = k
        img.alt = k
        img.src = i

        li.appendChild(img)
        e.appendChild(li)
    }

    localStorage[imgs] = JSON.stringify(is)
}

// removeEmoticon :: Event -> IO ()
function removeEmoticon(e){
    var is = images()

    while (true) {
        var k = prompt("Emoticon name?")
        if (k === null) break

        log("Removing " + k)

        delete is[k]

        var e = document.getElementById("emot_list")
        var es = e.children

        for (var i = 0; i < es; i++) {
            log(es[i].children[0].title)

            if (es[i].children[0].title === k)
                es[i].parentNode.removeChild(es[i])
        }
    }

    localStorage[imgs] = JSON.stringify(is)
}

// thread :: IO ()
function thread(){
    log("Thread page")

    var txt = document.querySelector("#c_post textarea")

    txt.addEventListener("keydown", function(e){
        if (e.keyCode === 32) {
            txt.value = replacer(txt.value)
            log("click!!!")
        }
    })
}

// post :: IO ()
function post(){
    log("Post page")

    var e = document.getElementById("emot_list")
    var is = images()

    for (var k in is) {
        log("Adding emoticon " + k)

        var li = document.createElement("li")
        var img = document.createElement("img")

        img.title = k
        img.alt = k
        img.src = is[k]

        li.appendChild(img)
        e.appendChild(li)
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

    var txt = document.getElementById("c_post-text")
    var btr = document.getElementById("c_postbtn")
    var btn = btr.children[0].children[0]

    txt.addEventListener("keydown", function(e){
        if (e.keyCode === 32) {
            txt.value = replacer(txt.value)
            log("click!!!")
        }
    })
}


// main :: IO ()
function main(){
    log("Init...")

    if (window.location.pathname.split('/')[2] === "topic") thread()
    else if (window.location.pathname.split('/')[2] === "post") post()
}

main()

