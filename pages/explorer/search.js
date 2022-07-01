import * as USERDATA from "../../src/data_manager/ud.js";
import * as BASEDATA from "../../src/data_manager/bd.js";
import { delay, imgToSvg } from "../../src/misc.js";
import * as SEARCH_ENGINE from "../../src/search.js";
import { $_slist_item_history, $_slist_item_my, $_slist_item_search } from "./el.js";
import { createMarker, clearMarkers, placeMarker } from "./leaf.js";
import { contextOpen } from "./context.js";

export const searchShow = () => {
    $(".search").addClass("search--show");
}
export const searchHide = () => {
    $(".search").removeClass("search--show");
}

export const refreshRecent = async () => {
    const $recent = $("#src-recent");
    const recentes = USERDATA.getRecherchesRecentes("explorer", 3);
    for (let rec of recentes) {
        $_slist_item_history(rec).appendTo($recent.find("ul")).on("click", () => {
            $("#explorer-search input").val(rec);
            $("#explorer-search").trigger("submit");
        });
    }
}
export const refreshFavorites = async () => {
    const $favorites = $("#src-favorites");
    const favorites = await USERDATA.getFavorisAsync();
    for (let fav of favorites) {
        $_slist_item_my(fav.item.nom).appendTo($favorites.find("ul"));
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
        // const results = (await SEARCH_ENGINE.searchInAllTables(query, 25)).map(r => r.data);
        // $results.find("ul").empty();
        // for (let db of results) {
        //     $_slist_item_search(db.nom, "", db.id).appendTo($results.find("ul"));
        // }
        const tables = BASEDATA.getDatabases().filter(t => !SEARCH_ENGINE.EXCEPTIONS.includes(t));
        $results.find("ul").empty();
        for(let t of tables) {
            const meta = BASEDATA.getTableMetaData(t);
            try {
                const data = await SEARCH_ENGINE.searchInTable(t, query, undefined, 25);
                $("<h2 class='ssection__subtitle'>").text(meta.name).appendTo($results.find("ul"));
                for(let {data: d, sid} of data) {
                    const $elem = $_slist_item_search(d.nom, d.meta?.adresse, d.id);
                    $elem.appendTo($results.find("ul"));
                    $elem.find(".search__go").on("click", async function() {
                        console.log(sid);
                        const tab = await BASEDATA.fetchData(t, sid[1]);
                        const dat = tab.find(t => t.id = sid[2])
                        clearMarkers();
                        const Lgeo = createMarker(sid[0], sid[1], dat);
                        placeMarker(Lgeo);
                        searchHide();
                        await delay(100);
                        Lgeo.fire("click");
                    });
                }
            } catch(e) {
                console.error(e);
            }
        }
        await imgToSvg();
        USERDATA.addRecherche("explorer", query);
        USERDATA.limitRecherches("explorer", 3);
    });
}
