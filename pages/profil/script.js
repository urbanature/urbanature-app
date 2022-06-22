import * as USERDATA from "../../src/data_manager/ud.js";
import { imgToSvg } from "../../src/misc.js";

export const profil__init = async () => {
    const $favorite = $("#favorite");
    const $history = $("#history");

    const favitem_ = await fetch("pages/profil/template/favitem.html").then(res => res.text());
    const histem_ = await fetch("pages/profil/template/histem.html").then(res => res.text());

    const favitem = _.template(favitem_);
    const histem = _.template(histem_);

    const favoris = await USERDATA.getFavorisAsync();
    for(let i = 0; i < favoris.length || i < 5; i++) {
        const fav = favoris[i];
        if(!fav) continue;
        const $fav = $(favitem({
            text: fav.join(", ")
        }));
        $favorite.append($fav);
    }
    const recherches = [];
    const udr = USERDATA.getAllRecherches();
    for(let page of Object.keys(udr)) {
        const pcont = udr[page];
        pcont.map(item => recherches.push(`${page}: ${item}`))
    }
    for(let i = 0; i < recherches.length || i < 5; i++) {
        const rec = recherches[i];
        if(!rec) continue;
        const $rec = $(histem({
            text: rec
        }));
        $history.append($rec);
    }
    imgToSvg();
}