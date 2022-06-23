import * as BASEDATA from "../../src/data_manager/bd.js";

const getTexts = () => {
    return BASEDATA.getTablesByMetaData("type", "text");
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
    
    let tables;
    if(BASEDATA.flags.loaded) tables = getTexts();
    else BASEDATA.on.load = () => {tables = getTexts()};
    let html = "";

    if(source) {
        const t = tables.find(t => t.path == source);
        if(!t) return "";
        const tblist = t.table;
        tblist.sort((a, b) => a.name.localeCompare(b.name));
        console.log(tblist);
        for(let tb of tblist) {
            const data = await BASEDATA.fetchData(source, tb.key);
            const data_red = data.reduce((acc, cur) => {
                if(!acc.find(d => d.name == cur.name)) {
                    acc.push(cur);
                }
                return acc;
            }, []);
            data_red.sort((a, b) => a.name.localeCompare(b.name));
            html += section_texte({
                name: tb.name,
                key: t.path,
                href: `textes.${tb.name}`,
                content: data_red.map(d => textcard({
                    data: {...d, nom: d.name, meta:{img: ((d.meta?.img) || "database/img/noimg.png")}},
                    database: t.path,
                    href: `${t.path}.${d.info?.author}.${d.name}`,
                    page: "ecrit",
                    key: d.name,
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
                            meta:{img: img?.meta.img || "database/img/noimg.png"}
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

export const textes = async (template) => {
    const hash = window.location.hash.substring(1);
    const splitted = hash.split(".");
    let author, book;
    if(splitted.length >= 2) author = decodeURIComponent(splitted[1]);
    if(splitted.length >= 3) book   = decodeURIComponent(splitted[2]);

    const output = _.template(template);

    let table;
    if(BASEDATA.flags.loaded) table = await BASEDATA.fetchData("textes", author);
    else BASEDATA.on.load = async () => table = await BASEDATA.fetchData("textes", author);
    let html = ""; let tdata = {};
    if(book) {
        const contentbox_ = await fetch("pages/decouvrir/template/contentbox.html").then(r => r.text());
        const contentbox = _.template(contentbox_);
        const data = table.filter(t => t.name == book);
        if(!data) return "";
        html += data.map(t => contentbox({
            data: {
                ...t, nom: t.name, 
                info:{...t.info, contenu: t.info.contenu.replace(/\n/g, "<br>")}, 
                meta:{img: ((t.meta?.img) || "database/img/noimg.png")}
            },
        })).join("");
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
            if(!data.find(d => d.name == t.name)) {
                data.push({...t});
            }
        }
        data.sort((a, b) => a.name.localeCompare(b.name));
        html = data.map(t => textcard({
            data: {...t, nom: t.name, meta:{img: ((t.meta?.img) || "database/img/noimg.png")}},
            href: encodeURI(`textes.${author}.${t.name}`),
            page: "textes",
            key: t.name,
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