import { setHash } from "../../src/history.js";
import { delay, imgToSvg } from "../../src/misc.js";
import { parcours, liste } from "./to-use.js"; // DO NOT REMOVE, THEY ARE USED IN AN EVAL SCRIPT

export const resetHashEvents = () => {
    $("#leave-hash-page").off("click");
}

function unloadHash() {
    setHash("");
    loadFromHash();
}

export const loadHashPage = async (hash) => {
    const header = await fetch(`pages/parcourir/hashpages/header.html`).then(res => res.text());
    let text = "";
    let with_header = true;
    let to_use = "";
    try {
        const response = await fetch(`pages/parcourir/hashpages/${hash}.html`);
        if(response.url.includes('404')) {
            throw new Error("404");
        }
        text = await response.text();
        if(text.includes("<!-- no-header -->")) {
            with_header = false;
        }
        if(text.includes("<!-- use")) {
            to_use = text.split("<!-- use: ")[1].split(" -->")[0];
            console.log(eval(`${to_use}`)(text))
            text = await (eval(`${to_use}`)(text));
        }
    } catch {};
    resetHashEvents();
    $(`.__link__button[href="parcourir"]`).off("click", unloadHash);
    $("#__dom__page").scrollTop(0);
    $("#hash-page").scrollTop(0)
                    .html((with_header ? header : "") + (text || `<h1>404 - Page not found</h1>`));
    imgToSvg();
    $("#leave-hash-page").on("click", function(e) {
        setHash("");
        loadFromHash();
    });
    $("#__dom__page a").on("click", function(e) {
        console.log("click");
        loadFromHash();
    });
    if(!with_header) {
        $(`.__link__button[href="parcourir"]`).on("click", unloadHash);
        $("#hash-page").addClass("no-header");
    } else {
        $("#hash-page").removeClass("no-header");
    }
}

export const loadFromHash = async () => {
    await delay(10);
    $("#__dom__loadico").removeClass("hidden");
    let hash = window.location.hash.substring(1);
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
