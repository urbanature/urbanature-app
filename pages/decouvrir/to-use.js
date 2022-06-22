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
            console.log(data);
            // keep only 1 d.name in the list
            const data_red = data.reduce((acc, cur) => {
                if(!acc.find(d => d.name == cur.name)) {
                    acc.push(cur);
                }
                return acc;
            }, []);
            html += section_texte({
                name: tb.name,
                key: t.path,
                content: data_red.map(d => textcard({
                    data: {...d, nom: d.name, meta:{img: ((d.meta?.img) || "database/img/noimg.png")}},
                    database: t.path,
                    href: `${t.path}.${d.info?.author}.${d.name}`,
                    page: "ecrit",
                    key: d.name,
                    id: d.id,
                    // saveid: `textes,${d.info?.author},${d.name}`
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
                        // saveid: `textes,${d[0].info?.author},${d[0].id}`
                    });
                }).join(""),
            });
        }
    }

    return output({
        content: html,
    });
}