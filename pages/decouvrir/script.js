import { setHash } from "../../src/history.js";
import { delay, imgToSvg } from "../../src/misc.js";

const resetHashEvents = () => {
    $("#leave-hash-page").off("click");
}

const loadHashPage = async (hash) => {
    const header = await fetch(`/pages/decouvrir/hashpages/header.html`).then(res => res.text());
    let text = "";
    try {
        const response = await fetch(`/pages/decouvrir/hashpages/${hash}.html`);
        if(response.url.includes('404')) {
            throw new Error("404");
        }
        text = await response.text();
    } catch {};
    resetHashEvents();
    $("#__dom__page").scrollTop(0);
    $("#hash-page").scrollTop(0)
                    .html(header + (text || `<h1>404 - Page not found</h1>`));
    imgToSvg();
    $("#leave-hash-page").on("click", function(e) {
        setHash("");
        loadFromHash();
    });
}

const loadFromHash = async () => {
    await delay(10);
    const hash = window.location.hash.substring(1);
    if (hash.length > 0) {
        await loadHashPage(hash);
        $('#hash-page').addClass('hash-page--show');
        $("#__dom__page").attr("data-has-overlay", "true");
    } else {
        $('#hash-page').removeClass('hash-page--show');
    }
}

export const decouvrir__init = async () => {
    loadFromHash();
    $("#__dom__page a").on("click", function(e) {
        console.log("click");
        loadFromHash();
    });
}
