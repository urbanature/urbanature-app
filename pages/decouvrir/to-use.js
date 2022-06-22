import * as BASEDATA from "../../src/data_manager/bd.js";

const getTexts = () => {
    return BASEDATA.getTablesByMetaData("type", "text");
}

export const ecrit = async (template) => {
    const section_texte_ = await fetch("pages/decouvrir/template/section-texte.html").then(r => r.text());
    const textcard_ = await fetch("pages/decouvrir/template/textcard.html").then(r => r.text());
    const section_texte = _.template(section_texte_);
    const textcard = _.template(textcard_);
    const output = _.template(template);

    let tables;
    if(BASEDATA.flags.loaded) tables = getTexts();
    else BASEDATA.on.load = () => {tables = getTexts()};

    let html = "";
    for(let t of tables) {
        const data = []
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
                    database: t.path,
                    page: "ecrit",
                });
            }).join(""),
        });
    }

    return output({
        content: html,
    });
}