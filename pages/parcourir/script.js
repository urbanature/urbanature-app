import { loadFromHash } from "./loader.js";

export const parcourir__init = async () => {
    loadFromHash();
    $("#__dom__page a").on("click", function(e) {
        console.log("click");
        loadFromHash();
    });
}
