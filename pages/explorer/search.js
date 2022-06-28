import * as USERDATA from "../../src/data_manager/ud.js";
import { imgToSvg } from "../../src/misc.js";
import * as SEARCH_ENGINE_BAK from "../../src/search.bak.js";
import * as SEARCH_ENGINE from "../../src/search.js";
import { $_slist_item_history, $_slist_item_my, $_slist_item_search } from "./el.js";

export const refreshRecent = async () => {
    const $recent = $("#src-recent");
    const recentes = USERDATA.getRecherchesRecentes("explorer", 3);
    for (let rec of recentes) {
        $_slist_item_history(rec).appendTo($recent.find("ul"));
    }
}
export const refreshFavorites = async () => {
    const $favorites = $("#src-favorites");
    const favorites = await USERDATA.getFavorisAsync();
    for (let fav of favorites) {
        $_slist_item_my(fav.nom).appendTo($favorites.find("ul"));
    }
}

export const initSearch = async () => {
    const $search = $("#search");
    const $results = $("#src-results");
    const $searchbar = $("#explorer-search");

    await refreshRecent();
    await refreshFavorites();
    await imgToSvg();

    $searchbar.on("submit", async function(e) {
        e.preventDefault();
        const query = $(this).find("input").val();
        if(query.length > 0) {
            $search.attr("data-mode", "search");
        } else {
            $search.attr("data-mode", "my");
            await refreshRecent();
            await refreshFavorites();
            return;
        }
        // const results = await SEARCH_ENGINE_BAK.searchByKeyEverywhereWithLimit("nom", query, 25);
        const results = (await SEARCH_ENGINE.searchInAllTables(query, 25)).map(r => r.data);
        $results.find("ul").empty();
        for (let db of results) {
            $_slist_item_search(db.nom, "", db.id).appendTo($results.find("ul"));
        }
        await imgToSvg();
        USERDATA.addRecherche("explorer", query);
        USERDATA.limitRecherches("explorer", 3);
    });
}
