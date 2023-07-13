import * as BASEDATA from "../../src/data_manager/bd.js";
import * as USERDATA from "../../src/data_manager/ud.js";
import * as SEARCH_ENGINE from "../../src/search.js";
import { loadFromHash } from "./loader.js";


/** Si un template nécessite des données de BASEDATA, appeler la variable suivante (avec un await): */
const dataReady = new Promise(async (res, rej) => {
    if(BASEDATA.flags.loaded) res();
    BASEDATA.onload(res);
})

const getTexts = () => {
    return BASEDATA.getTablesByMetaData("type", "text");
}
const getImages = () => {
    return BASEDATA.getTablesByMetaData("type", "image");
}

export const ecrit = async (template) => {
    const hash = window.location.hash.substring(1);
    const splitted = hash.split(".");
    let source = splitted[1];
    
    const section_texte_ = await fetch("pages/decouvrir/template/section-texte.html").then(r => r.text());
    const textcard_ = await fetch("pages/decouvrir/template/textcard.html").then(r => r.text());
    const section_texte = _.template(section_texte_);
    const textcard = _.template(textcard_);
    const output = _.template(template);
    
    await dataReady
    let tables = getTexts();
    let html = "";

    if(source) {
        const t = tables.find(t => t.path == source);
        if(!t) return "";
        const tblist = t.table;
        tblist.sort((a, b) => a.name.localeCompare(b.name));
        for(let tb of tblist) {
            const data = await BASEDATA.fetchData(source, tb.key);
            const data_red = data.reduce((acc, cur) => {
                if(!acc.find(d => d.nom == cur.nom)) {
                    acc.push(cur);
                }
                return acc;
            }, []);
            data_red.sort((a, b) => a.nom.localeCompare(b.nom));
            html += section_texte({
                name: tb.name,
                key: t.path,
                href: `textes.${tb.name}`,
                content: data_red.map(d => textcard({
                    data: {...d, nom: d.nom, meta:{img: ((d.meta?.img) || "database/img/noimg.webp")}},
                    database: t.path,
                    href: `${t.path}.${d.info?.author}.${d.nom}`,
                    page: "ecrit",
                    key: d.nom,
                    id: d.id,
                    saveid: `textes,${d.info?.author},${d.id}`
                })).join("")
            });
        }
    } else {
        for(let t of tables) {
            const data = [];
            for(let tb of t.table) {
                data.push((await BASEDATA.fetchData(t.path, tb.key)));
            }
            data.sort((a, b) => a[0].info.author.localeCompare(b[0].info.author));
            html += section_texte({
                name: t.name,
                key: t.path,
                href: `ecrit.${t.path}`,
                content: data.map(d => {
                    const img = d.find(e => e.meta?.img);
                    return textcard({
                        data: {
                            ...d[0],
                            nom: undefined,
                            meta:{img: img?.meta.img || "database/img/noimg.webp"}
                        },
                        href: `${t.path}.${d[0].info?.author}`,
                        page: "ecrit",
                        key: d[0].info?.author,
                        id: d[0].id,
                        saveid: `textes,${d[0].info?.author},${d[0].id}`
                    });
                }).join(""),
            });
        }
    }

    return output({
        content: html,
    });
}

export const icono = async (template) => {
    const hash = window.location.hash.substring(1);
    const splitted = hash.split(".");
    let source = splitted[1];

    const section_icono_ = await fetch("pages/decouvrir/template/section-icono.html").then(r => r.text());
    const icocard_ = await fetch("pages/decouvrir/template/icocard.html").then(r => r.text());
    const section_icono = _.template(section_icono_);
    const icocard = _.template(icocard_);
    const output = _.template(template);

    await dataReady
    let tables = getImages();
    let html = "";

    if(source) {
        const t = tables.find(t => t.path == source);
        if(!t) return "";
        const tblist = t.table;
        const data = [];
        for(let tb of t.table) {
            data.push(...(await BASEDATA.fetchData(t.path, tb.key)));
        }
        data.sort((a, b) => a.info.author.localeCompare(b.info.author));
        html += "<ul class='icono-list'>";
        html += data.map(d => {
            return icocard({
                data: {...d, info: {...d.info, src: d.info.src || "database/img/noimg.webp"}},
                href: `${t.path}.${d.info?.author}`,
                page: "icono",
                key: d.info.author,
                id: d.id,
                saveid: `iconos,${d.info?.author},${d.id}`
            });
        }).join("");
        html += "</ul>";
    } else {
        for(let t of tables) {
            const data = [];
            for(let tb of t.table) {
                data.push(...(await BASEDATA.fetchData(t.path, tb.key)));
            }
            data.sort((a, b) => a.info.author.localeCompare(b.info.author));
            html += section_icono({
                name: t.name,
                key: t.path,
                href: `icono.${t.path}`,
                img: data.map(d => d.info.src)
                // content: data.map(d => {
                //     return icocard({
                //         data: {}
                //     });
                // }).join(""),
            });
        }
    }
    return output({
        content: html,
    });
}

export const textes = async (template) => {
    const hash = window.location.hash.substring(1);
    const splitted = hash.split(".");
    let author, book;
    if(splitted.length >= 2) author = decodeURIComponent(splitted[1]);
    if(splitted.length >= 3) book   = decodeURIComponent(splitted[2]);

    const output = _.template(template);

    await dataReady
    let table = await BASEDATA.fetchData("textes", author);
    console.log(table);
    let html = ""; let tdata = {};
    if(book) {
        const contentbox_ = await fetch("pages/decouvrir/template/contentbox.html").then(r => r.text());
        const contentbox = _.template(contentbox_);
        const data = table.filter(t => t.nom == book);
        if(!data) return "";
        html += data.map(t => contentbox({
            data: {
                ...t, 
                info:{...t.info, contenu: t.info.contenu.replace(/\n/g, "<br>")}, 
                meta:{img: ((t.meta?.img) || "database/img/noimg.webp")}
            },
            sid: `textes,${t.info?.author},${t.id}`,
        })).join("");
        console.log(html);
        tdata = {
            content: html,
            name: author,
        }
    } else {
        const liste_texte_ = await fetch("pages/decouvrir/template/liste-texte.html").then(r => r.text());
        const textcard_ = await fetch("pages/decouvrir/template/textcard.html").then(r => r.text());
        const liste_texte = _.template(liste_texte_);
        const textcard = _.template(textcard_);
        const data = [];
        for(let t of table) {
            if(!data.find(d => d.nom == t.nom)) {
                data.push({...t});
            }
        }
        data.sort((a, b) => a.nom.localeCompare(b.nom));
        html = data.map(t => textcard({
            data: {...t, meta:{img: ((t.meta?.img) || "database/img/noimg.webp")}},
            href: encodeURI(`textes.${author}.${t.nom}`),
            page: "textes",
            key: t.nom,
            id: t.id,
            saveid: `textes,${author},${t.id}`
        })).join("");
        tdata = {
            name: author,
            content: liste_texte({
                content: html,
            })
        };
    }
    return output(tdata);
}

export const textes_button = async () => {
    $(".contentbox__save input").on("change", function(e) {
        const sid = $(this).attr("id").split(",");
        if($(this).is(":checked")) {
            USERDATA.addFavoris(...sid);
        } else {
            USERDATA.removeFavoris(...sid);
        }
    }).each(function(i, e) {
        const sid = $(this).attr("id").split(",");
        if(USERDATA.isFavoris(...sid)) {
            $(this).prop("checked", true);
        }
    });
}

const castSearch = async (table, query) => {
    const res = await SEARCH_ENGINE.searchInTable(table.path, query);
    return res.reduce((acc, cur) => {
        if(!acc.find(d => d.data.nom == cur.data.nom)) {
            acc.push(cur);
        }
        return acc;
    }, []);
}

export const search = async () => {
    const tables = BASEDATA.getDatabases().map(BASEDATA.getTableMetaData);
    const searchitem_ = await fetch("pages/decouvrir/template/searchitem.html").then(r => r.text());
    const searchitem = _.template(searchitem_);
    console.log(tables);
    $("#decouvrir-search").on("submit", async function(e) {
        e.preventDefault();
        const search = $(this).find("input").val();
        const results = [];
        let html = "";
        for(let t of tables.filter(t => t.type == "text")) {
            const res = await castSearch(t, search);
            if(res.length > 0) {
                results.push(...res);
                html += res.map(t => searchitem({
                    title: (t.data.nom.length > 36) ? t.data.nom.substring(0, 33) + "..." : t.data.nom,
                    author: t.data.info.author,
                    img: t.data.meta.img,
                    href: `textes.${t.data.info.author}.${t.data.nom}`,
                })).join("");
            }
        }
        $("#decouvrir-search-results").html(html);
        $(".searchitem__img").on("error", function() {
            $(this).attr("src", "database/img/noimg.webp");
        });
        $(".searchitem").on("click", function(e) {
            loadFromHash();
        });
    });
}

export const html = async (template) => {
    const hash = window.location.hash.substring(1);
    const [,...path] = hash.split(".");
    const content = await fetch(`database/html/${path.join("/")}.html`).then(r => r.text());
    return _.template(template)({content});
}
