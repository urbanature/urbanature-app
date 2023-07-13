import { setHash } from "../../src/history.js";
import { delay, imgToSvg } from "../../src/misc.js";
import * as TO_USE from "./to-use.js"; // DO NOT REMOVE, THEY ARE USED IN AN EVAL SCRIPT

export const resetHashEvents = () => {
    $("#leave-hash-page").off("click");
}

function unloadHash() {
    setHash("");
    loadFromHash();
}

//add or go back with the localStorage URL
function localUrl(){
    let localaction = localStorage.urlAction;
    if(localaction == "addUrl"){
        let currenturl = window.location.href;
        let localarray = JSON.parse(localStorage.getItem("urlArray"));

        localarray.unshift(currenturl);

        localStorage.setItem("urlArray", JSON.stringify(localarray));
    }
    if(localaction == "backUrl"){
        let localarray = JSON.parse(localStorage.getItem("urlArray"));
        localarray.shift();

        localStorage.setItem("urlArray", JSON.stringify(localarray));

        localStorage.setItem("urlAction", "addUrl");

        //If there is no second value in the array, the next step is to go back to the "decouvrir" page
        if(typeof localarray[1] == 'undefined'){
            localarray.push(" ");
            localStorage.setItem("urlArray", JSON.stringify(localarray));
        }
    }
}

export const loadHashPage = async (hash) => {
    const header = await fetch(`pages/decouvrir/template/header.html`).then(res => res.text());
    let text = "";
    let with_header = true;
    let to_use = "";
    let to_use_after = "";
    try {
        const response = await fetch(`pages/decouvrir/hashpages/${hash}.html`);
        if(response.url.includes('404')) {
            throw new Error("404");
        }
        text = await response.text();
        if(text.includes("<!-- no-header -->")) {
            with_header = false;
        }
        if(text.includes("<!-- use:")) {
            to_use = text.split("<!-- use: ")[1].split(" -->")[0];
            text = await (eval(`TO_USE.${to_use}`)(text));
        }
        if(text.includes("<!-- use-after:")) {
            to_use_after = text.split("<!-- use-after: ")[1].split(" -->")[0].trim();
        }
    } catch {};
    resetHashEvents();
    $(`.__link__button[href="decouvrir"]`).off("click", unloadHash);
    $("#__dom__page a").off("click");
    $(".save-button").off("click");
    $("#leave-hash-page").off("click");
    $("#__dom__page .contentbox__expand").off("click");
    $("#__dom__page img").off("error");
    $("#__dom__page").scrollTop(0);
    $("#hash-page").scrollTop(0)
                    .html((with_header ? header : "") + (text || `<h1>404 - Page not found</h1>`));
    imgToSvg();
    $("#leave-hash-page").on("click", function(e) {
        localStorage.setItem("urlAction", "backUrl");

        let localarray = JSON.parse(localStorage.getItem("urlArray"));
        let hash = localarray[1].split('/');

        let hashvalue = hash[hash.length - 1].replace("decouvrir#", "");

        setHash(hashvalue);
        loadFromHash();
    });
    $("#__dom__page a").on("click", function(e) {
        loadFromHash();
    });
    $(".save-button").on("click", function(e) {
        e.stopPropagation();
    });
    $(`.__link__button[href="decouvrir"]`).on("click", unloadHash);
    if(!with_header) {
        $("#hash-page").addClass("no-header");
    } else {
        $("#hash-page").removeClass("no-header");
    }
    if(to_use_after) await (eval(`TO_USE.${to_use_after}`)(text));
    $("#__dom__page img").on("error", function(e) {
        $(this).attr("src", "database/img/noimg.webp");
    });
    $("#__dom__page .contentbox__expand").on("click", function(e) {
        $(this).parent().attr("data-expanded", $(this).parent().attr("data-expanded") == "true" ? "false" : "true");
    });
}

export const loadFromHash = async () => {
    await delay(10);
    $("#__dom__loadico").removeClass("hidden");
    let hash = window.location.hash.substring(1);
    
    localUrl()

    if(hash.includes(".")) {
        hash = hash.split(".")[0];
    }
    if (hash.length > 0) {
        await loadHashPage(hash);
        $('#hash-page').addClass('hash-page--show');
        $("#__dom__page").attr("data-has-overlay", "true");
    } else {
        $('#hash-page').removeClass('hash-page--show');
        $("#__dom__page").attr("data-has-overlay", "false");
    }
    $("#__dom__loadico").addClass("hidden");
}
