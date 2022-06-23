import { loadFromHash } from "./loader.js";

export const decouvrir__init = async () => {
    loadFromHash();
    $("#__dom__page a").on("click", function(e) {
        loadFromHash();
    });
}
