import * as BASEDATA from "./data_manager/bd.js";
import * as USERDATA from "./data_manager/ud.js";
import { getLocation } from "./dom/map.js";

const SEARCH_URL = `https://api.totoshampoin.fr/urbanature/search`;
const EXCEPTIONS = ["historique"];

const prepareFetch = (url, param) => url + '?' + new URLSearchParams(param).toString();
const fetchParams = async (url, param) => await fetch(prepareFetch(url, param));

export const searchInTable = async (table, searchText, locate, limit) => {
    const loc = locate ?? await getLocation();
    const req = await fetchParams(SEARCH_URL, {
        query: searchText,
        table: table,
        limit: limit ?? 20,
        lat: loc.lat,
        lng: loc.lng
    });
    const data = await req.json();
    const result = []
    if(data.error) {
        console.error(data.error);
        return result;
    }
    for(const row of data) {
        result.push({
            ...row,
            // data: await USERDATA.parseId(row.sid)
        });
    }
    return result;
}

export const searchInAllTables = async (searchText, limit) => {
    const loc = await getLocation();
    const tables = BASEDATA.getDatabases();
    const search = [];
    for(let t of tables) {
        if(EXCEPTIONS.includes(t)) continue;
        const data = await searchInTable(t, searchText, loc, limit ?? 10);
        search.push(...data);
    }
    search.sort((a, b) => a.distance - b.distance);
    return search;
}


window.searchInTable = searchInTable;
window.searchInAllTables = searchInAllTables;