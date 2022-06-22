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
    console.log(parcours);
    return _.template(template)({id: parcours});
}

export const liste = async (template) => {
    const config = await fetch("https://totoshampoin.github.io/les-promenades-du-matrimoine--urbanature-edition/config.json").then(res => res.json());
    const el_t = await fetch("pages/parcourir/hashpages/liste_el.html").then(res => res.text());
    let content = "";
    for(let key in config) {
        try {
            const value = await fetch(config[key]).then(res => res.text());
            const json = csvToJson(value);
            const data = {
                id: key,
                titre: json[0].titre,
                image: json[0].visuel
            };
            const html = _.template(el_t)(data);
            content += html;
        } catch {}
    }
    console.log(content);
    return _.template(template)({content: content});
}