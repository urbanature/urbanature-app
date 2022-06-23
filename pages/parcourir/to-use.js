const csvToJson = (csv) => {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
}

export const parcours = async (template) => {
    const hash = window.location.hash.substring(1);
    const splitted = hash.split(".");
    let parcours = splitted[1];
    if(splitted[2]) {
        parcours += "#" + splitted[2];
    }
    return _.template(template)({id: parcours});
}

export const liste = async (template) => {
    const config = await fetch("https://totoshampoin.github.io/les-promenades-du-matrimoine--urbanature-edition/config-save.json").then(res => res.json());
    const el_t = await fetch("pages/parcourir/template/liste_el.html").then(res => res.text());
    let content = "";
    for(let key in config) {
        const json = config[key];
        const data = {
            id: key,
            titre: json.titre,
            image: json.visuel
        };
        const html = _.template(el_t)(data);
        content += html;
    }
    return _.template(template)({content: content});
}