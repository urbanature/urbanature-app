import * as USERDATA from "../../src/data_manager/ud.js";
import * as BASEDATA from "../../src/data_manager/bd.js";

export const favorites = async (template) => {
    const favitem_ = await fetch("pages/profil/template/favitem.html").then(res => res.text());
    const favitem = _.template(favitem_);

    const favoris = await USERDATA.getFavorisAsync();
    let html = "";
    for(let i = 0; i < favoris.length || i < 5; i++) {
        if(!favoris[i]) continue;
        const {item: fav, table} = favoris[i];
        html += favitem({
            text: BASEDATA.getNameFromElement(table, fav)
        });
    }
    return _.template(template)({
        content: html
    });
}

export const history = async (template) => {
    const histem_ = await fetch("pages/profil/template/histem.html").then(res => res.text());
    const histem = _.template(histem_);
    const recherches = [];
    const udr = USERDATA.getAllRecherches();
    for(let page of Object.keys(udr)) {
        const pcont = udr[page];
        pcont.map(item => recherches.push(`${page}: ${item}`))
    }
    let html = "";
    for(let i = 0; i < recherches.length || i < 5; i++) {
        const rec = recherches[i];
        if(!rec) continue;
        html += histem({
            text: rec
        });
    }
    return _.template(template)({
        content: html
    });
}
