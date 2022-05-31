export const GLOBAL_DATA = {};
export const DEFAULT_DATA = { data: [], filter: [] };
export const flags = {
    loaded: false,
}
export const on = {
    load: () => {},
}

export const initData = async () => {
    const tables = await fetch("./database/db/tables.json").then(res => res.json());
    let remaining = tables.length;
    tables.forEach(async table => {
        const id = table.id;
        const data = fetch(`./database/db/data/${id}.json`)
                        .then(res => res.json())
                        .catch(err => {
                            console.error(err);
                        })
        const filter = fetch(`./database/db/filter/${id}.json`)
                        .then(res => res.json())
                        .catch(err => {
                            console.error(err);
                        })
        GLOBAL_DATA[id] = {
            name: table.name,
            data: await data, 
            filter: await filter,
        }
        GLOBAL_DATA[id].data.forEach((d, i, data) => {
            // with d.geo, generate L.geoJSON and add to data
            data[i].Lgeo = L.geoJSON(d.geo);
        });
            
        if(table.default) {
            DEFAULT_DATA.data = GLOBAL_DATA[id].data;
            DEFAULT_DATA.filter = GLOBAL_DATA[id].filter;
        }
        remaining--;
        if(remaining === 0) {
            flags.loaded = true;
            on.load();
        }
    });
}

export const getDataKeys = () => {
    return Object.keys(GLOBAL_DATA);
}

export const makeFilter = async (data, [...filters]) => {
    const prefix = GLOBAL_DATA[data].filter.prefix;
    let f = `${prefix} => `;
    filters.sort((a, b) => a.key.localeCompare(b.key));
    f += `(${filters[0].key} === '${filters[0].val}'`;
    for(let i = 1; i < filters.length; i++) {
        if(filters[i].key === filters[i-1].key) {
            f += ` || ${filters[i].key} === '${filters[i].val}'`;
        } else {
            f += `) && (${filters[i].key} === '${filters[i].val}'`;
        }
    }
    f += ')';
    /** @type {(elem) => boolean} */
    const res = eval(f);
    return res;
}

export const getFilters = (data) => {
    return GLOBAL_DATA[data].filter?.filters;
}

export const getFiltered = async (data, filtres) => {
    if(!filtres) {
        return GLOBAL_DATA[data].data;
    }
    return GLOBAL_DATA[data].data.filter(await makeFilter(data, filtres));
}


window.GLOBAL_DATA = GLOBAL_DATA;
window.DEFAULT_DATA = DEFAULT_DATA;
window.flags = flags;
window.on = on;
window.initData = initData;
window.getDataKeys = getDataKeys;
window.makeFilter = makeFilter;
window.getFilters = getFilters;
window.getFiltered = getFiltered;
