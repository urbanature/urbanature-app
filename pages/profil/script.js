import * as USERDATA from "../../src/data_manager/ud.js";
import * as BASEDATA from "../../src/data_manager/bd.js";
import { imgToSvg } from "../../src/misc.js";
import { loadFromHash } from "./loader.js";

export const profil__init = async () => {
    const $favorite = $("#favorite");
    const $history = $("#history");

    const favitem_ = await fetch("pages/profil/template/favitem.html").then(res => res.text());
    const histem_ = await fetch("pages/profil/template/histem.html").then(res => res.text());

    const favitem = _.template(favitem_);
    const histem = _.template(histem_);

    const favoris = await USERDATA.getFavorisAsync();
    for(let i = 0; i < favoris.length || i < 25; i++) {
        if(!favoris[i]) continue;
        const {item: fav, table} = favoris[i];
        const $fav = $(favitem({
            text: BASEDATA.getNameFromElement(table, fav)
        }));
        $favorite.append($fav);
    }
    const recherches = [];
    const udr = USERDATA.getAllRecherches();
    for(let page of Object.keys(udr)) {
        const pcont = udr[page];
        pcont.map(item => recherches.push(`${page}: ${item}`))
    }
    for(let i = 0; i < recherches.length || i < 25; i++) {
        const rec = recherches[i];
        if(!rec) continue;
        const $rec = $(histem({
            text: rec
        }));
        $history.append($rec);
    }
    imgToSvg();
    
    loadFromHash();
    $("#__dom__page a").on("click", function(e) {
        loadFromHash();
    });
}